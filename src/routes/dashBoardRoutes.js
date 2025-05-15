import express from "express"

import dashBoardController from "../controller/dashBoardController.js"

const route = express.Router()

route.get("/get_expiring", dashBoardController.getExpiring)
route.get("/get_lowStock/:store_id", dashBoardController.getLowStock)
route.get("/get_outofstock/:store_id", dashBoardController.getOutOfStock)

export default route