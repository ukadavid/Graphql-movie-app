import mongoose, {Schema} from 'mongoose';


export interface User {
    fullname: string;
    username: string;
    email: string;
    password: string;
    movie: string[];
}

const UserModel = new Schema<User>({
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: {type: String, required: true},
    movie: [{ type: Schema.Types.ObjectId, ref: 'movie' }]
}, {timestamps: true});

export const user = mongoose.model<User>('user', UserModel);

UserModel.virtual('Virtualmovie', {
    ref: 'movie',
    localField: '_id',
    foreignField: 'userid',
})