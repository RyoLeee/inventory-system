import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";

import helmet from "helmet";
import cors from "cors";
import xss from "xss-clean";
import compression from "compression";

import config from "./src/config/config.js";
import { resolvers } from "./src/graphql/resolver.js";
import { auth } from "./src/middlewares/auth.js";

const app = express();

app.use(helmet());
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(compression());

const prisma = new PrismaClient();

async function startServer() {
  try {
    await prisma.$connect();
    console.log("MySQL connected via Prisma");

    const typeDefs = readFileSync("./src/graphql/schema.graphql", "utf8");

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      formatError: (err) => {
        const ext = err.extensions || {};

        return {
          message: err.message,
          code: ext.code || "INTERNAL_SERVER_ERROR",
          httpCode: ext.httpCode || 500,
          details: ext.details || null,
        };
      },
    });

    await server.start();

    app.use(
      "/graphql",
      express.json(),
      expressMiddleware(server, {
        context: async ({ req }) => {
          const user = await auth(req);
          return { user };
        },
      }),
    );

    app.get("/", (req, res) => {
      res.send("API is running");
    });

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`GraphQL → http://localhost:${config.port}/graphql`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

startServer();

export default app;
