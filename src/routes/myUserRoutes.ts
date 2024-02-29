import express from "express";
import MyUserController from "../controllers/MyUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();

router.post("/", jwtCheck, MyUserController.createCurrentUser);

router.put(
    "/",
    jwtCheck,
    jwtParse,
    validateMyUserRequest,
    MyUserController.updateCurrentUser
);

router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser);

export default router;
