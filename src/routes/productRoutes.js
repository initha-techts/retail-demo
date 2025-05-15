import express from "express"

import productController from "../controller/productController.js"

const route = express.Router()

route.post("/add_update_prod", productController.addUpdateProduct)
route.get("/all_products/:store_id/:admin_id", productController.getAllProduct)
route.get("/get_prod/:prod_id", productController.getProduct)
route.delete("/del_product", productController.deleteProduct)

route.get("/search", productController.search_prod)

export default route