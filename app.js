require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const connectDB = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routeHelpers');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.static("public"));

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "layouts/main");
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),
    // we can set cokkie as cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
  }));

app.locals.isActiveRoute = isActiveRoute; 

// Router'ı içe aktarın
const mainRouter = require("./server/routes/main");
const admin = require("./server/routes/admin");

// Router'ı middleware olarak kullanın
app.use("/", mainRouter);
app.use("/", admin);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    }
);

