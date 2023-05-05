import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import db from "./config/database.config";

import { ApolloServer } from "apollo-server-express";
import { AuthenticationError } from "apollo-server-errors";
import typeDefs from "./graphql/schema";
import usersResolvers from "./graphql/usersResolvers";
import pagesResolvers from "./graphql/pagesResolvers";
import jwt from "jsonwebtoken";
import { User } from "./model/userModel";

const jwtsecret = process.env.JWT_SECRET as string;

const app = express();

db()
  .then(() => {})
  .catch((err) => {
    console.log("Error connecting to database:", err.message);
  });

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers: [pagesResolvers, usersResolvers],
    context: async ({ req, res }: any) => {
      const authorization = req.headers.authorization || "";
      const token = authorization.split(" ")[1];

      if (!token) {
        return {};
      }

      try {
        const verifiedUser: any = jwt.verify(token, jwtsecret);

        if (!verifiedUser) {
          return {};
        }

        const { id } = verifiedUser as { [key: string]: any };
        const user = await User.findOne({ _id: id });

        if (!user) {
          return {};
        }

        return { user };
      } catch (error: any) {
        console.log(error);
        return {};
      }
    },
  });

  await server.start();
  server.applyMiddleware({ app });
}

startApolloServer();

app.use(function (
  err: createError.HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

export default app;
