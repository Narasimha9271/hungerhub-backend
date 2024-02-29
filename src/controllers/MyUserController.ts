import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import User from "../models/user";

const createCurrentUser = async (req: Request, res: Response) => {
    //1. check if user exists
    //2. create the user if not exist
    // 3. return the user object to the calling client

    try {
        const { auth0Id } = req.body;
        const existingUser = await User.findOne({ auth0Id });

        if (existingUser) {
            return res.status(200).json(new ApiResponse(200, {}, "Success"));
        }

        //if not exists create one
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(
            new ApiResponse(201, newUser.toObject(), "success")
        );
    } catch (err) {
        throw new ApiError(500, "Error creating user");
    }
};

const updateCurrentUser = async (req: Request, res: Response) => {
    try {
        const { name, addressLine1, country, city } = req.body;
        const user = await User.findById(req.userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        user.name = name;
        user.addressLine1 = addressLine1;
        user.country = country;
        user.city = city;

        await user.save();

        res.send(user);
    } catch (err) {
        throw new ApiError(500, "Error updating user");
    }
};

const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const currentUser = await User.findOne({ _id: req.userId });
        if (!currentUser) {
            throw new ApiError(404, "User not found");
        }
        res.json(currentUser);
    } catch (err) {
        throw new ApiError(500, "Error fetching user");
    }
};

export default {
    createCurrentUser,
    updateCurrentUser,
    getCurrentUser,
};
