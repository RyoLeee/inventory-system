import { api } from "./api.js"
import readline from "readline";
import {setToken} from "./api.js"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export let currentUser = null;

const ask = (q) =>
  new Promise((resolve) => rl.question(q, (ans) => resolve(ans)));

async function authMenu() {
  console.clear();
  console.log("=== AUTH MENU ===");
  console.log("1. Register");
  console.log("2. Login");
  console.log("0. Exit");

  const choice = await ask("> ");

  if (choice === "1") {
    const name = await ask("Name: ");
    const email = await ask("Email: ");
    const password = await ask("Password: ");

    const res = await api.register({name, email, password})
    currentUser = res.register;
    setToken(currentUser.token);
    console.log("Registered!");
    return mainMenu()
  }

  if (choice === "2") {
    const email = await ask("Email: ");
    const password = await ask("Password: ");

    const res = await api.login({email, password})
    currentUser = res.login;
    setToken(currentUser.token)

    console.log("Login success!");
    return mainMenu();
  }
  rl.close();
}

async function mainMenu() {
  console.clear();
  console.log("=== MAIN MENU ===");
  console.log("1. Users");
  console.log("2. Products");
  console.log("3. Categories");
  console.log("4. Orders");
  console.log("5. Logout");

  const choice = await ask("> ");

  if (choice === "1") return usersMenu();
  if (choice === "2") return productsMenu();
  if (choice === "3") return categoriesMenu();
  if (choice === "4") return ordersMenu();

  if (choice === "5") {
    await api.logout();
    return authMenu();
  }

  return mainMenu();
}

async function usersMenu() {
  console.clear();
  console.log("=== USERS ===");
  console.log("1. Create Users")
  console.log("2. Get Users");
  console.log("3. Get User By ID");
  console.log("0. Back");

  const c = await ask("> ");

  if (c === "1") {
    
    const res = await api.createUser({})
  }
  if (c === "2") {
    const res = await api.getUsers();
    console.log(res.users);
    await ask("\nEnter...");
  }

  if (c === "3") {
    const id = await ask("User ID: ");
    const res = await api.getIserById({id});
    console.log(res.data);
    await ask("\nEnter...");
  }

  return mainMenu();
}

async function productsMenu() {
  console.clear();
  console.log("=== PRODUCTS ===");
  console.log("1. Create Product");
  console.log("2. Get Products");
  console.log("0. Back");

  const c = await ask("> ");

  if (c === "1") {
    const name = await ask("Name: ");
    const price = await ask("Price: ");
    const qty = await ask("Stock: ");
    const categoryId = await ask("Category ID: ");

    const res = await authApi.post("/products", {
      name,
      price: Number(price),
      quantityInStock: Number(qty),
      categoryId,
    });

    console.log(res.data);
    await ask("\nEnter...");
  }

  if (c === "2") {
    const res = await api.get("/products");
    console.log(res.data);
    await ask("\nEnter...");
  }

  return mainMenu();
}

async function categoriesMenu() {
  console.clear();
  console.log("=== CATEGORIES ===");
  console.log("1. Create Category");
  console.log("2. Get Categories");
  console.log("0. Back");

  const c = await ask("> ");

  if (c === "1") {
    const name = await ask("Name: ");
    const res = await authApi.post("/categories", { name });
    console.log(res.data);
    await ask("\nEnter...");
  }

  if (c === "2") {
    const res = await api.get("/categories");
    console.log(res.data);
    await ask("\nEnter...");
  }

  return mainMenu();
}

async function ordersMenu() {
  console.clear();
  console.log("=== ORDERS ===");
  console.log("1. Create Order");
  console.log("2. Get Orders");
  console.log("0. Back");

  const c = await ask("> ");

  if (c === "1") {
    const status = await ask("Status: ");
    const res = await authApi.post("/orders", { status });
    console.log(res.data);
    await ask("\nEnter...");
  }

  if (c === "2") {
    const res = await authApi.get("/orders");
    console.log(res.data);
    await ask("\nEnter...");
  }

  return mainMenu();
}

authMenu();
