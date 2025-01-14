const mongoose = require("mongoose")
const Klient = require("../routes/models/klients")

exports.klientsGetAll = (req, res, next) => {
    Klient.find()
    .then(klients => {
        if (klients.length === 0) {
            return res.status(404).json({
                message: "None klients"
            })
        }
        res.status(200).json({
            message: "Klients:",
            klients: klients
        });
    }).catch(err => res.status(500).json({error: err}))
}

exports.klientsAddNew = (req, res, next) => {
    const { nameClient, surname, email, phoneNumber } = req.body;

    if (!nameClient || !surname || !email || !phoneNumber) {
        return res.status(400).json({ message: 'Brakuje wymaganych pól.' });
    }

    const klient = new Klient({
        _id: new mongoose.Types.ObjectId(),
        nameClient: req.body.nameClient,
        surname: req.body.surname,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    });

    klient.save()
    .then(result => {
        res.status(201).json({
            message: "Klient saved",
            klient: result
        });
    })
    .catch(err => res.status(500).json({error: err}))

}

exports.klientGetById = (req, res, next) => {
    const id = req.params.id;

    Klient.findById(id)
    .then(result => {
        res.status(200).json({
            message: `Klient o ${id}`,
            klient: result
        })
    })
    .catch(err => res.status(500).json({error: err}))
}