const mongoose = require("mongoose");
const Offer = require("../routes/models/offers");

exports.offersGetAll = (req, res, next) => {
    Offer.find()
    .then(offers => {
        if (offers.length === 0) {
            return res.status(404).json({
                message: "Lack of offers"
            })
        }
        res.status(200).json({
            message: "Oferty",
            offers: offers
        });
    }).catch(err => res.status(500).json({ error: err }))
};

exports.offersAddNew = (req, res, next) => {
    const offer = new Offer({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        guests: req.body.guests,
        price: req.body.price,
        city: req.body.city,
        adress: req.body.adress,
        coordinates: {
            lat: req.body.lat,
            lon: req.body.lon
        },
        imageUrl: req.body.imageUrl,
        status: req.body.status || "free"

    });

    offer.save()
    .then(result => {
        res.status(201).json({
            message: "Offer saved",
            offer: result
        });
    }).catch(err => res.status(500).json({error: err}))
};

exports.offersGetByCity = (req, res, next) => {
    const city = req.params.city;
    Offer.find({ city: city })
    .then(result => {
        if (result) {
            res.status(200).json({
                message: `Offerts in ${city}`,
                city: result
            });
        }
        else {
            res.status(404).json({
                message: `No offers in ${city}`
            });
        }
    }).catch(err => res.status(500).json({error: err}));
}