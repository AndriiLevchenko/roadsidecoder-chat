import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import {allMessages, deleteMessage, sendMessage} from "../controllers/messageControllers.js";
import {validateCsrfToken} from "../middleware/generateValidateCsrfTokenMiddleware.js";
//import {sessionMiddleware} from "../middleware/sessionMiddleware.js";

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
// router.route("/").post(protect, validateCsrfToken, sessionMiddleware, sendMessage);
// router.route("/").post(sessionMiddleware, protect, validateCsrfToken, sendMessage);  //це правильний
router.route("/").post(protect, validateCsrfToken, sendMessage);  //sessiomMiddleware видалили
// router.route("/").post(sessionMiddleware, validateCsrfToken, sendMessage);  //видалено protect  для тестування. Без нього не відправляється
router.route("/deleteMessage").post(protect, deleteMessage);
//router.route("/:chatId").get(protect, deleteMessage);

export default router;
