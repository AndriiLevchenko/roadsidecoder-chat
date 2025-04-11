import session from "express-session";


//Session
const sessionOptions = {
    secret: "supersupersuperSecretr3",
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        path: '/',
        domain: 'localhost',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
};

const baseSessionMiddleware = session(sessionOptions);
export const sessionMiddleware = (req, res, next) => {
    console.log("Session генеруєьться лишеодин раз лише один раз лише один раз лише один раз.");
    baseSessionMiddleware(req, res, next);
};
