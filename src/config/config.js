import "dotenv/config";

const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  jwtToken: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
  graphqlUrl: process.env.GRAPHQL_URL,
};

export default config;