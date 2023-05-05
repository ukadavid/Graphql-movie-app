import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    _id: ID!
    fullname: String!
    username: String!
    email: String!
    password: String!
    movies: [Movie]
  }

  type Movie {
    _id: ID!
    title: String!
    description: String!
    image: String!
    price: Float!
  }

  type Page {
    view: String!
  }
  
  type LandingPage {
    movieList: [Movie!]!
    currentPage: Int!
    totalPages: Int!
  }
  
  type UserDashboard {
    movieList: [Movie!]!
    currentPage: Int!
    totalPages: Int!
    message: String
  }

  input MovieInput {
    title: String!
    description: String!
    image: String!
    price: Float!
  }

  type Query {
    user(id: ID!): User
    users: [User]
    movie(id: ID!): Movie
    movies: [Movie]
    registrationPage: Page!
    loginPage: Page!
    landingPage(page: Int!): LandingPage!
    userDashboard(page: Int!): UserDashboard!
  }

  type Mutation {
    registerUser(
      fullname: String!
      username: String!
      email: String!
      password: String!
    ): AuthPayload
    loginUser(email: String!, password: String!): AuthPayload
    createMovie(input: MovieInput!): Movie
    updateMovie(id: ID!, input: MovieInput!): Movie
    deleteMovie(id: ID!): Movie
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;

export default typeDefs;
