const mongoose = require("mongoose")

const reservationSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer"
    },
    klient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Klient"
    },
    checkIn: Date,
    checkOut: Date,
    guestsAdults: Number,
    guestsChildren: Number,

})

module.exports = mongoose.model("Reservation", reservationSchema)