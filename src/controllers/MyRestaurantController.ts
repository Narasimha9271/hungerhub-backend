import mongoose from "mongoose";
import Restaurant from "../models/restaurant";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Request, Response } from "express";
import cloudinary from "cloudinary";

const getMyRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.userId });
        if (!restaurant) {
            return res
                .status(404)
                .json(new ApiResponse(404, {}, "Restaurant not found"));
        }
        res.json(restaurant);
    } catch (error) {
        console.log("error", error);
        throw new ApiError(500, "Error fetching restaurant");
    }
};

const createMyRestaurant = async (req: Request, res: Response) => {
    try {
        const existingRestaurant = await Restaurant.findOne({
            user: req.userId,
        });

        if (existingRestaurant) {
            return res
                .status(409)
                .json(
                    new ApiResponse(409, {}, "User restaurant already exists")
                );
        }

        const imageUrl = await uploadImage(req.file as Express.Multer.File);

        const restaurant = new Restaurant(req.body);
        restaurant.imageUrl = imageUrl;
        restaurant.user = new mongoose.Types.ObjectId(req.userId);
        restaurant.lastUpdated = new Date();
        await restaurant.save();

        res.status(201).send(restaurant);
    } catch (error) {
        console.log(error);
        throw new ApiError(
            500,
            "Something went wrong while creating restaurant"
        );
    }
};

const updateMyRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.userId });

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        restaurant.restaurantName = req.body.restaurantName;
        restaurant.city = req.body.city;
        restaurant.country = req.body.country;
        restaurant.deliveryPrice = req.body.deliveryPrice;
        restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
        restaurant.cuisines = req.body.cuisines;
        restaurant.menuItems = req.body.menuItems;
        restaurant.lastUpdated = new Date();

        if (req.file) {
            const imageUrl = await uploadImage(req.file as Express.Multer.File);
            restaurant.imageUrl = imageUrl;
        }

        await restaurant.save();
        res.status(200).send(restaurant);
    } catch (err) {
        throw new ApiError(
            500,
            "Something went wrong while updating restaurant"
        );
    }
};

const uploadImage = async (file: Express.Multer.File) => {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    return uploadResponse.url;
};

export default {
    createMyRestaurant,
    getMyRestaurant,
    updateMyRestaurant,
};
