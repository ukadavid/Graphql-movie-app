import express, { Request, Response, NextFunction } from "express";
import usersResolvers from "../graphql/usersResolvers";
import pagesResolvers from "../graphql/pagesResolvers";

const app = express();

app.get("/", async (req, res) => {
    const movieList = await usersResolvers.Query.movies();
    res.render("landPage", { movieList });
  });
  