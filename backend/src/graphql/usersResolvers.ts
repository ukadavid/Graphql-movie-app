import { User } from "../model/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const jwtsecret = process.env.JWT_SECRET!;

const usersResolvers = {
  Query: {
    movie: async (_: any, { id }: any) => {
      const users = await User.find({ "movies._id": id }, { "movies.$": 1 });
      return users[0].movies[0];
    },
    movies: async () => {
      const users = await User.find({}, "movies");
      return users.map((user) => user.movies).flat();
    },
    user: async (_: any, { id }: any) => {
      const user = await User.findById(id).populate("movies");
      return user;
    },
    users: async () => {
      const users = await User.find().populate("movies");
      return users;
    },
  },
  Mutation: {
    registerUser: async (
      _: any,
      { fullname, username, email, password }: any,
      context: any
    ) => {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
          fullname,
          username,
          email,
          password: hashedPassword,
        });

        await newUser.save();

        const { _id } = newUser;
        const token = jwt.sign({ id: _id }, jwtsecret, {
          expiresIn: "30mins",
        });
    
        // context.res.cookie("token", token, {
        //   httpOnly: true,
        //   maxAge: 30 * 60 * 1000,
        // });
        
        return {
          token,
          user: newUser,
        };
      } catch (error) {
        console.log(error);
      }
    },

    loginUser: async (_: any, { email, password }: any, context:any) => {
      try {
        const user = await User.findOne({ email });
    
        if (!user) {
          throw new Error("User not found");
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }
    
        const token = jwt.sign({ id: user._id }, jwtsecret, {
          expiresIn: "1h",
        });

        console.log("Here is the content of the context:", context);
    
        // context.res.cookie("token", token, {
        //   maxAge: 30 * 24 * 60 * 60 * 1000,
        //   httpOnly: true,
        //   secure: process.env.NODE_ENV === "production"
        // });
    
        return {
          token,
          user,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },    

    createMovie: async (_: any, { input }: any, context: any) => {
      const { user } = context;

      if (!user) {
        throw new Error("Unauthorized");
      }

      const updatedUser = await User.findByIdAndUpdate(
         user,
        { $push: { movies: input } },
        { new: true }
      );
      return input;
    },

    updateMovie: async (_: any, { id, input }: any, context: any) => {
      const { user } = context;
      if (!user) {
        throw new Error("Unauthorized");
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id, "movies._id": id },
        {
          $set: {
            "movies.$.title": input.title,
            "movies.$.description": input.description,
            "movies.$.image": input.image,
            "movies.$.price": input.price,
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Movie not found");
      }

      const updatedMovie = updatedUser.movies.find(
        (m: any) => m._id.toString() === id
      );
      if (!updatedMovie) {
        throw new Error("Movie not found");
      }

      return updatedMovie;
    },

    deleteMovie: async (_: any, { id }: any, context: any) => {
      const { user } = context;
      if (!user) {
        throw new Error("Unauthorized");
      }

      const verifiedUser = await User.findById(user._id);
      if (!verifiedUser) {
        throw new Error("User not found");
      }
      
      const movieIndex = verifiedUser.movies.findIndex((m: any) => m.id === id);
      if (movieIndex === -1) {
        throw new Error("Movie not found");
      }
      
      const deletedMovie = verifiedUser.movies.splice(movieIndex, 1)[0];
      await verifiedUser.save();
      return deletedMovie;
      

      // if (!deletedMovie) {
      //   throw new Error("Movie not found 1");
      // }

      // const movie = deletedMovie.movies.find(
      //   (m: any) => m._id.toString() === id
      // );
      
      // if (!movie) {
      //   throw new Error("Movie not found 2");
      // }

      // return movie;
    },
  },
};

export default usersResolvers;
