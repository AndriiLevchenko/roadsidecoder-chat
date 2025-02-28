import express from "express";
import {authUser, registerUser, allUsers} from "../controllers/userControllers.js";
import {protect} from "../middleware/authMiddleware.js";

console.log("authUser = ", authUser);
const router = express.Router();

router.route("/").get(protect, allUsers);
//router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);

export default router;