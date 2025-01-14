require('dotenv').config()

const express = require("express")

const app = express()

const mongoose = require("mongoose");
mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.clddf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch(err => {
    console.error("MongoDB connection error:", err);
});



const morgan = require("morgan")
app.use(morgan("dev"))

const bodyParser = require("body-parser")
app.use(bodyParser.json()) 

const cors = require("cors");
app.use(cors());


const offersRoutes = require("./api/routes/offers")
const reservationRoutes = require("./api/routes/reservations")
const klientRoutes = require("./api/routes/klients")

app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

app.use("/klients", klientRoutes)
app.use("/offers", offersRoutes)
app.use("/reservations", reservationRoutes)
app.use((req, res, next) => {
    res.status(400).json({wiadomość:"Nie odnaleziono"})
})

module.exports = app