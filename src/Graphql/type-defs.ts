import {gql} from 'apollo-server'

const typeDefs = gql`
type MovieSchema {
    id: ID!
    title: String!
    description: String!
    image: String!
    price: Int!
    user: UserSchema!
}

type AuthPayload {
    token: String!
  }

input MovieInput {
    title: String
    description: String
    image: String
    price: Int
}

type Message{
    message: String
}

type UserSchema {
    id: ID!
    fullname: String!
    email: String!
    password: String!
    movie: [MovieSchema!]!
}

input CreateUserInput {
    fullname: String
    username: String
    email: String
    password: String
    confirm_password: String
}

type Query {
    allMovies: [MovieSchema!]! 
    singleMovie(id: ID!): MovieSchema
}

type Mutation {
    createMovie(inputType: MovieInput!): MovieSchema!
    createUser(input: CreateUserInput!): UserSchema
    logout: Boolean!
    updateMovie(id: ID!, input: MovieInput!): MovieSchema!
    deleteMovie(id: ID!): Message!
}

`
export default typeDefs;
