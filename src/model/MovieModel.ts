import mongoose, { Schema, Types } from 'mongoose';

export interface MovieInterface {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  userid: any;
}

const MovieSchema = new Schema<MovieInterface>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    userid: { type: Schema.Types.ObjectId, ref: 'user' },
  },
  { timestamps: true }
);


export const movieModel = mongoose.model<MovieInterface>('movie', MovieSchema);
