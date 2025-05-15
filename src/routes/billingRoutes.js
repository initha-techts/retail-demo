import express from "express"

import billingController from "../controller/billingController.js"

const route = express.Router()

route.post("/invoice", billingController.createInvoice)

export default route