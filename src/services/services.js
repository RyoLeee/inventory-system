import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";
import AppGraphQLError from "../utils/AppGraphQLError.js";

export async function registerService({ name, email, password }) {
  const hashed = await bcrypt.hash(password, 10);
  const count = await prisma.user.count();

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: count <= 50 ? "admin" : "user",
    },
  });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  await prisma.token.create({
    data: {
      userId: user.id,
      token,
      type: "access",
      expires: new Date(Date.now() + 86400000),
    },
  });

  return { user, token };
}

export async function loginService({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppGraphQLError("Invalid credentials", {
      code: "UNAUTHORIZED",
      httpCode: 401,
    });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new AppGraphQLError("Invalid credentials", {
      code: "UNAUTHORIZED",
      httpCode: 401,
    });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  await prisma.token.create({
    data: {
      userId: user.id,
      token,
      type: "access",
      expires: new Date(Date.now() + 86400000),
    },
  });

  return { user, token };
}

export async function logoutService(token) {
  return prisma.token.updateMany({
    where: { token },
    data: { blacklisted: true },
  });
}

export const getUsersService = (page = 1, size = 10) => {
  const skip = (page - 1) * size;
  return prisma.user.findMany({ skip, take: size });
};

export const createUserService = async ({ name, email, password }) => {
  const hashed = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { name, email, password: hashed, role: "user" },
  });
};

export const getUserByIdService = (id) =>
  prisma.user.findUnique({ where: { id } });

export const updateUserService = (id, data) =>
  prisma.user.update({ where: { id }, data });

export const deleteUserService = (id) => prisma.user.delete({ where: { id } });

export const createProductService = (data, userId) =>
  prisma.product.create({
    data: { ...data, userId },
    include: {
      category: true,
      user: true,
    },
  });

export const getProductsService = (page = 1, size = 10) => {
  const skip = (page - 1) * size;
  return prisma.product.findMany({
    skip,
    take: size,
    include: {
      category: true,
      user: true,
    },
  });
};

export const getProductByIdService = (id) =>
  prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      user: true,
    },
  });

export const updateProductService = (id, data) =>
  prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
      user: true,
    },
  });

export const deleteProductService = (id) =>
  prisma.product.delete({ where: { id } });

export const getProductsByUserService = (userId) =>
  prisma.product.findMany({
    where: { userId },
    include: {
      category: true,
      user: true,
    },
  });

export const createCategoryService = (data) => prisma.category.create({ data });

export const getCategoriesService = (page = 1, size = 10) => {
  const skip = (page - 1) * size;
  return prisma.category.findMany({ skip, take: size });
};

export const getCategoryByIdService = (id) =>
  prisma.category.findUnique({ where: { id } });

export const updateCategoryService = (id, data) =>
  prisma.category.update({ where: { id }, data });

export const deleteCategoryService = (id) =>
  prisma.category.delete({ where: { id } });

export const createOrderService = (data, userId) =>
  prisma.order.create({
    data: {
      ...data,
      userId,
      totalPrice: 0,
    },
  });

export const getOrdersService = (page = 1, size = 10) => {
  const skip = (page - 1) * size;
  return prisma.order.findMany({
    skip,
    take: size,
  });
};

export const getOrderByIdService = (id) =>
  prisma.order.findUnique({ where: { id } });

export const updateOrderService = (id, data) =>
  prisma.order.update({ where: { id }, data });

export const deleteOrderService = (id) =>
  prisma.order.delete({ where: { id } });

export async function createOrderItemService(data) {
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });

  if (!product) throw new Error("Product not found");

  if (product.quantityInStock < data.quantity) {
    throw new Error("The remaining stock is less than desired amount");
  }

  await prisma.product.update({
    where: { id: data.productId },
    data: {
      quantityInStock: product.quantityInStock - data.quantity,
    },
  });

  const item = await prisma.orderItem.create({
    data: {
      orderId: data.orderId,
      productId: data.productId,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
    },
    include: {
      product: true, 
    },
  });

  await prisma.order.update({
    where: { id: data.orderId },
    data: {
      totalPrice: {
        increment: data.quantity * data.unitPrice,
      },
    },
  });

  return item;
}

export const getOrderItemsService = (page = 1, size = 10) => {
  const skip = (page - 1) * size;
  return prisma.orderItem.findMany({ skip, take: size });
};

export const getOrderItemByIdService = (id) =>
  prisma.orderItem.findUnique({ where: { id } });

export const updateOrderItemService = (id, data) =>
  prisma.orderItem.update({ where: { id }, data });

export const deleteOrderItemService = (id) =>
  prisma.orderItem.delete({ where: { id } });

export const getOrderItemsByOrderService = (orderId) =>
  prisma.orderItem.findMany({ where: { orderId } });