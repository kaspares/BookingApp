const express = require("express")
const router = express.Router();

const OfferController = require("../controllers/offers")

router.get("/", OfferController.offersGetAll)

router.post("/", OfferController.offersAddNew)

router.get("/:city", OfferController.offersGetByCity)

module.exports = router