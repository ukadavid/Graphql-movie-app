import express from 'express';
import logger from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()
import {ApolloServer} from 'apollo-server';
import typeDefs from './Graphql/type-defs';
import resolvers from './Graphql'; 


const server = new ApolloServer({
  typeDefs, resolvers })

mongoose.connect(process.env.DATABASE_URL!)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});