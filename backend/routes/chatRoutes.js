import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import {accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup} from "../controllers/chatControllers.js";


const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);   //  Оригінал
//router.route("/").get( fetchChats); // Тимчасово вмдалено  protect
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

export default router;