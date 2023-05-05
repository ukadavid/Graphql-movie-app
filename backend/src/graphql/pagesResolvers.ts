import { User } from "../model/userModel";

const pagesResolvers = {
  Query: {
    landingPage: async (_: any, { page }: any) => {
      try {
        const limit = 8;
        const skip = (page - 1) * limit;

        const movieCount = await User.aggregate([
          { $unwind: "$movies" },
          { $count: "count" },
        ]);

        const totalPages = Math.ceil(movieCount[0].count / limit);

        const getAllMovies = await User.aggregate([
          { $unwind: "$movies" },
          { $skip: skip },
          { $limit: limit },
        ]);

        return {
          movieList: getAllMovies.map((user: any) => user.movies),
          currentPage: page,
          totalPages: totalPages,
        };
      } catch (error) {
        console.log(error);
        return { movieList: [], currentPage: page, totalPages: 0 };
      }
    },
    userDashboard: async (_: any, { page }: any, context: any) => {
      try {
        const { id } = context.user;
        const perPage = 8;

        const movieListCount = await User.countDocuments({ _id: id });

        const totalPages = Math.ceil(movieListCount / perPage);

        const user = await User.findById(id);

        if (!user || !user.movies || user.movies.length === 0) {
          return { message: "No movies found" };
        }

        const movieList = user.movies.slice(
          (page - 1) * perPage,
          page * perPage
        );

        return {
          movieList,
          currentPage: page,
          totalPages,
        };
      } catch (error) {
        console.log(error);
        return { movieList: [], currentPage: page, totalPages: 0 };
      }
    },
  },
};

export default pagesResolvers;
