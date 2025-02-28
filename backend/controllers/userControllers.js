import asyncHandler from "express-async-handler";
import Userroad from "./../models/userModel.js";
import generateToken from "../config/generateToken.js";
import bcrypt from "bcryptjs";

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic} = req.body;
    if( !name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all the fields");
    }
    const userExist = await Userroad.findOne({email});
    console.log("email = ", email);
    if (userExist) {
        res.status(400);
        throw new Error("The user already exists");
    }
    console.log(" name, email, password, pic = ",  name, email, password, pic);
    const user = await Userroad.create({
        name, email, password, pic
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Failed to create the Userrr");
    }
});

export const authUser = asyncHandler(async (req, res) => {
    const { email, password} = req.body;
    console.log("email login = ", email);
    const user  = await Userroad.findOne({email});
    console.log("user login = ", user);
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || '');
    if (user && isPasswordCorrect) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid credentials");
    }
});
export const allUsers = asyncHandler(async (req, res) => {
    console.log("req.query.search = ", req.query.search);
    const keyword = req.query.search
    ? {
        $or: [
            {name: { $regex: req.query.search, $options: "i" }},
            {email: { $regex: req.query.search, $options: "i" } }
        ],
    }
    : {};
    const users = await Userroad.find(keyword).find({_id: {$ne: req.user._id}});
    console.log("keywod = ", keyword);
    res.send(users);

});
//module.exports = {registerUser};
// export default registerUser;
//export { authUser, registerUser};
