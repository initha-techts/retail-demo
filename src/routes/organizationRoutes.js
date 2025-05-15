import express from "express"

import OrganizationController from "../controller/organizationController.js"

const route = express.Router()

route.post("/createApp", OrganizationController.createApp)
route.post("/mainCategory", OrganizationController.createMainCategory)
route.post("/adminRegister", OrganizationController.adminReg)
route.post("/login", OrganizationController.Login)




route.post("/dCart", OrganizationController.demoAddCart)
route.delete("/dcart", OrganizationController.demoDelCart)
route.post('/order', OrganizationController.order)

export default route