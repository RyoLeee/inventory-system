import { GraphQLClient } from "graphql-request";
import config from "./src/config/config.js";

const client = new GraphQLClient(config.graphqlUrl);

export const setToken = (token) => {
  client.setHeader("Authorization", `Bearer ${token}`);
};

export const api = {
  login({ email, password }) {
    return client.request(
      `
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          token
          user {
            id
            name
            email
            role
          }
        }
      }
      `,
      { input: { email, password } }
    );
  },

  register({ name, email, password }) {
    return client.request(
      `
      mutation Register($input: RegisterInput!) {
        register(input: $input) {
          token
          user {
            id
            name
            email
            role
          }
        }
      }
      `,
      { input: { name, email, password } }
    );
  },

  logout() {
    return client.request(`
      mutation {
        logout
      }
    `);
  },

  getUsers() {
    return client.request(`
      query {
        users {
          id
          name
          email
          role
        }
      }
    `);
  },

  getUserById(id) {
    return client.request(
      `
      query User($id: ID!) {
        user(id: $id) {
          id
          name
          email
          role
        }
      }
      `,
      { id }
    );
  },

  createUser(input) {
    return client.request(
      `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id
          name
          email
          role
        }
      }
      `,
      { input }
    );
  },

  getProducts() {
    return client.request(`
      query {
        products {
          id
          name
          price
          quantityInStock
          category { id name }
          user { id name }
        }
      }
    `);
  },

  getProductById(id) {
    return client.request(
      `
      query Product($id: ID!) {
        product(id: $id) {
          id
          name
          description
          price
          quantityInStock
        }
      }
      `,
      { id }
    );
  },

  createProduct(input) {
    return client.request(
      `
      mutation CreateProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
          id
          name
          price
        }
      }
      `,
      { input }
    );
  },

  updateProduct(id, input) {
    return client.request(
      `
      mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
        updateProduct(id: $id, input: $input) {
          id
          name
          price
        }
      }
      `,
      { id, input }
    );
  },

  deleteProduct(id) {
    return client.request(
      `
      mutation DeleteProduct($id: ID!) {
        deleteProduct(id: $id)
      }
      `,
      { id }
    );
  },

  getCategories() {
    return client.request(`
      query {
        categories {
          id
          name
        }
      }
    `);
  },

  createCategory(input) {
    return client.request(
      `
      mutation CreateCategory($input: CreateCategoryInput!) {
        createCategory(input: $input) {
          id
          name
        }
      }
      `,
      { input }
    );
  },

  getOrders() {
    return client.request(`
      query {
        orders {
          id
          date
          totalPrice
          customerName
        }
      }
    `);
  },

  createOrder(input) {
    return client.request(
      `
      mutation CreateOrder($input: CreateOrderInput!) {
        createOrder(input: $input) {
          id
          date
          totalPrice
        }
      }
      `,
      { input }
    );
  },

  createOrderItem(input) {
    return client.request(
      `
      mutation CreateOrderItem($input: CreateOrderItemInput!) {
        createOrderItem(input: $input) {
          id
          quantity
          unitPrice
          product { name }
        }
      }
      `,
      { input }
    );
  },
};
