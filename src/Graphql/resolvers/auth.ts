import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AuthenticationError } from "apollo-server-express";
import { user } from "../../model/UserModel";

const jwtsecret = process.env.JWT_SECRET as string;

export const authMiddleware = async (resolve: any, root: any, args: any, context: any, info: any) => {
  const { req, res } = context;
  const token = req.cookies.token;

  try {
    if (!token) {
      throw new AuthenticationError("You must be logged in.");
    }

    const decoded = jwt.verify(token, jwtsecret) ;

if (typeof decoded === 'string') {
  throw new AuthenticationError('Invalid token');
}

const userCheck = await user.findById(decoded._id);

if (!userCheck) {
  throw new AuthenticationError('Invalid token');
}
    req.user = user;

    return resolve(root, args, context, info);
  } catch (err) {
    console.error(err);
    throw new AuthenticationError("Invalid token.");
  }
};
