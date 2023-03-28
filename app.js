import './config.js';

import cors from 'cors';
import express from "express";
import path from 'path';
import mongoose from 'mongoose';
import methodOverride from "method-override";
import ejsMate from 'ejs-mate'
import ExpressError from "./utils/ExpressError.js";
import session from "express-session"
import flash from 'connect-flash'
import passport from "passport";
import LocalStrategy from "passport-local";
import mongoSanitize from "express-mongo-sanitize";
import helmet from 'helmet';
import MongoStore from 'connect-mongo'



import User from "./models/users.js";

import campgroundRoutes from "./routes/campgrounds.js"
import reviewRoutes from "./routes/reviews.js"
import userRoutes from "./routes/users.js";

const dbUrl=process.env.DB_URL||'mongodb://localhost:27017/yelp-camp';
const secret=process.env.SECRET||'thisshouldbeabettersecret';

mongoose.connect(dbUrl) // TODO: Why is he using options here?
    .then(() => console.log("Connected to MongoDB"))
    .catch(e => console.log("ERROR connecting MongoDB: ", e))

const app=express()


const __dirname=path.resolve(); //Solves the problems of __dirname in Windowns with ESModules
app.engine('ejs', ejsMate) //Changes the standar ejs engine to "ejsMate"
app.set('view engine', 'ejs'); //Stablish the render engine to ejs
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true })) //Allows us to use encoded forms (files)
app.use(methodOverride('_method')) // ...override the post method (forms only have get or post)
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())


const storeOptions={
    mongoUrl: dbUrl,
    secret: secret,
    touchAfter: 24*60*60, // if the data is not changed, it will not be updated in the database (24 hours)
}

const store=MongoStore.create(storeOptions);

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})


const sessionConfig={
    store,
    name: 'session', // hide a little bit the fact that we are using a session
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //Prevents JS from accessing the cookie
        // secure: true, //Only send the cookie over https -> When deploye we need to change this
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
    }
}
app.use(session(sessionConfig))
// app.use(helmet()) // enables the eleven helmet middlewares --> but content security policy won't be happy "violate the same-origin policy" --> CORS?
const scriptSrcUrls=[
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com/",
];
const styleSrcUrls=[
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.jsdelivr.net/npm/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls=[
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls=[];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dwr2im3wk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);// app.use(cors(
//     {
//         origin: 'http://localhost:3000', // TODO: Change this to the real domain in production
//         credentials: true
//     }
// ))


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(mongoSanitize({ replaceWith: '_' }))

app.use((req, res, next) => {
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    res.locals.returnTo=req.session.returnTo // TODO: Esto es un apaño...?
    next()
})

const port=process.env.PORT||3000;
app.listen(3000, () => {
    console.log(`SERVING ON PORT ${port}`)
})


//ROUTERS
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)

//HOME
app.get('/', (req, res) => {
    res.render('home')
})


//NOT FOUND
app.all('*', (req, res, next) => {
    const err=new ExpressError("Does not exist", 404)
    next(err)
})

//ERROR HANDLER
app.use((err, req, res, next) => {
    const { statusCode=500 }=err
    if (!err.message) { err.message='Oh no, something went wrong!' }
    res.status(statusCode).render('error', { err })

})
