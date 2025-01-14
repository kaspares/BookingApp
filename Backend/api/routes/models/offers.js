const mongoose = require("mongoose")

const offerSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    description: String,
    guests: Number,
    price: Number,
    city: String,
    adress: String,
    coordinates: {
        lat: Number,
        lon: Number
    },
    imageUrl: String,
    status: String
})

module.exports = mongoose.model("Offer", offerSchema)