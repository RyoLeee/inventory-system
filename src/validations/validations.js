import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "admin").optional(),
});

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(5).required(),
  price: Joi.number().positive().required(),
  quantityInStock: Joi.number().integer().min(0).required(),
  categoryId: Joi.string().required(),
});

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
});

export const createOrderSchema = Joi.object({
  date: Joi.date().required(),
  customerName: Joi.string().min(2).required(),
  customerEmail: Joi.string().email().required(),
});

export const createOrderItemSchema = Joi.object({
  orderId: Joi.string().required(),
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  unitPrice: Joi.number().positive().required(),
});
