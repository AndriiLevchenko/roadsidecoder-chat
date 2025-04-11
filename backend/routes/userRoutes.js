import express from "express";
import {authUser, registerUser, allUsers} from "../controllers/userControllers.js";
import {protect} from "../middleware/authMiddleware.js";
//import {generateCsrfToken} from "../middleware/generateValidateCsrfTokenMiddleware.js";
//import {sessionMiddleware} from "../middleware/sessionMiddleware.js";

console.log("authUser = ", authUser);
const router = express.Router();

// router.route("/").get(protect, allUsers);  // Оригінал
router.route("/").get( allUsers); // Видалили тимчасово  protect
// router.route("/").post(registerUser).get(protect, allUsers);
router.route("/").post(registerUser).get( allUsers);    // Видалили protect  тимчасово
//router.post("/login", sessionMiddleware, generateCsrfToken, authUser);
// router.post("/login", generateCsrfToken, authUser); //Видалено sessionMiddleware
router.post("/login", authUser); //Видалено generateCsrfToken

export default router;