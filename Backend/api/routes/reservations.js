const express = require("express")
const router = express.Router();

const ReservationController = require("../controllers/reservations")

router.get("/", ReservationController.reservationsGetAll)

router.post("/", ReservationController.reservationsAddNew)

router.delete("/:reservationId", ReservationController.reservationsDelete)

module.exports = router