import {
  registerService,
  loginService,
  logoutService,

  getUsersService,
  createUserService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  getProductsByUserService,

  createProductService,
  getProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,

  createCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,

  createOrderService,
  getOrdersService,
  getOrderByIdService,
  updateOrderService,
  deleteOrderService,

  createOrderItemService,
  getOrderItemsService,
  getOrderItemByIdService,
  updateOrderItemService,
  deleteOrderItemService,
  getOrderItemsByOrderService,
} from "../services/services.js";
import AppGraphQLError from "../utils/AppGraphQLError.js";
import {
  registerSchema,
  loginSchema,
  createUserSchema,
  createProductSchema,
  createCategorySchema,
  createOrderSchema,
  createOrderItemSchema,
} from "../validations/validations.js";

const validate = (schema, input) => {
  const { error } = schema.validate(input);
  if (error) {
    throw new AppGraphQLError(error.message, {
      code: "VALIDATION_ERROR",
      httpCode: 400,
    });
  }
};

const authError = (type) => {
  if (type === "UNAUTHORIZED") {
    return new AppGraphQLError("Unauthorized", {
      code: "UNAUTHORIZED",
      httpCode: 401,
    });
  }

  if (type === "FORBIDDEN") {
    return new AppGraphQLError("Forbidden", {
      code: "FORBIDDEN",
      httpCode: 403,
    });
  }
};

export const resolvers = {
  Query: {
    me: (_, __, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return ctx.user;
    },

    users: (_, __, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      if (ctx.user.role !== "admin") throw authError("FORBIDDEN");
      return getUsersService(1, 5);
    },

    user: (_, { id }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return getUserByIdService(id);
    },

    products: (_, __, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return getProductsService(1, 5);
    },

    product: (_, { id }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return getProductByIdService(id);
    },

    productsByUser: (_, { userId }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return getProductsByUserService(userId);
    },

    categories: (_, __, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return getCategoriesService(1, 5);
    },

    category: (_, { id }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return getCategoryByIdService(id);
    },

    orders: (_, __, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return getOrdersService(1, 5);
    },

    order: (_, { id }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return getOrderByIdService(id);
    },

    orderItems: (_, __, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return getOrderItemsService(1, 5);
    },

    orderItem: (_, { id }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return getOrderItemByIdService(id);
    },

    orderItemsByOrder: (_, { orderId }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return getOrderItemsByOrderService(orderId);
    },
  },

  Mutation: {
    register: (_, { input }) => {
      validate(registerSchema, input);
      return registerService(input);
    },
  
    login: (_, { input }) => {
      validate(loginSchema, input);
      return loginService(input);
    },
  
    logout: (_, __, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return logoutService(ctx.token).then(() => true);
    },
  
    createUser: (_, { input }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      if (ctx.user.role !== "admin") throw authError("FORBIDDEN");
      validate(createUserSchema, input);
      return createUserService(1, 5, input);
    },
  
    updateUser: (_, { id, input }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      if (ctx.user.role !== "admin") throw authError("FORBIDDEN");
      return updateUserService(id, input);
    },
  
    deleteUser: (_, { id }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      if (ctx.user.role !== "admin") throw authError("FORBIDDEN");
      return deleteUserService(id).then(() => true);
    },
  
    createProduct: (_, { input }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      validate(createProductSchema, input);
      return createProductService(input, ctx.user.id);
    },
  
    updateProduct: (_, { id, input }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return updateProductService(id, input);
    },
  
    deleteProduct: (_, { id }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return deleteProductService(id).then(() => true);
    },
  
    createCategory: (_, { input }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      if (ctx.user.role !== "admin") throw authError("FORBIDDEN");
      validate(createCategorySchema, input);
      return createCategoryService(input);
    },
  
    updateCategory: (_, { id, input }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      if (ctx.user.role !== "admin") throw authError("FORBIDDEN");
      return updateCategoryService(id, input);
    },
  
    deleteCategory: (_, { id }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      if (ctx.user.role !== "admin") throw authError("FORBIDDEN");
      return deleteCategoryService(id).then(() => true);
    },
  
    createOrder: (_, { input }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      validate(createOrderSchema, input);
      return createOrderService(input, ctx.user.id);
    },
  
    updateOrder: (_, { id, input }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return updateOrderService(id, input);
    },
  
    deleteOrder: (_, { id }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return deleteOrderService(id).then(() => true);
    },
  
    createOrderItem: (_, { input }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      validate(createOrderItemSchema, input);
      return createOrderItemService(input);
    },
  
    updateOrderItem: (_, { id, input }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return updateOrderItemService(id, input);
    },
  
    deleteOrderItem: (_, { id }, ctx) => {
      if (!ctx.user) throw authError("UNAUTHORIZED");
      return deleteOrderItemService(id).then(() => true);
    },
  },  
};
