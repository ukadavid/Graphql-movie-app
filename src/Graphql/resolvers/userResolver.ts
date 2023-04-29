import { movieModel } from '../../model/MovieModel';
import { user, User } from '../../model/UserModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const jwtsecret = "mysecretkey";

interface CreateUserInput {
  fullname: string;
  email: string;
  password: string;
  username: string;
  confirm_password: string;
}

// interface LoginInput {
//   email: string;
//   password: string;
// }

const UserResolver = {
    
  Mutation: {
    // Create User
    createUser: async (_: any, { input }: { input: CreateUserInput }) => {
      const { email, fullname, username, password, confirm_password } = input;
    
      try {
        // Check if user already exists
        const existingUser = await user.findOne({ email });
        if (existingUser) {
          throw new Error('Email already exists');
        }
    
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
    
        // Create new user
        const newUser = await user.create({
          fullname,
          username,
          email,
          password: hashedPassword,
        });
    
        // Create JWT token
        const { _id } = newUser;
        const signatureToken = jwt.sign({ id: _id }, jwtsecret, { expiresIn: '30mins' });
    
        // Return the new user's email and fullname along with the JWT token
        return { email: newUser.email, fullname: newUser.fullname, token: signatureToken };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    
    
    

    // createUser: async (_: any, { input }: { input: CreateUserInput }) => {
    //   const { email, fullname, username, password, confirm_password } = input;

    //   try {
    //     // Check if user already exists
    //     const existingUser = await user.findOne({ email });
    //     if (existingUser) {
    //       throw new Error('Email already exists');
    //     }

    //     // Hash password
    //     const hashedPassword = await bcrypt.hash(password, 12);

    //     // Create new user
    //     const newUser = await user.create({
    //       fullname,
    //       username,
    //       email,
    //       password: hashedPassword,
    //     });

    //     // Create JWT token
    //     const { _id } = newUser;
    //     const signatureToken = jwt.sign({ id: _id }, jwtsecret, { expiresIn: '30mins' });

    //     return { token: signatureToken };
    //   } catch (error) {
    //     console.error(error);
    //     throw error;
    //   }
    // },
    // Login User
    // login: async (_: any, { input }: { input: LoginInput }, { res }: any) => {
    //   try {
    //     const { email, password } = input;

    //     const userCheck = await user.findOne({ email });

    //     if (!userCheck) {
    //       throw new Error('Invalid email or password');
    //     }

    //     const { id } = userCheck;

    //     const signatureToken = jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "30d" });

    //     res.cookie("token", signatureToken, {
    //       httpOnly: true,
    //       maxAge: 30 * 24 * 60 * 60 * 1000,
    //     });

    //     const isMatch = await bcrypt.compare(password, userCheck.password);

    //     if (isMatch) {
    //       return { message: "Login successful" };
    //     } else {
    //       throw new Error('Invalid email or password');
    //     }
    //   } catch (err) {
    //     console.error(err);
    //     throw err;
    //   }
    // },
    // logout: async (_: any, __: any, { res }: { res: Response }) => {
    //   try {
    //     // Clear the token from the cookie
    //     res.clearCookie("token");

    //     return { message: "Successfully logged out" };
    //   } catch (error) {
    //     console.error(error);
    //     throw error;
    //   }
    // },
  }
};

export default UserResolver;

