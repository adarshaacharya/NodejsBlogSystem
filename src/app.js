// cheking we are in dev env
if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require('passport')
const socketio = require('socket.io')


const app = express()
// prevent stack traces on production
app.set("env", process.env.NODE_ENV);

// Socket setup
const http = require('http')
const server = http.createServer(app)
const io = socketio(server)
app.io = io;

// Middleware to handle POST/PUT req
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true , limit: '50mb'}));

// Define paths of views and public directory
const viewsDirectoryPath = path.join(__dirname, "../views");
const publicDirectoryPath = path.join(__dirname, "../public");

// Setup views and public directory
app.set("views", viewsDirectoryPath);
app.use(express.static(publicDirectoryPath));

// EJS engine
app.set('viewengine', 'ejs');


// connecting db
mongoose.connect(process.env.DATABASE_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => console.log("Connected to database successfully..."))
  .catch(() => console.log("Failed to connect to database"));


// Express session middleware 
app.use(session({
    secret: 'secretKey',
    resave: true,
    saveUninitialized: true
}));

// passport config
require('../middleware/passport')(passport)

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Express message middleware
app.use(flash()); //connect flash
 
 // Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg') 
    res.locals.error_msg = req.flash('error_msg') // resource protection error auth.js  
    res.locals.error = req.flash('error') // login passport.js msg 
    next();
})

// setting global variable for every view as middleware function to check whether user is logged in or not
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})

// routes
const homeRouter = require("../routes/home");
app.use(homeRouter);

const postRouter = require("../routes/posts");
app.use(postRouter);

const commentRouter = require("../routes/comments");
app.use(commentRouter);

const userRouter = require('../routes/users')
app.use(userRouter)

const categoryRouter = require('../routes/categories')
app.use(categoryRouter)

const errorRouter = require('../routes/error')
app.use(errorRouter)

const hostname = "localhost";
const port =  process.env.PORT || 5000 



io.on("connection", client => {
  client.on("disconnect", () => console.log("Client disconnected"));
});


server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
