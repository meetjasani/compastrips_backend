import jwt from "jsonwebtoken";
import { jwtSecret } from "../../config";

function decodeToken(token) {
  return jwt.decode(token.replace("Bearer ", ""));
}

async function getAuthUser(token) {
  try {
    const tokenData = decodeToken(token);
  } catch (e) {
    return null;
  }
}

function getJWTToken(data) {
  const token = `Bearer ${jwt.sign(data, jwtSecret)}`;
  return token;
}

export { decodeToken, getJWTToken };
