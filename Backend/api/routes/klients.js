const express = require("express")
const router = express.Router();

const KlientController = require("../controllers/klients")

router.get("/", KlientController.klientsGetAll)

router.post("/", KlientController.klientsAddNew)

router.get("/:klientId", KlientController.klientGetById)

module.exports = router