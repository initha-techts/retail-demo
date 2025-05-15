import supplierController from "../controller/supplierController.js";

import express from "express"

const route = express.Router()

route.post('/add_supplier', supplierController.addSupplier)

route.post("/addUpd_supplier", supplierController.addUpdateSupplier)

export default route