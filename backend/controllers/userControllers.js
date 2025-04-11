import asyncHandler from "express-async-handler";
import Userroad from "./../models/userModel.js";
import generateToken from "../config/generateToken.js";
import bcrypt from "bcryptjs";
import crypto  from 'crypto';

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic} = req.body;
    console.log("email = ", email);
    if( !name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all the fields");
    }
    const userExist = await Userroad.findOne({email});
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
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || '');
    // console.log("user.csrfToken = ", user.csrfToken);
    if (user && isPasswordCorrect) {
        const csrfToken = crypto.randomBytes(32).toString('hex');
        req.session.csrfToken = csrfToken;
        console.log("Згенерований та збережений в сесії CSRF-токен (authUser):", csrfToken);
        res.cookie('XSRF-TOKEN', csrfToken, {
            path: '/',
            httpOnly: true, // Важливо: забороняє доступ з JavaScript
            sameSite: 'Lax',
            secure: false,
            domain: 'localhost',
            maxAge: 3600 * 24 * 7,
        });
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
            csrfToken: csrfToken // НЕ надсилайте токен явно в JSON
        });
        console.log("user login = ", user);
        console.log("Згенерований CSRF-токен (з req):", req.csrfToken);
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
