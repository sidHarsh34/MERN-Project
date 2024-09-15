import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const signup = async(req,res,next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword});
    try{
        await newUser.save();
        res.status(201).json( {message: "User created succesfully"});
    }
    catch (error){
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not found'));

        // Compare passwords
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials'));

        // Generate JWT
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Exclude password from the response
        const { password: hashedPassword, ...rest } = validUser._doc;

        // Set cookie expiration (1 hour in milliseconds)
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour from now

        // Set the token in an HTTP-only cookie and return the user data
        res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
           .status(200)
           .json(rest);
    } catch (error) {
        next(error);
    }
};
