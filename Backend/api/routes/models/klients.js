const mongoose = require("mongoose")

const klientSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    nameClient: String,
    surname: String,
    email: String,
    phoneNumber: String
})

module.exports = mongoose.model("Klient", klientSchema)