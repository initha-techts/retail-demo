import express from "express"
import commonController from "../controller/commonController.js"



const route = express.Router()



 route.post("/send_otp", commonController.sendOTP);
 route.post("/verify_otp", commonController.verifyOTP);
 route.post("/reset_password", commonController.resetPassword);



// //================================== Company ==========================================

// route.post("/add-Company", commonController.addCompany);
// route.get('/download-excel/:admin_id', commonController.generateExcel);
// route.get("/getAllCompany/:admin_id", commonController.getCompany)
// route.put("/updateCompany", commonController.updateCompany)
// route.delete("/deleteCompany", commonController.deleteCompany);



//========================== Add Role ====================================/

// route.post('/addRole',commonController.addRole)
// route.put("/update-role", commonController.updateRole)
// route.delete("/delete-role", commonController.deleteRole)
//========================== Department ==================================

route.post("/addDeportment", commonController.addDepartment)
route.put("/update_dept", commonController.updateDepartment)
route.delete("/deleteDept", commonController.deleteDepartment)


//========================== category =====================================

route.post("/addCategory",  commonController.addCategory)
route.put("/update-category",  commonController.updateCategory)
route.delete("/deleteCategory", commonController.deleteCategory)


//=============================== Brand =====================================

route.post("/addBrand", commonController.addBrand)
route.put("/update-brand", commonController.updateBrand)
route.delete("/deleteBrand", commonController.deleteBrand)

//============================== Payment/Receipt ==============================

route.post("/addPayExpenditure", commonController.addPayExpenditure)
route.put("/update-Expenditure", commonController.updatePayExpenditure)
route.delete("/deleteExpenditure", commonController.deleteExpenditure)

//=============================== Discount ======================================

route.post("/addDiscount", commonController.addDiscount)
route.put("/update-discount", commonController.updateDiscount)
route.delete("/delete-discount", commonController.deleteDiscount)

//==================================== Coupon ======================================

route.post("/add_Coupon", commonController.addCoupon)
route.put("/update_Coupon", commonController.updateCoupon)
route.delete("/delete_coupon", commonController.deleteCoupon)

//====================================== Other Changes ========================================

route.post("/addChanges", commonController.otherChanges)
route.put("/update_changes", commonController.updateChanges)
route.delete("/delete_changes", commonController.deleteChanges)

//======================================= Reward ===============================================

route.post("/add_reward", commonController.addReward)
route.put("/update_reward", commonController.updateReward)
route.delete("/delete_reward", commonController.deleteReward)


//======================================= paymentOption ===============================================

route.post("/paymentOption", )
//===================================== Quick Access Qty ==========================================

route.post("/add-QAQ", commonController.addQualityAccess)
route.put("/update-QAQ", commonController.updateQualityAccess)
route.delete("/delete-QAQ", commonController.deleteQualityAccess)


//*********************************** add new item **********************************************

route.post("/addItem", commonController.addNewItem)

//*********************************** add customer **********************************************

route.post("/add_customer", commonController.addCustomer)
route.get("/getActive_Customer", commonController.getCustomer)

//************************************ Customer Support********************************************

route.post("/customer_support", commonController.addCustomerSupport)

//************************************** Settings ***********************************************

route.post("/header", commonController.addHeader)

//******************************************* Cart  *******************************************************

route.post("/cart", commonController.addCart)
route.post("/removeCart", commonController.removeCartItem)
route.get('/get_cart', commonController.getCart)


//********************************* Supplier **********************************

// route.post('/add_supplier', commonController.addSupplier)

// route.post('/workers', commonController.addWorkers)


 export default route
