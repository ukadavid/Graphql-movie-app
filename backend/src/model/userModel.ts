import mongoose, { Schema, Document } from "mongoose";

interface Movie {
  title: string;
  description: string;
  image: any;
  price: number;
}

interface UserDocument extends Document {
  fullname: string;
  username: string;
  email: string;
  password: string;
  movies: Movie[];
}

const MovieSchema = new Schema<Movie>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: Object, required: true },
  price: { type: Number, required: true },
});

const UserSchema = new Schema<UserDocument>({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  movies: {
    type: [MovieSchema],
    default: [],
  },
});

export const User = mongoose.model<UserDocument>("User", UserSchema);
