import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js"
import config from "../config/config.js";

export async function auth(req) {
  if (!req || !req.headers || !req.headers.authorization) {
    return null;
  }

  const header = req.headers.authorization;
  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, config.jwtToken);

    const saved = await prisma.token.findFirst({
      where: { token, blacklisted: false },
    });

    if (!saved) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) return null;

    return user;
  } catch {
    return null;
  }
}

export const verifyToken = auth;

export function role(allowed = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { role } = req.user;

    if (role === "admin") {
      return next();
    }

    if (role === "user") {
      if (!allowed.includes("user")) {
        return res.status(403).json({ message: "Forbidden" });
      }
      return next();
    }

    return res.status(403).json({ message: "Forbidden" });
  };
}
