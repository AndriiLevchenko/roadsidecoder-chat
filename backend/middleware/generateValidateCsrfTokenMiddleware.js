import cookieParser  from 'cookie-parser';
import crypto  from 'crypto';
import asyncHandler from "express-async-handler";
//import {sessionMiddleware} from "./sessionMiddleware.js";

// import session from "express-session";
//
//
// //Session
// const sessionOptions = {
//     secret: "supersupersuperSecretr3",
//     resave: true,
//     saveUninitialized: true,
//     cookie: {
//         httpOnly: true,
//         secure: false,
//         path: '/',
//         domain: 'localhost',
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//     }
// };
//
// const baseSessionMiddleware = session(sessionOptions);
// export const sessionMiddleware = (req, res, next) => {
//     console.log("Session генеруєьться лишеодин раз лише один раз лише один раз лише один раз.");
//     baseSessionMiddleware(req, res, next);
// };


// Middleware для генерації CSRF-токену при вході (приклад)
export const generateCsrfToken = [
    //sessionMiddleware, //тимчаово видалено
    (req, res, next) => {
        const csrfToken = crypto.randomBytes(32).toString('hex');
        req.session.csrfToken = csrfToken;
        req.session.testValue = 'test';
        console.log("ID сесії при генерації:", req.sessionID);
        console.log("Згенерований та збережений в сесії CSRF-токен req.session.csrfToken = ", csrfToken);
        console.log("NODE_ENV =", process.env.NODE_ENV);
        // res.cookie('XSRF-TOKEN', csrfToken, {
        //     path: '/',
        //     httpOnly: true,
        //     sameSite: 'Lax',
        //     // secure: process.env.NODE_ENV === 'production',
        //     secure: false,
        //     domain: 'localhost',
        //     maxAge: 3600 * 24 * 7, // 7 днів у секундах
        // });
        res.cookie('TEST-COOKIE', 'testvalue', {
            path: '/',
            httpOnly: true,
            sameSite: 'Lax',
            secure: false,
            domain: 'localhost',
            maxAge: 3600, // Наприклад, 1 година
        });
        req.csrfToken = csrfToken; // Можете передати токен далі, якщо потрібно
        //res.setHeader('X-CSRF-TOKEN', csrfToken); // За потреби
        next();
    },
];
// export  const generateCsrfToken =  asyncHandler(async(req, res, next) => {
//     const csrfToken = crypto.randomBytes(32).toString('hex');
//     res.cookie('XSRF-TOKEN', csrfToken, {
//         httpOnly: true,
//         // secure: process.env.NODE_ENV === 'production', // Встановлюйте true в production
//         // sameSite: 'Strict', // Або 'Lax' залежно від ваших потреб
//         SameSite: 'None', // Або 'Lax' залежно від ваших потреб
//         path: '/',
//         overwrite: true,
//         // secure: process.env.NODE_ENV === 'production' ? true : false,
//         secure: true,
//         domain: 'localhost',
//         maxAge: 3600 * 24 * 7 * 1000, // 7 днів (в мілісекундах) - для тестування
//     });
//     req.csrfToken = csrfToken; // Можете передати токен далі, якщо потрібно
//     req.session.csrfToken = csrfToken;
//     req.session.save();
//     console.log("csrfToken = ", csrfToken);
//     console.log("csrfToken = ", csrfToken);
//     console.log("req.session.csrfToken = ", req.session.csrfToken);
//     next();
// });

// Middleware для валідації CSRF-токену для захищених маршрутів
export const validateCsrfToken = (req, res, next) => {
    const csrfTokenFromHeader = req.headers['x-csrf-token'];
    const csrfTokenFromCookie = req.cookies['XSRF-TOKEN'];
    const csrfTokenFromSession = req.session.csrfToken;
    console.log("csrfTokenFromHeader x-csrf-token = ", csrfTokenFromHeader);
    console.log("csrfTokenFromCookie = ", csrfTokenFromCookie);
    console.log("csrfTokenFromSession =", csrfTokenFromSession);
    console.log("ID сесії при валідації:", req.sessionID);
    // Перевірка наявності обох токенів
    // if (!csrfTokenFromHeader || !csrfTokenFromSession) {
    //     return res.status(403).json({ message: "CSRF tokens are missing" });
    // }
    //
    // // Порівняння токенів
    // if (csrfTokenFromHeader !== csrfTokenFromSession) {
    //     return res.status(403).json({ message: "CSRF token validation failed" });
    // }
    if (!csrfTokenFromHeader || !csrfTokenFromSession) {
        return res.status(403).json({ message: "CSRF tokens are missing" });
    }

    if (csrfTokenFromHeader !== csrfTokenFromSession) {
        console.error("Помилка ");
        try {
            return res.status(403).json({ message: "CSRF token validation failed" });
        } catch (error) {
            console.error("Помилка при відправці JSON про помилку CSRF:", error);
            return res.status(500).send("Internal Server Error"); // Запасний варіант
        }
    }
    console.log("реально спрацьовує валідація токенів валідація токенів при відправленні повідомлень.")
    next();
};
