
import commonService from "../service/commonService.js";

const commonController = {


  
  //==================================== send otp to reset password ========================================

  sendOTP: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) return res.status(400).json({ message: "Email is required" });

      const response = await commonService.sendOTP(email);
      
    
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error sending OTP:", error);
      return res.status(500).json({ message: "Error sending OTP" });
    }
  },

  verifyOTP: async (req, res) => {
    try {
      const response = await commonService.verifyOTP(req.body);

      if (!response.success) {
        return res.status(400).json({ message: response.message });
      }

      res.status(200).json({ message: response.message });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const response = await commonService.resetPassword(req.body);
      if (!response.success) {
        return res.status(400).json({ message: response.message });
      }

      res.status(200).json({ message: response.message });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  //===================================== adding company ===================================================
 
  /*  addCompany: async (req, res) => {
    try {

      const newCompany = await commonService.addCompany(req.body);

      return res
        .status(200)
        .json({ message: "Company added successfully!", newCompany });
    } catch (error) {
      console.log("Error occurred:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  generateExcel: async (req, res) => {
    try {
      const filePath = await commonService.generateExcel(req.params);
      res.download(filePath, "company_data.xlsx", (err) => {
          if (err) {
              console.error("Error downloading file:", err);
              res.status(500).send("Error downloading file");
          }
      });
  } catch (error) {
      res.status(500).send("Error generating Excel file");
  }
},

// generateExcel: async (req, res) => {
//   try {
//     const buffer = await commonService.generateExcel(req.params);
//     res.setHeader("Content-Disposition", "attachment; filename=company_data.xlsx");
//     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//     res.send(buffer);
// } catch (error) {
//     res.status(500).send("Error generating Excel file");
// }
// },

  getCompany: async (req, res) => {
    try {
      const allCompany = await commonService.getCompany(req.params);

      if (!allCompany || allCompany.length === 0) {
        return res.status(404).json({ message: "No admin found" });
      }

      return res.status(200).json({ allCompany });
    } catch (error) {
      console.error("Error fetching books:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching books" });
    }
  },

  updateCompany: async (req, res) => {
    try {
      const data = req.body;
  
      const result = await commonService.updateDetail(data);
  
      // if (result.error) {
      //   return res.status(400).json({ success: false, message: result.error });
      // }
  
      return res.status(200).json({
        data: result,
      });
    } catch (error) {
      console.error("Controller Error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  deleteCompany : async (req, res) => {
    try {
        const { company_id } = req.body; // Expecting company_id in request body

        const result = await commonService.deleteCompany(company_id);

        if (result.error) {
            return res.status(400).json({ success: false, message: result.error });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
},
 */

//********************************** Add Role***************************************************/

/* addRole :async(req, res) =>{
  try {
    const addRole = await commonService.addRole(req.body);
    if (addRole?.error) {
      return res.status(400).json({ success: false, message: result.error });
  }
    res.status(200).json(addRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

updateRole:async (req, res)=>{

  try {
    const updateRoll = await commonService.updateRole(req.body)
    return res.status(200).json(updateRoll);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

deleteRole :async (req, res)=>{
  try {
    const delRole = await commonService.deleteRole(req.body)
    return res.status(200).json(delRole);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}, */

//============================ Department ==========================================

addDepartment :async (req, res) => {
  try {
    const department = await commonService.addDepartment(req.body);
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

updateDepartment: async (req, res)=>{

  try {
    const updatedDept = await commonService.updateDepartment(req.body)
    return res.status(200).json(updatedDept);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

deleteDepartment : async (req, res) => {
  try {
      const { dept_id } = req.body; 

      const dept = await commonService.deleteDepartment(dept_id);
      return res.status(200).json(dept);
  } catch (error) {
      console.error("Controller Error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
  }
},


//============================== category =======================================

addCategory :async (req, res) => {
  try {
   
    const category = await commonService.addCategory(req.body);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

updateCategory: async (req, res)=>{

  try {
    const updatedCategory = await commonService.updateCategory(req.body)
    return res.status(200).json(updatedCategory);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

deleteCategory : async (req, res) => {
  try {
      const { category_id } = req.body; 

      const categry = await commonService.deleteCategory(category_id);
      return res.status(200).json(categry);
  } catch (error) {
      console.error("Controller Error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
  }
},



//=============================== Brand =====================================

addBrand :async (req, res) => {
  try {
    
    const brand = await commonService.addBrand(req.body);
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},
updateBrand:async (req, res)=>{

  try {
    const updateBrand = await commonService.updateBrand(req.body)
    return res.status(200).json(updateBrand);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

deleteBrand : async (req, res) => {
  try {
    const {brand_id} = req.body
      const brand = await commonService.deleteBrand(brand_id);
      return res.status(200).json(brand);
  } catch (error) {
      console.error("Controller Error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
  }
},

//============================== Payment/Receipt ==============================

addPayExpenditure :async (req, res) => {
  try {
    
    const newpayExpenditure = await commonService.addPayExpenditure(req.body);
    res.status(200).json(newpayExpenditure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

updatePayExpenditure:async (req, res)=>{

  try {
    const updateExpenditure = await commonService.updatePayExpenditure(req.body)
    return res.status(200).json(updateExpenditure);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

deleteExpenditure : async (req, res) => {
  try {
      const deleteExpenditure = await commonService.deleteExpenditure(req.body);
      return res.status(200).json(deleteExpenditure);
  } catch (error) {
      console.error("Controller Error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
  }
},


//=============================== Discount ======================================

addDiscount : async (req, res) =>{
  try {
    const discount = await commonService.addDiscount(req.body)
    res.status(200).json(discount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

updateDiscount :async (req, res)=>{

  try {
    const updatediscount= await commonService.updateDiscount(req.body)
    return res.status(200).json(updatediscount);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

deleteDiscount : async (req, res) => {
  try {
      const deleteDiscount = await commonService.deleteDiscount(req.body);
      return res.status(200).json(deleteDiscount);
  } catch (error) {
      console.error("Controller Error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
  }
},

//==================================== Coupon ======================================

addCoupon : async (req, res) =>{
  try {
    const discount = await commonService.addCoupon(req.body)
    res.status(200).json(discount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

updateCoupon :async (req, res)=>{

  try {
    const updatediscount= await commonService.updateCoupon(req.body)
    return res.status(200).json(updatediscount);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

deleteCoupon : async (req, res) => {
  try {
      const deleteDiscount = await commonService.deleteCoupon(req.body);
      return res.status(200).json(deleteDiscount);
  } catch (error) {
      console.error("Controller Error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
  }
},

//====================================== Other Changes ========================================

otherChanges : async (req, res) =>{
  try {
    const changes = await commonService.otherChanges(req.body)
    res.status(200).json(changes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

updateChanges :async (req, res)=>{

  try {
    const updateOtherChange= await commonService.updateChanges(req.body)
    return res.status(200).json(updateOtherChange);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

deleteChanges : async (req, res) => {
  try {
      const deleteChangess = await commonService.deleteChanges(req.body);
      return res.status(200).json(deleteChangess);
  } catch (error) {
      console.error("Controller Error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
  }
},

//======================================= Reward ===============================================

addReward :async (req, res) =>{
  try {
    const newReward = await commonService.addReward(req.body)
    res.status(200).json(newReward);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

updateReward :async (req, res)=>{

  try {
    const updateR= await commonService.updateReward(req.body)
    return res.status(200).json(updateR);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

deleteReward : async (req, res) => {
  try {
      const deleteRR = await commonService.deleteReward(req.body);
      return res.status(200).json(deleteRR);
  } catch (error) {
      console.error("Controller Error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
  }
},

//===================================== Quick Access Qty ==========================================

addQualityAccess :async (req, res) =>{
  try {
    const newQAQ = await commonService.addQualityAccess(req.body)
    res.status(200).json(newQAQ);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

updateQualityAccess :async (req, res)=>{

  try {
    const updateQAQ= await commonService.updateQualityAccess(req.body)
    return res.status(200).json(updateQAQ);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

deleteQualityAccess : async (req, res) => {
  try {
      const deleteQAQ = await commonService.deleteQualityAccess(req.body);
      return res.status(200).json(deleteQAQ);
  } catch (error) {
      console.error("Controller Error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
  }
},



//*********************************** add new item **********************************************

addNewItem :async (req, res) =>{
  try {
    const newProduct = await commonService.addNewItem(req.body)
    res.status(200).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},


//*********************************** add customer **********************************************

addCustomer : async (req, res) =>{
  try {
    const newCustomer = await commonService.addCustomer(req.body)
    res.status(200).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

},

getCustomer : async (req, res) =>{
  try {
    const {status} = req.query
    const customer = await commonService.getCustomer(status)
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message : error.message})
  }
},


//************************************ Customer Support********************************************

addCustomerSupport : async (req, res) =>{
  try {
    const newSupport = await commonService.addCustomerSupport(req.body)
    res.status(200).json(newSupport)
  } catch (error) {
    res.status(500).json({ messsage: error.message})
  }
},

//************************************** Settings ***********************************************

//----------------------------------- Header-Footer -------------------------------------------

addHeader: async (req, res) =>{
  try {
    
    const footer = await commonService.addHeader(req.body)
    res.status(200).json(footer)
  } catch (error) {
    res.status(500).json({ messsage: error.message})
  }
},

//---------------------------------------- Other --------------------------------------------------


//******************************************* Cart  *******************************************************

addCart : async (req, res) =>{
  try {
    
    const cart = await commonService.addCart(req.body)
    res.status(200).json(cart)
  } catch (error) {
    res.status(500).json({ messsage: error.message})
  }
},

removeCartItem: async (req, res) =>{
  try {
    
    const cart = await commonService.removeCartItem(req.body)
    res.status(200).json(cart)
  } catch (error) {
    res.status(500).json({ messsage: error.message})
  }
},

getCart: async (req, res) =>{
  try {
    
    const cart = await commonService.getCart(req.body)
    res.status(200).json(cart)
  } catch (error) {
    res.status(500).json({ messsage: error.message})
  }
},




//********************************* Supplier **********************************


/* addSupplier : async (req, res) =>{

  try {
    const newSupplier = await commonService.addSupplier(req.body)
    return res.status(200).json(newSupplier)
  } catch (error) {
    return res.status(500).json({ message: error.message})
  }
}, */

/* addWorkers: async(req, res) =>{
  try {
    const newWorker = await commonService.addWorkers(req.body)
    return res.status(200).json({message:"add workers success!!", newWorker})
  } catch (error) {
    return res.status(400).json({message: error.message})
    
  }
}, */

};
export default commonController;


