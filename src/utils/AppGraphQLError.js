import { GraphQLError } from "graphql";

export default class AppGraphQLError extends GraphQLError {
  constructor(message, options = {}) {
    const {
      code = "INTERNAL_SERVER_ERROR",
      httpCode = 500,
      details = null,
    } = options;

    super(message, {
      extensions: {
        code,
        httpCode,
        details,
      },
    });
  }
}





