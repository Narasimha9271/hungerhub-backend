import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();

//Add multer middleware
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, //5MB
    },
});

router.get(
    "/order",
    jwtCheck,
    jwtParse,
    MyRestaurantController.getMyRestaurantOrders
);

router.patch(
    "/order/:orderId/status",
    jwtCheck,
    jwtParse,
    MyRestaurantController.updateOrderStatus
);

router.get("/", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurant);

// /api/my/reataurant
router.post(
    "/",
    upload.single("imageFile"),
    validateMyRestaurantRequest,
    jwtCheck,
    jwtParse,
    MyRestaurantController.createMyRestaurant
);

router.put(
    "/",
    upload.single("imageFile"),
    jwtCheck,
    jwtParse,
    MyRestaurantController.updateMyRestaurant
);

export default router;
