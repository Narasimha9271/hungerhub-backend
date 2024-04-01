import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import Restaurant from "../models/restaurant";

const searchRestaurant = async (req: Request, res: Response) => {
    try {
        const city = req.params.city;

        const searchQuery = (req.query.searchQuery as string) || "";
        const selectedCuisines = (req.query.selectedCuisines as string) || "";
        const sortOption = (req.query.sortOption as string) || "lastUpdated";
        const page = parseInt(req.query.page as string) || 1;

        let query: any = {};

        query["city"] = new RegExp(city, "i"); // if kadapa entered -> search all cases like Kadapa
        const cityCheck = await Restaurant.countDocuments(query);
        if (cityCheck === 0) {
            return res.status(404).json({
                data: [],
                pagination: {
                    total: 0,
                    page: 1,
                    pages: 1,
                },
            });
        }

        if (selectedCuisines) {
            //URl -> selectedCuisines=indian, burgers,chinese
            // [indian, burgers, chinese]
            const cuisinesArray = selectedCuisines
                .split(",")
                .map((cuisine) => new RegExp(cuisine, "i"));

            query["cuisines"] = { $all: cuisinesArray }; // go & find the restaurants when cusines array has all the items that we received in the request
        }

        if (searchQuery) {
            const searchRegex = new RegExp(searchQuery, "i");
            query["$or"] = [
                { restaurantName: searchRegex },
                { cuisines: { $in: [searchRegex] } },
            ];
        }

        const pageSize = 10;
        const skip = (page - 1) * pageSize; // if client enters page 3 => (3-1)*10 = 20 items were skipped and 21st item will be shown

        const restaurants = await Restaurant.find(query)
            .sort({ [sortOption]: -1 })
            .skip(skip)
            .limit(pageSize)
            .lean(); // lean() is used to convert the mongoose document to plain javascript object

        const total = await Restaurant.countDocuments(query); // count the total number of documents(restaurants) that match the query

        const response = {
            data: restaurants,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / pageSize), // if total is 100 and pageSize is 10 => 100/10 = 10 pages
            },
        };

        return res.json(response);
    } catch (err) {
        throw new ApiError(500, "something went wrong");
    }
};

export default {
    searchRestaurant,
};
