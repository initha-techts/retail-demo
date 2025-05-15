import userController from "../controller/userController.js";

import express from "express";

const route = express.Router()

route.post("/addUpd_users", userController.addUpdateUsers)

route.post('/addUpdate_role', userController.addUpdateRole)
route.get("/get_roles/:store_id", userController.getRole)
// route.put("/update_role", userController.updateRole)
route.delete("/delete_role/:role_id", userController.deleteRole)

export default route