import storeController from "../controller/StoreController.js";
import upload from "../middleware/uploadMiddleware.js";
import express from "express";

const route = express.Router()

route.post("/import-excel", upload.single("file"), storeController.importExcel);

route.post("/add", storeController.addUpdateStore)

route.post("/add_store", storeController.addStore);
route.get('/download-excel/:admin_id', storeController.generateExcel);
route.get("/getAdmin_store/:admin_id", storeController.getStore)
route.put("/update_store", storeController.updateStore)
route.delete("/delete_store", storeController.deleteStore);

export default route
