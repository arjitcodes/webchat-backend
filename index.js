require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConfig");


const PORT = process.env.PORT || 3000
const app = express();

dbConnect();
//Built-in middlewares to handle urlencode form data and json data



app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', ' X-Requested-With, Content-Type, authorization ');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});


app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());


//routes

app.use("/user", require("./routes/user"));
app.use("/refresh", require("./routes/refresh"));
app.use("/auth", require("./routes/auth"));
app.use("/logout", require("./routes/logout"));

app.listen(PORT, () => {
    console.log(`Server side of web-chat's listening on port : ${PORT}`);
})