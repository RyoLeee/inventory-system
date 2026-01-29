import {
    registerService,
    loginService,
    logoutService,
    getUsersService,
    createUserService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
    createProductService,
    getProductsService,
    getProductByIdService,
    updateProductService,
    deleteProductService,
    getProductsByUserService,
    createCategoryService,
    getCategoriesService,
    getCategoryByIdService,
    updateCategoryService,
    deleteCategoryService,
    createOrderService,
    getOrdersService,
    updateOrderService,
    getOrderByIdService,
    deleteOrderService,
    createOrderItemService,
    getOrderItemsService,
    getOrderItemByIdService,
    updateOrderItemService,
    deleteOrderItemService,
    getOrderItemsByOrderService,
  } from "../services/services.js";
  import AppGraphQLError from "../utils/AppGraphQLError.js";
  
  const asyncHandler = (fn) => async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  export const register = asyncHandler(async (req, res) => {
    const user = await registerService(req.body);
    res.json(user);
  });
  
  export const login = asyncHandler(async (req, res) => {
    const data = await loginService(req.body);
    res.json(data);
  });
  
  export const logout = asyncHandler(async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    await logoutService(token);
    res.json({ message: "Logged out" });
  });
  
  export const getUsers = asyncHandler(async (req, res) => {
    res.json(await getUsersService());
  });

  export const createUsers = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) | 1;
    const SIZE = 5;
    const user = await createUserService(page, SIZE);
    res.json(user);
  })
  
  export const getUserById = asyncHandler(async (req, res) => {
    res.json(await getUserByIdService(req.params.userId));
  });
  
  export const updateUser = asyncHandler(async (req, res) => {
    res.json(await updateUserService(req.params.userId, req.body));
  });
  
  export const deleteUser = asyncHandler(async (req, res) => {
    await deleteUserService(req.params.userId);
    res.json({ message: "Deleted" });
  });
  
  export const createProduct = asyncHandler(async (req, res) => {
    res.json(await createProductService(req.body, req.user.id));
  });
  
  export const getProducts = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) | 1;
    const SIZE = 5;
    res.json(await getProductsService(page, SIZE));
  });
  
  export const getProductById = asyncHandler(async (req, res) => {
    res.json(await getProductByIdService(req.params.productId));
  });
  
  export const updateProduct = asyncHandler(async (req, res) => {
    res.json(await updateProductService(req.params.productId, req.body));
  });
  
  export const deleteProduct = asyncHandler(async (req, res) => {
    await deleteProductService(req.params.productId);
    res.json({ message: "Deleted" });
  });
  
  export const getProductsByUser = asyncHandler(async (req, res) => {
    res.json(await getProductsByUserService(req.params.userId));
  });
  
  export const createCategory = asyncHandler(async (req, res) => {
    res.json(await createCategoryService(req.body));
  });
  
  export const getCategories = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) | 1;
    const SIZE = 5;
    res.json(await getCategoriesService(page, SIZE));
  });
  
  export const getCategoryById = asyncHandler(async (req, res) => {
    res.json(await getCategoryByIdService(req.params.categoryId));
  });
  
  export const updateCategory = asyncHandler(async (req, res) => {
    res.json(await updateCategoryService(req.params.categoryId, req.body));
  });
  
  export const deleteCategory = asyncHandler(async (req, res) => {
    await deleteCategoryService(req.params.categoryId);
    res.json({ message: "Deleted" });
  });
  
  export const createOrder = asyncHandler(async (req, res) => {
    res.json(await createOrderService(req.body, req.user.id));
  });
  
  export const getOrders = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) | 1;
    const SIZE = 5;
    res.json(await getOrdersService(page, SIZE));
  });
  
  export const getOrderById = asyncHandler(async (req, res) => {
    res.json(await getOrderByIdService(req.params.orderId));
  });

  export const updateOrder = asyncHandler(async (req, res) => {
    res.json(await updateOrderService(req.params.orderId, req.body))
  })
  
  export const deleteOrder = asyncHandler(async (req, res) => {
    await deleteOrderService(req.params.orderId);
    res.json({ message: "Deleted" });
  });
  
  export const createOrderItem = asyncHandler(async (req, res) => {
    res.json(await createOrderItemService(req.body));
  });
  
  export const getOrderItems = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) | 1;
    const SIZE = 5;
    res.json(await getOrderItemsService(page, SIZE));
  });
  
  export const getOrderItemById = asyncHandler(async (req, res) => {
    res.json(await getOrderItemByIdService(req.params.orderItemId));
  });
  
  export const updateOrderItem = asyncHandler(async (req, res) => {
    res.json(await updateOrderItemService(req.params.orderItemId, req.body));
  });

  export const deleteOrderItem = asyncHandler(async (req, res) => {
    await deleteOrderItemService(req.params.orderItemId);
    res.json({ message: "Deleted" });
  });
  
  export const getOrderItemsByOrder = asyncHandler(async (req, res) => {
    res.json(await getOrderItemsByOrderService(req.params.orderId));
  });
  