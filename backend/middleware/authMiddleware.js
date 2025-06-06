import jwt from "jsonwebtoken";
import Userroad from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            //console.log("tokennn = ", token);
            //console.log("process.env.JWT_SECRET = ", process.env.JWT_SECRET);
            //decodes token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //console.log("decoded  = ", decoded );
            req.user = await Userroad.findById(decoded.id).select("-password");
            console.log("authMiddleware 1");
            console.log("req.user in authMiddleware = ", req.user);
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});
