import { api, setToken } from "./api.js";

async function runTests() {
  try {
    console.log("=== REGISTER ===");
    const reg = await api.register({
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      password: "123456",
    });
    console.log(reg);

    setToken(reg.register.token);

    console.log("\n=== LOGIN ===");
    const login = await api.login({
      email: reg.register.user.email,
      password: "123456",
    });
    console.log(login);
    setToken(login.login.token);

    console.log("\n=== CREATE CATEGORY ===");
    const cat = await api.createCategory({ name: "Electronics" });
    console.log(cat);
    const categoryId = cat.createCategory.id;

    console.log("\n=== GET CATEGORIES ===");
    const cats = await api.getCategories();
    console.log(cats);

    console.log("\n=== CREATE PRODUCT ===");
    const prod = await api.createProduct({
      name: "Laptop",
      description: "Test product",
      price: 1500,
      quantityInStock: 10,
      categoryId,
    });
    console.log(prod);
    const productId = prod.createProduct.id;

    console.log("\n=== GET PRODUCTS ===");
    const products = await api.getProducts();
    console.log(products);

    console.log("\n=== GET PRODUCT BY ID ===");
    const productById = await api.getProductById(productId);
    console.log(productById);

    console.log("\n=== UPDATE PRODUCT ===");
    const updatedProduct = await api.updateProduct(productId, {
      price: 1700,
    });
    console.log(updatedProduct);

    console.log("\n=== CREATE ORDER ===");
    const order = await api.createOrder({
      date: new Date().toISOString(),
      customerName: "Ryo",
      customerEmail: "ryo@test.com",
    });
    console.log(order);
    const orderId = order.createOrder.id;

    console.log("\n=== GET ORDERS ===");
    const orders = await api.getOrders();
    console.log(orders);

    console.log("\n=== CREATE ORDER ITEM ===");
    const orderItem = await api.createOrderItem({
      orderId,
      productId,
      quantity: 2,
      unitPrice: 1700,
    });
    console.log(orderItem);

    console.log("\n=== GET USERS ===");
    const users = await api.getUsers();
    console.log(users);

    const firstUserId = users.users[0]?.id;
    if (firstUserId) {
      console.log("\n=== GET USER BY ID ===");
      const userById = await api.getUserById(firstUserId);
      console.log(userById);
    }

    console.log("\n=== LOGOUT ===");
    const out = await api.logout();
    console.log(out);

    console.log("\nALL TESTS FINISHED SUCCESSFULLY.");
  } catch (err) {
    console.error("\nTEST FAILED:");
    console.error(err);
  }
}

runTests();
