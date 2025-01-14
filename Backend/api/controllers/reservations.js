const mongoose = require("mongoose")
const Reservation = require("../routes/models/reservations")
const { checkout } = require("../routes/offers")

exports.reservationsGetAll = (req, res, next) => {
    Reservation.find()
    .populate("offer", "name city")
    .populate("klient", "nameClient surname email phoneNumber")
    .then(reservations => {
        if (reservations.length === 0) {
            return res.status(404).json({
                message: "Lack of reservations"
            })
        }
        res.status(200).json({
            message: "Reservations",
            reservations: reservations
        });

    }).catch(err => res.status(500).json({error: err}))
}

exports.reservationsAddNew = (req, res, next) => {
    console.log("Dane do rezerwacji", req.body);

    const { offerId, checkIn, checkOut, guestsAdults, guestsChildren } = req.body;

    if (!offerId || !checkIn || !checkOut || !guestsAdults || !guestsChildren) {
        return res.status(400).json({ message: 'Brakuje wymaganych pól (rezerwacja)' });
    }

    console.log("Dane rezerwacji:", req.body);

    // Sprawdzenie istniejących rezerwacji
    Reservation.find({
        offer: offerId,
        $or: [
            { 
                $and: [
                    { checkIn: { $lt: checkOut } },
                    { checkOut: { $gt: checkIn } }
                ]
            }
        ],
    })
    .then(conflictingReservations => {
        console.log('Konfliktujące rezerwacje:', conflictingReservations);

        if (conflictingReservations.length > 0) {
            // Zwróć odpowiedź i zakończ dalsze przetwarzanie
            if (!res.headersSent) {
                return res.status(409).json({
                    message: "Obiekt jest zajęty w wybranym terminie.",
                    conflicts: conflictingReservations
                });
            }
        }

        // Jeśli brak konfliktów, zapisz rezerwację
        const reservation = new Reservation({
            _id: new mongoose.Types.ObjectId(),
            offer: req.body.offerId,
            klient: req.body.klientId,
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut,
            guestsAdults: req.body.guestsAdults,
            guestsChildren: req.body.guestsChildren
        });

        return reservation.save();
    })
    .then(result => {
        // Wysłanie odpowiedzi po zapisaniu rezerwacji
        if (!res.headersSent) {
            res.status(201).json({
                message: "Reservation saved",
                reservation: result
            });
        }
    })
    .catch(err => {
        // Obsługuje błąd przy zapisie lub innym błędzie
        if (!res.headersSent) {
            res.status(500).json({ error: err });
        }
    });
};

exports.reservationsDelete = (req, res, next) => {
    const id = req.params.reservationId;
    Reservation.findByIdAndDelete(id)
    .then(result => {
        if (result) {
            res.status(200).json({
                message: `Reservation id: ${id} deleted `
            })

        } else {
            res.status(404).json({
                message: `Reservation not found`
            })
        }
    }).catch(err => res.status(500).json({error: err}))
}