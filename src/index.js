import express from "express";
import cors from "cors";
import http from "http";
import "dotenv/config";

import errorHandling from "../errorHandling.js";

import billingRoute from "./routes/billingRoutes.js"
import storeRoute from "./routes/StoreRoutes.js";
import supplierRoute from "./routes/supplierRoutes.js";
import userRoute from "./routes/userRoutes.js";
import dashBoardRoute from "./routes/dashBoardRoutes.js"
import commonRoute from "./routes/commonRoutes.js"
import orgRoute from "./routes/organizationRoutes.js"
import productRoute from "./routes/productRoutes.js"

const PORT = 3333
const app = express();

app.use(errorHandling)

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static("uploads"))
app.use(express.urlencoded({ extended: true }));


app.use("/api",storeRoute, supplierRoute, userRoute, dashBoardRoute, billingRoute, productRoute)
app.use("/api",commonRoute)
app.use("/api",orgRoute)

const server = http.createServer(app)

server.listen(PORT,()=>{
    console.log(`server connected to port ${PORT}`)
})