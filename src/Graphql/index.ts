 import MovieResolver from "./resolvers/movieResolver";
 import UserResolver from "./resolvers/userResolver";

 export default {
        Query: {
            ...MovieResolver.Query,
        },

        Mutation: {
            ...MovieResolver.Mutation,
            ...UserResolver.Mutation
        }
 }

 