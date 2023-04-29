import { movieModel, MovieInterface } from '../../model/MovieModel';

interface MovieInput {
  title: string;
  description: string;
  image: string;
  price: number;
}

interface CreateMovieArgs {
  inputType: MovieInput;
}

const MovieResolver = {
  Query: {
    // Get all movies
    allMovies: async () => {
      try {
        const movies = await movieModel.find({});
        return movies;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    // Create Movie
    createMovie: async (_: any, { inputType }: CreateMovieArgs) => {
      try {
        const newMovie = await movieModel.create(inputType);
        return newMovie;
      } catch (error) {
        console.log(error);
      }
    },
    // Update Movie
    updateMovie: async (_: any, { id, input }: { id: string, input: MovieInput }) => {
      try {
        const updatedMovie = await movieModel.findByIdAndUpdate(id, input, { new: true });
        return updatedMovie;
      } catch (error) {
        console.log(error);
      }
    },
    // Delete Movie
    deleteMovie: async (_: any, { id }: { id: string }) => {
      try {
        await movieModel.findByIdAndDelete(id);
        return { message: `Movie with ID ${id} has been deleted` };
      } catch (error) {
        console.log(error);
      }
    },
  },
};

export default MovieResolver;
