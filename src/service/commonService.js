import adminRegisterModel from "../model/adminRegister.js";
import Otps from "../model/otp.js";
import organizationModel from "../model/organizationModel.js";
import Company from "../model/company.js";
import Department from "../model/department.js";
import Category from "../model/category.js";
import Brand from "../model/brand.js";
import payExpenditure from "../model/paymentExpenditure.js";
import discountModel from "../model/discount.js";
import Coupon from "../model/coupon.js";
import otherChanges from "../model/OtherChanges.js";
import Reward from "../model/reward.js";
import qAQtyModel from "../model/QuickAccessQty.js";
// import itemModel from "../model/item.js";
import customerModel from "../model/customer.js";
import customerSupport from "../model/customerSupport.js";
import Headerfooter from "../model/headerFooter.js";
import Role from "../model/Role.js";



import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs"
import { fileURLToPath } from "url";
import xlsx from "xlsx"
import Cart from "../model/cart.js";
import SupplierModel from "../model/supplier.js";
import { error } from "console";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const commonService = {


  //----------------------------------send otp to reset password --------------------------------------

  sendEmail: async (data) => {
    const { email, otp } = data
    try {
      const transporter = nodemailer.createTransport({
        // service: "gmail",
        // auth: {
        //   user: process.env.EMAIL_USER,
        //   pass: process.env.EMAIL_PASS,
        // },
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        // text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="text-align: center; color: #4CAF50;">Your One-Time Password</h2>
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 16px; color: #333;">Use the following OTP to complete your verification. The OTP is valid for <strong>5 minutes</strong>.</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; background-color: #4CAF50; color: white; font-size: 24px; padding: 15px 30px; border-radius: 8px; letter-spacing: 2px;">${otp}</span>
            </div>
            <p style="font-size: 14px; color: #999;">If you didn't request this, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="text-align: center; font-size: 12px; color: #aaa;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      `,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Email could not be sent");
    }
  },

  // Function to send OTP
  sendOTP: async (email) => {
    try {
      const existEmail = await adminRegisterModel.findOne({ email });
      if (!existEmail) {
        console.log("email not found");
        return { message: "email not found" };
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

      // Save or update OTP in the `Otps` collection
      await Otps.findOneAndUpdate(
        { email }, // Find OTP record by email
        { otp, otpExpires }, // Update with new OTP and expiration time
        { upsert: true, new: true } // Create if not exists
      );

      // Send OTP to the email
      await commonService.sendEmail({ email, otp });
      console.log(email, otp);
      return { message: "OTP sent to your email" };
    } catch (error) {
      console.error("Error sending OTP:", error);
      return { message: "Failed to send OTP" };
    }
  },

  verifyOTP: async (data) => {
    const {email, otp} = data
    try {
      const otpEntry = await Otps.findOne({ email });

      if (!otpEntry) {
        return { success: false, message: "OTP not found for this email" };
      }


      if (new Date() > otpEntry.otpExpires) {
        return { success: false, message: "OTP has expired" };
      }

     const updatedOtp = await Otps.findOneAndUpdate({ email }, { $set: { verified: true } });

      return { success: true, message: "OTP verification successful",updatedOtp };
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return { success: false, message: "Internal server error" };
    }
  },

  resetPassword: async (data) => {
    
    const {email, password, confirmPassword} = data
    console.log("hii");
    console.log(data);
    try {

      if( password !== confirmPassword){
        return {error:"password not matched"}
      }

      const otpEntry = await Otps.findOne({ email });

      if (!otpEntry || !otpEntry.verified) {
        return { success: false, message: "OTP not verified" };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedUser = await adminRegisterModel.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true } 
      );

      if (!updatedUser) {
        return { success: false, message: "User not found" };
      }

      await Otps.deleteOne({ email });

      return { success: true, message: "Password reset successfully" , updatedUser};
    } catch (error) {
      console.error("Error resetting password:", error);
      return { success: false, message: "Internal server error" };
    }
  },



//----------------------------------- adding company -----------------------------------------------------


/* addCompany: async (data) => {
  const { 
    admin_id, org_id,
    firmName, gstin, phoneNumber, email, address, city, pos, 
    deviceId, storeGroupName, storeName, deviceName, companyLogo 
        } = data;
        console.log("Received Data:", data);
  try {
      // if(!admin_id || !org_id) return('both fields are required')
      // const admin = await adminRegisterModel.findById(admin_id)
      // if(!admin) {return ('admin not found')}
  
      //   const org = await organizationModel.findById(org_id)
      //   if(!org) {return ('org not found')}


      const company = await Company.create({
        admin_id, org_id,
        firmName,
          gstin,
          phoneNumber,
          email,
          address,
          city,
          pos,
          deviceId,
          storeGroupName,
          storeName,
          deviceName,
          companyLogo
      });

      console.log("Company Created:", company);
      return company;

  } catch (error) {
      console.error("Error occurred:", error);
      throw error;
  }
},

generateExcel: async (data) => {
    const {admin_id} = data
  try {
    const companies = await Company.find({admin_id}); 

    const data = companies.map(company => ({
        FirmName: company.firmName,
        GSTIN: company.gstin,
        PhoneNumber: company.phoneNumber,
        Email: company.email,
        Address: company.address,
        City: company.city,
        POS: company.pos,
        DeviceID: company.deviceId,
        StoreGroupName: company.storeGroupName,
        StoreName: company.storeName,
        DeviceName: company.deviceName,
    }));

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Companies");

    const dirPath = path.join(__dirname, "../public");
    const filePath = path.join(dirPath, "company_data.xlsx");

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    xlsx.writeFile(workbook, filePath);

    return filePath;
} catch (error) {
    console.error("Error generating Excel:", error);
    throw new Error("Error generating Excel file");
}
},

// generateExcel: async (data) => {
//   const {admin_id} = data
// try {
//   const companies = await Company.find({admin_id}); 

//   const data = companies.map(company => ({
//       FirmName: company.firmName,
//       GSTIN: company.gstin,
//       PhoneNumber: company.phoneNumber,
//       Email: company.email,
//       Address: company.address,
//       City: company.city,
//       POS: company.pos,
//       DeviceID: company.deviceId,
//       StoreGroupName: company.storeGroupName,
//       StoreName: company.storeName,
//       DeviceName: company.deviceName,
//   }));

//   const workbook = xlsx.utils.book_new();
//   const worksheet = xlsx.utils.json_to_sheet(data);
//   xlsx.utils.book_append_sheet(workbook, worksheet, "Companies");

//   const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });
//   return buffer;

// } catch (error) {
//   console.error("Error generating Excel:", error);
//   throw new Error("Error generating Excel file");
// }
// },

getCompany: async (data) => {
const {admin_id} = data
  try {
      const company = await Company.find({admin_id});
      return company;
  } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
  }
},

updateDetail: async (data) => {
  const {
    admin_id, org_id, company_id,
    firmName, gstin, phoneNumber, address, city, pos,
    deviceId, storeGroupName, storeName, deviceName,companyLogo
  } = data;

  console.log("Company ID:", company_id, data);

  try {
    if(!admin_id || !org_id) return('admin org fields are required')
      const admin = await adminRegisterModel.findById(admin_id)
      if(!admin){ return ('admin not found')}
  
        const org = await organizationModel.findById(org_id)
        if(!org) return ('org not found')

    if (!company_id) {
      console.log("Company ID not found");
      return { error: "Company ID is required" };
    }

    const existingCompany = await Company.findById(company_id);
    if (!existingCompany) {
      return { error: "Company not found" };
    }

    let updateData = {
      firmName, gstin, phoneNumber, address, city, pos,
      deviceId, storeGroupName, storeName, deviceName,
      companyLogo, 
    };

    const updatedCompany = await Company.findByIdAndUpdate(
      company_id,
      updateData,
      { new: true, runValidators: true }
    );

    return updatedCompany;
  } catch (error) {
    console.error("Error occurred:", error);
    return { error: "An error occurred while updating the company." };
  }
},

deleteCompany : async (admin_id, org_id, company_id) => {
  try {
    if(!admin_id || !org_id) return('both fields are required')
      const admin = await adminRegisterModel.findById(admin_id)
      if(!admin) return ('admin not found')
  
        const org = await organizationModel.findById(org_id)
        if(!org) return ('org not found')

      if (!company_id) {
          return { error: "Company ID is required" };
      }

      const company = await Company.findById(company_id);
      if (!company) {
          return { error: "Company not found" };
      }

      // Remove company logo from uploads folder
      if (company.companyLogo) {
          const uploadPath = path.join(process.cwd(), "uploads");
          const logoPath = path.join(uploadPath, path.basename(company.companyLogo));
          
          if (fs.existsSync(logoPath)) {
              fs.unlinkSync(logoPath); // Delete the logo file
          }
      }

      // Delete company from database
      await Company.findByIdAndDelete(company_id);

      return { success: true, message: "Company deleted successfully" };

  } catch (error) {
      console.error("Error occurred:", error);
      return { error: "An error occurred while deleting the company." };
  }
},
 */

//********************************** Add Role***************************************************/

/* addRole : async(data) =>{
  const {org_id, admin_id, store_id, roleList, roleName}=data
  console.log(data)
  try {
    const org = await organizationModel.findById(org_id)
    if(!org) return {error:"organization not found"}
    const admin = await adminRegisterModel.findById(admin_id)
    if(!admin) return {error:"admin not found"}
    const comp = await Company.findById(store_id)
      if(!comp) return {error:"company not found"}

    const role = await Role.create({org_id, admin_id, store_id, roleList, roleName})
    console.log(role)
    return role
    
  } catch (error) {
    throw new Error(`Failed to add department: ${error.message}`);
  }
},

updateRole : async(data) =>{
    const {org_id, admin_id, store_id, role_id, roleList, roleName} = data
      try {

        const org = await organizationModel.findById(org_id)
          if(!org) return ('organization not found')
        const admin = await adminRegisterModel.findById(admin_id)
          if(!admin) return ('admin not found')
        const comp = await Company.findById(store_id)
          if(!comp) return ('company not found')
    
        if (!role_id) {
          throw new Error("role_id is required");
        }
        const URole = await Role.findById(role_id);
          if (!URole) {
              return { error: "Brand not found" };
          }
    
    
        const updatedRole = await Role.findByIdAndUpdate(role_id,{roleList, roleName}, { new: true })
        
        console.log(updatedRole)
        return updatedRole
      } catch (error) {
        console.error("Error occurred:", error);
        return { error: "An error occurred while updating the Role." };
      }
    
    },

deleteRole: async(role_id) =>{
  try {
    if (!role_id) {
        return { error: "Role ID is required" };
    }

    // Find the company
    const roll = await Role.findById(role_id);
    if (!roll) {
        return { error: "Role not found" };
    }

  
    const DRole = await Role.findByIdAndDelete(role_id);

    return { success: true, message: "Role deleted successfully" ,DRole};

} catch (error) {
    console.error("Error occurred:", error);
    return { error: "An error occurred while deleting the Role." };
}
}, */

// ********************************* Configuation *********************************

//-------------------------- create Department ----------------------------------


generateDepartmentCode : async (departmentName) => {
  try {
    const shortCode = departmentName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");

    const count = await Department.countDocuments({
      departmentCode: new RegExp(`^${shortCode}-\\d+$`),
    });

    return `${shortCode}-${(count + 1).toString().padStart(3, "0")}`;
  } catch (error) {
    throw new Error("Error generating department code");
  }
},

addDepartment : async(data)=>{
  const {org_id, admin_id,company_id, departmentName,departmentLogo} = data
  try {

    const org = await organizationModel.findById(org_id)
    if(!org) return ('organization not found')
    const admin = await adminRegisterModel.findById(admin_id)
    if(!admin) return ('admin not found')
    const comp = await Company.findById(company_id)
      if(!comp) return ('company not found')
    if (!departmentName) {
      throw new Error("Department name is required");
    }

    const departmentCode = await commonService.generateDepartmentCode(departmentName);

    const newDepartment = await Department.create({
      org_id, 
      admin_id,
      company_id, 
      departmentName, 
      departmentCode, 
      departmentLogo });
    
    console.log(newDepartment)

    return newDepartment;
  } catch (error) {
    throw new Error(`Failed to add department: ${error.message}`);
  }
},

updateDepartment: async (data)=>{
   const { org_id, admin_id, company_id, dept_id, departmentName, departmentLogo } = data;
console.log(data)
  try {

    const org = await organizationModel.findById(org_id)
    if(!org) {
      throw new Error('organization not found')}
    const admin = await adminRegisterModel.findById(admin_id)
    if(!admin) {
      throw new Error ('admin not found')
    }
    const comp = await Company.findById(company_id)
      if(!comp) {
        throw new Error ('company not found')
      }
    if (!dept_id) {
      throw new Error("Department ID is required");
    }


    const existingDepartment = await Department.findById(dept_id);
    if (!existingDepartment) {
      throw new Error("Department not found");
    }

    
    const deptUpdate = await Department.findByIdAndUpdate(
      dept_id,
      { departmentName ,departmentLogo},
      { new: true }
    );

    if (!deptUpdate) {
      throw new Error("Failed to update department");
    }

    console.log(deptUpdate);
    return deptUpdate;
  } catch (error) {
    throw new Error(`Failed to update department: ${error.message}`);
  }
},

deleteDepartment: async (dept_id) => {
  try {
      if (!dept_id) {
          return { error: "Company ID is required" };
      }

      // Find the company
      const dept = await Department.findById(dept_id);
      if (!dept) {
          return { error: "Company not found" };
      }

    
      const Ddept = await Department.findByIdAndDelete(dept_id);

      return { success: true, message: "Company deleted successfully" ,Ddept};

  } catch (error) {
      console.error("Error occurred:", error);
      return { error: "An error occurred while deleting the company." };
  }
},


//============================== category =======================================


generateCategorytCode : async () => {
  try {
    const count = await Category.countDocuments({
      brandCode: /^B-\d+$/,
    });

    return `B-${(count + 1).toString().padStart(3, "0")}`;
  } catch (error) {
    throw new Error("Error generating brand code");
  }
},

addCategory : async(data)=>{
  const { org_id, admin_id, company_id, dept_id, categoryName, categoryLogo } = data;
  try {
    const adim = await adminRegisterModel.findById(admin_id)
    if(!adim) return ('admin not found')
    
      const org = await organizationModel.findById(org_id)
      if(!org) return ('organization not found')

        const comp = await Company.findById(company_id)
        if(!comp) return ('company not found')

    if (!dept_id) {
      throw new Error("Department ID is required");
    }

    const existingDepartment = await Department.findById(dept_id)

            if(!existingDepartment){
                throw{
                    error :"department not found"
                }
            }
    const categoryCode = await commonService.generateCategorytCode(categoryName);

    const newCategory = await Category.create({
      org_id, 
      admin_id, 
      company_id,
      categoryName,
      categoryCode, 
      dept_id,
      categoryLogo,
      departmentName:existingDepartment.departmentName
    });

    console.log(newCategory);
    return newCategory;
  } catch (error) {
    throw new Error(`Failed to add category: ${error.message}`);
  }
},

updateCategory: async (data)=>{
  const {org_id, admin_id, company_id, dept_id, category_id, categoryName, categoryLogo } = data;
  try {
    const org = await organizationModel.findById(org_id)
    if (!org) {
      return ('organization not found')
    }
    const admin = await adminRegisterModel.findById(admin_id)
    if(!admin) return ('admin not found')
      const comp = await Company.findById(company_id)
        if(!comp) return ('admin not found')
    if (!dept_id) {
      throw new Error("Department ID is required");
    }

    if (!category_id) {
      throw new Error("Category ID is required");
    }
    const departmentExists = await Department.findById(dept_id);
    if (!departmentExists) {
      throw new Error("Department not found");
    }

    const categoryExists = await Category.findById(category_id);
    if (!categoryExists) {
      throw new Error("Category not found");
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      category_id, 
      { categoryName , categoryLogo},
      { new: true }
    );

    if (!updatedCategory) {
      throw new Error("Failed to update category");
    }

    console.log(updatedCategory);
    return updatedCategory;
  } catch (error) {
    throw new Error(`Failed to update category: ${error.message}`);
  }
},

deleteCategory: async (category_id) => {
  try {
      if (!category_id) {
          return { error: "Category ID is required" };
      }

      // Find the company
      const dept = await Category.findById(category_id);
      if (!dept) {
          return { error: "Category not found" };
      }

    
      const DCategory = await Category.findByIdAndDelete(category_id);

      return { success: true, message: "Category deleted successfully" ,DCategory};

  } catch (error) {
      console.error("Error occurred:", error);
      return { error: "An error occurred while deleting the company." };
  }
},



//=============================== Brand =====================================

generateBrandCode: async () => {
  try {
    const count = await Brand.countDocuments({
      brandCode: /^B-\d+$/,
    });

    return `B-${(count + 1).toString().padStart(3, "0")}`;
  } catch (error) {
    throw new Error("Error generating brand code");
  }
},

addBrand: async (data) => {
  const { org_id, admin_id, company_id, brandName } = data;
  try {

    const org = await organizationModel.findById(org_id)
    if(!org) return ('organization not found')
      const admin = await adminRegisterModel.findById(admin_id)
    if(!admin) return ('admin not found')
      const comp = await Company.findById(company_id)
    if(!comp) return ('company not found')
    
    if (!brandName) {
      throw new Error("Brand name is required");
    }

    const brandCode = await commonService.generateBrandCode(brandName);

    const newBrand = await Brand.create({ 
      org_id, 
      admin_id, 
      company_id, 
      brandName, 
      brandCode 
    });

    console.log(newBrand);

    return newBrand;
  } catch (error) {
    throw new Error(`Failed to add brand: ${error.message}`);
  }
},

updateBrand: async (data) =>{
const {brand_id, brandName} = data
  try {

    if (!brand_id) {
      throw new Error("Brand id is required");
    }
    const brand = await Brand.findById(brand_id);
      if (!brand) {
          return { error: "Brand not found" };
      }


    const updatedBrand = await Brand.findByIdAndUpdate(brand_id,{brandName}, { new: true })
    
    console.log(updatedBrand)
    return updatedBrand
  } catch (error) {
    throw new Error(`Failed to update brand: ${error.message}`);
  }

},

deleteBrand: async (brand_id) => {
  try {
      if (!brand_id) {
          return { error: "Brand ID is required" };
      }

      // Find the company
      const brand = await Brand.findById(brand_id);
      if (!brand) {
          return { error: "Brand not found" };
      }

    
      const DBrand = await Brand.findByIdAndDelete(brand_id);

      return { success: true, message: "Brand deleted successfully" ,DBrand};

  } catch (error) {
      console.error("Error occurred:", error);
      return { error: "An error occurred while deleting the brand." };
  }
},


//============================== Payment/Receipt ==============================

addPayExpenditure: async (data) => {
  const { org_id, admin_id, company_id, description } = data;
  try {
    
    if (!description) {
      throw new Error("Brand name is required");
    }

    const org = await organizationModel.findById(org_id)
    if(!org) return ('organization not found')
      const admin = await adminRegisterModel.findById(admin_id)
    if(!admin) return ('admin not found')
      const comp = await Company.findById(company_id)
    if(!comp) return ('company not found')

    const newPay = await payExpenditure.create({ org_id, admin_id, company_id, description});

    console.log(newPay);

    return newPay;
  } catch (error) {
    throw new Error(`Failed to add description: ${error.message}`);
  }
},

updatePayExpenditure : async (data) =>{
  const {Expenditure_id, description} = data
    try {
  
      if (!Expenditure_id) {
        throw new Error("Expenditure id is required");
      }
      const Expenditure = await payExpenditure.findById(Expenditure_id);
        if (!Expenditure) {
            return { error: "Expenditure not found" };
        }
  
  
      const updatedExpenditure = await payExpenditure.findByIdAndUpdate(Expenditure_id,{description}, { new: true })
      
      console.log(updatedExpenditure)
      return updatedExpenditure
    } catch (error) {
      throw new Error(`Failed to add description: ${error.message}`);
    }
  
},
  
deleteExpenditure: async (data) => {

    const {Expenditure_id} = data
    try {
        if (!Expenditure_id) {
            return { error: "Expenditure ID is required" };
        }
  console.log("hii")
        // Find the company
        const Expenditure = await payExpenditure.findById(Expenditure_id);
        if (!Expenditure) {
            return { error: "Expenditure not found" };
        }
  
      
        const DeleteExpenditure= await payExpenditure.findByIdAndDelete(Expenditure_id);
  
        return { success: true, message: "Expenditure deleted successfully" ,DeleteExpenditure};
  
    } catch (error) {
        console.error("Error occurred:", error);
        return { error: "An error occurred while deleting the Expenditure." };
    }
},


//=============================== Discount ======================================


addDiscount : async (data) => {
  const {  org_id, admin_id, company_id, description, percentage } = data;
  try {
    
    if (!description || !percentage) {
      throw new Error("both description & percentage is required");
    }

    const org = await organizationModel.findById(org_id)
    if(!org) return ('organization not found')
      const admin = await adminRegisterModel.findById(admin_id)
    if(!admin) return ('admin not found')
      const comp = await Company.findById(company_id)
    if(!comp) return ('company not found')


    const newDiscount = await discountModel.create({ 
      org_id, 
      admin_id, 
      company_id, 
      description, 
      percentage
    });

    console.log(newDiscount);

    return newDiscount;
  } catch (error) {
    throw new Error(`Failed to add discount: ${error.message}`);
  }
},

updateDiscount : async (data) =>{
  const {discount_id, description, percentage} = data
    try {
  
      if (!discount_id) {
        throw new Error("discount id is required");
      }
      const discount = await discountModel.findById(discount_id);
        if (!discount) {
            return { error: "discount not found" };
        }
  
  
      const updatedDiscount = await discountModel.findByIdAndUpdate(discount_id,{description, percentage}, { new: true })
      
      console.log(updatedDiscount)
      return updatedDiscount
    } catch (error) {
      throw new Error(`Failed to add discount: ${error.message}`);
    }
  
  },
  
deleteDiscount: async (data) => {

    const {discount_id} = data
    try {
        if (!discount_id) {
            return { error: "Discount ID is required" };
        }
  console.log("hii")
       
        const Discount = await discountModel.findById(discount_id);
        if (!Discount) {
            return { error: "discount not found" };
        }
  
      
        const DeleteDiscount= await discountModel.findByIdAndDelete(discount_id);
  
        return { success: true, message: "Discount deleted successfully" ,DeleteDiscount};
  
    } catch (error) {
        console.error("Error occurred:", error);
        return { error: "An error occurred while deleting the Discount." };
    }
},


//==================================== Coupon ======================================

addCoupon : async (data) => {
  const { org_id, admin_id, company_id, description, amount } = data;
  try {
    
    if (!description || !amount) {
      throw new Error("both description & amount is required");
    }

    const org = await organizationModel.findById(org_id)
    if(!org) return ('organization not found')
      const admin = await adminRegisterModel.findById(admin_id)
    if(!admin) return ('admin not found')
      const comp = await Company.findById(company_id)
    if(!comp) return ('company not found')

    const newCoupon = await Coupon.create({org_id, admin_id, company_id,description, amount});

    console.log(newCoupon);

    return newCoupon;
  } catch (error) {
    throw new Error(`Failed to add coupon: ${error.message}`);
  }
},

updateCoupon : async (data) =>{
  const {coupon_id, description, amount} = data
    try {
  
      if (!coupon_id) {
        throw new Error("discount id is required");
      }
      const coupon = await Coupon.findById(coupon_id);
        if (!coupon) {
            return { error: "discount not found" };
        }
  
  
      const updatedCoupon = await Coupon.findByIdAndUpdate(coupon_id,{description, amount}, { new: true })
      
      console.log(updatedCoupon)
      return updatedCoupon
    } catch (error) {
      throw new Error(`Failed to add couopon: ${error.message}`);
    }
  
},
  
deleteCoupon: async (data) => {

    const {coupon_id} = data
    try {
        if (!coupon_id) {
            return { error: "coupon ID is required" };
        }
  console.log("hii")
       
        const Dcoupon = await Coupon.findById(coupon_id);
        if (!Dcoupon) {
            return { error: "coupon not found" };
        }
  
      
        const DeleteCoupon= await Coupon.findByIdAndDelete(coupon_id);
  
        return { success: true, message: "coupon deleted successfully" ,DeleteCoupon};
  
    } catch (error) {
        console.error("Error occurred:", error);
        return { error: "An error occurred while deleting the coupon." };
    }
},

//====================================== Other Changes ========================================


otherChanges: async (data) => {
  const { org_id, admin_id, company_id, description, amount, chargeable } = data;
  try {
    
    if (!description || !amount || !chargeable) {
      throw new Error("both description & amount is required");
    }

    const org = await organizationModel.findById(org_id)
    if(!org) return ('organization not found')
      const admin = await adminRegisterModel.findById(admin_id)
    if(!admin) return ('admin not found')
      const comp = await Company.findById(company_id)
    if(!comp) return ('company not found')


    const other = await otherChanges.create({org_id, admin_id, company_id, description, amount, chargeable});

    console.log(other);

    return other;
  } catch (error) {
    throw new Error(`Failed to add changes: ${error.message}`);
  }
},

updateChanges : async (data) =>{
  const { others_id, description, amount, chargeable } = data
    try {
  
      if (!others_id) {
        throw new Error("discount id is required");
      }
      const changes = await otherChanges.findById(others_id);
        if (!changes) {
            return { error: "discount not found" };
        }
  
  
      const updatedchanges = await otherChanges.findByIdAndUpdate(others_id,{description, amount, chargeable}, { new: true })
      
      console.log(updatedchanges)
      return updatedchanges
    } catch (error) {
      throw new Error(`Failed to add changes: ${error.message}`);
    }
  
  },
  
deleteChanges: async (data) => {

    const {others_id} = data
    try {
        if (!others_id) {
            return { error: "change ID is required" };
        }
  console.log("hii")
       
        const deleteChange = await otherChanges.findById(others_id);
        if (!deleteChange) {
            return { error: "coupon not found" };
        }
  
      
        const DeleteOthers= await otherChanges.findByIdAndDelete(others_id);
  
        return { success: true, message: "changes deleted successfully" ,DeleteOthers};
  
    } catch (error) {
        console.error("Error occurred:", error);
        return { error: "An error occurred while deleting the changes." };
    }
},


//======================================= Reward ===============================================

// addReward :async (data) =>{
//   const { amountEligible, rewardPoints, amountPerPoint, minPointsToRedeem } = data
//   try {

//     if (!amountEligible || !rewardPoints || !amountPerPoint || !minPointsToRedeem) {
//       throw new Error("All fields are required");
//     }


//     const reward = await Reward.create({amountEligible, rewardPoints, amountPerPoint, minPointsToRedeem})

//     console.log(reward);

//     return reward;
//   } catch (error) {
//     throw new Error(`Failed to add reward: ${error.message}`);
//   }
    
// },

/* updateReward : async (data) =>{
  const { reward_id, amountEligible, rewardPoints, amountPerPoint, minPointsToRedeem} = data
 

  try {
    let reward = reward_id 
        ? await Reward.findByIdAndUpdate(reward_id, { amountEligible, rewardPoints, amountPerPoint, minPointsToRedeem }, { new: true }) 
        : await Reward.findOneAndUpdate({}, { amountEligible, rewardPoints, amountPerPoint, minPointsToRedeem }, { new: true, upsert: true });

        console.log(reward)
    return reward;
} catch (error) {
    throw new Error(`Failed to update or create reward: ${error.message}`);
}

 //   try {
  
  //     if (!reward_id) {
  //       throw new Error("reward id is required");
  //     }
  //     const  updtReward= await Reward.findById(reward_id);
  //       if (!updtReward) {
  //           return { error: "reward not found" };
  //       }
  
  
  //     const updatedreward = await Reward.findByIdAndUpdate(reward_id,{amountEligible, rewardPoints, amountPerPoint, minPointsToRedeem}, { new: true })
      
  //     console.log(updatedreward)
  //     return updatedreward
  //   } catch (error) {
  //     throw new Error(`Failed to update reward: ${error.message}`);
  //   }
  
  }, */
  
  updateReward: async (data) => {
    const { reward_id, amountEligible, rewardPoints, amountPerPoint, minPointsToRedeem } = data;
  
    try {
      let reward;
  
      if (reward_id) {
        // Update only if reward_id is provided
        reward = await Reward.findByIdAndUpdate(
          reward_id,
          { amountEligible, rewardPoints, amountPerPoint, minPointsToRedeem },
          { new: true }
        );
  
        if (!reward) {
          throw new Error("Reward not found. Cannot update.");
        }
      } else {
        // If no reward_id is provided, check if a reward exists
        const existingReward = await Reward.findById(reward_id); // Only fetch _id for efficiency
        if (existingReward) {
          throw new Error("Reward already exists. Provide an ID to update.");
        }
  
        // Create new reward if none exist
        reward = new Reward({ amountEligible, rewardPoints, amountPerPoint, minPointsToRedeem });
        await reward.save();
      }
  
      console.log(reward);
      return reward;
    } catch (error) {
      throw new Error(`Failed to update or create reward: ${error.message}`);
    }
  },
  
deleteReward: async (data) => {

    const {reward_id} = data
    try {
        if (!reward_id) {
            return { error: "reward ID is required" };
        }


        const deleteReward = await Reward.findById(reward_id);
        if (!deleteReward) {
            return { error: "reward not found" };
        }
  
      
        const DeleteReward= await Reward.findByIdAndDelete(reward_id);
  
        return { success: true, message: "reward deleted successfully" ,DeleteReward};
  
    } catch (error) {
        console.error("Error occurred:", error);
        return { error: "An error occurred while deleting the reward." };
    }
},


//======================================= paymentOption ===============================================


//===================================== Quick Access Qty ==========================================

addQualityAccess :async (data) =>{
  const { org_id, admin_id, company_id, value1, value2, value3, value4, uom } = data
  try {

    if (!value1 || !value2 || !value3 || !value4 || !uom) {
      throw new Error("All fields are required");
    }

    const org = await organizationModel.findById(org_id)
    if(!org) return ('organization not found')
      const admin = await adminRegisterModel.findById(admin_id)
    if(!admin) return ('admin not found')
      const comp = await Company.findById(company_id)
    if(!comp) return ('company not found')


    const QAQ = await qAQtyModel.create({ org_id, admin_id, company_id,value1, value2, value3, value4, uom})

    console.log(QAQ);

    return QAQ;
  } catch (error) {
    throw new Error(`Failed to add quality: ${error.message}`);
  }
    
},

updateQualityAccess : async (data) =>{
  const { AccQty_id, value1, value2, value3, value4, uom} = data
    try {
  
      if (!AccQty_id) {
        throw new Error("quality id is required");
      }
      const  updtQAQ= await qAQtyModel.findById(AccQty_id);
        if (!updtQAQ) {
            return { error: "quality not found" };
        }
  
  
      const updatedqaq = await qAQtyModel.findByIdAndUpdate(AccQty_id,{value1, value2, value3, value4, uom}, { new: true })
      
      console.log(updatedqaq)
      return updatedqaq
    } catch (error) {
      throw new Error(`Failed to update quality: ${error.message}`);
    }
  
  },
  
deleteQualityAccess: async (data) => {

    const {AccQty_id} = data
    try {
        if (!AccQty_id) {
            return { error: "quality ID is required" };
        }


        const deleteQAQ = await qAQtyModel.findById(AccQty_id);
        if (!deleteQAQ) {
            return { error: "quality not found" };
        }
  
      
        const DeleteReward= await qAQtyModel.findByIdAndDelete(AccQty_id);
  
        return { success: true, message: "quality deleted successfully" ,DeleteReward};
  
    } catch (error) {
        console.error("Error occurred:", error);
        return { error: "An error occurred while deleting the quality." };
    }
},


//*********************************** add new item **********************************************

addNewItem: async (data) =>{

  const { org_id, admin_id, store_id, 
    barcode, shortName, longName,shortCode,uom,brand,dept,category,
    retailPrice, MRP, wholeSalePrice, purchasePrice, expiry_date, purchased_date, minStock, quantity, HSNcode,
    discount, discountAmount, incentiveAmount, uom2, uomConversion,cgst, sgst,igst,
    cessRate, cessAmount,additionalCessAmt, productImg,favourite, active} = data

  try {

    const org = await organizationModel.findById(org_id)
    if(!org) return ('organization not found')
      const admin = await adminRegisterModel.findById(admin_id)
    if(!admin) return ('admin not found')
      const comp = await Company.findById(store_id)
    if(!comp) return ('company not found')

    const product ={ org_id, admin_id, store_id, barcode, shortName, longName,shortCode,uom,brand,dept,category,
      retailPrice, MRP, wholeSalePrice, purchasePrice, expiry_date, purchased_date, minStock, quantity, HSNcode,
      discount, discountAmount, incentiveAmount, uom2, uomConversion,cgst, sgst,igst,
      cessRate, cessAmount,additionalCessAmt, productImg, favourite, active }
    
    const products = await itemModel.create(product)
    console.log(products)
    return products
  } catch (error) {
    throw new Error(`Failed to add product: ${error.message}`);
  }
},


//*********************************** add customer **********************************************

addCustomer :async(data)=>{
  const { name, phoneno, active} = data

  try {
    const customerData = { name, phoneno, active}

      const customer = await customerModel.create(customerData)
      
      console.log(customer)
      return customer
  } catch (error) {
    throw new Error(`Failed to add customer: ${error.message}`);
  }
},


getCustomer : async (status) =>{
  try {
    let filter ={}

    if(status == 'active'){
      filter.active = true  
    }else if(status == 'inActive'){
      filter.active = false
    }

    const filterCust = await customerModel.find(filter)
    console.log(filterCust)

    return filterCust  
  } catch (error) {
    throw new Error(`Failed to get customer: ${error.message}`);
  }

},


//************************************ Customer Support********************************************

addCustomerSupport : async(data)=>{
  const {taskType, problemType, seriol_No, contact_No, email, summary} = data

  try {
    if (!taskType || !problemType || !seriol_No || !contact_No || !email || !summary) {
      throw new Error("All fields are required");
    }

    const support = await customerSupport.create({
      taskType,
      problemType,
      seriol_No,
      contact_No,
      email,
      summary
    })

    console.log(support)
    return support   
  } catch (error) {
    throw new Error(`Failed to add customer: ${error.message}`);
  }

},


//************************************** Settings ***********************************************

//----------------------------------- Header-Footer -------------------------------------------

addHeader : async (data) =>{
  const {title, Hline1, Hline2, Hline3, Hline4, Hline5, Fline1, Fline2, Fline3, Fline4, Fline5, text} = data
  try {
    if (!title || !Hline1 || !Hline2 || !Hline3 || !Hline4 || !Hline5 || !Fline1 || !Fline2 || !Fline3 || !Fline4 || !Fline5 || !text) {
      throw new Error("All fields are required");
    }

    const header = await Headerfooter.create({
      title, Hline1, Hline2, Hline3, Hline4, Hline5, Fline1, Fline2, Fline3, Fline4,Fline5, text
    })

    console.log(header)
    return header

  } catch (error) {
    throw new Error(`Failed to add customer: ${error.message}`);
  }
},

//---------------------------------------- Other ---------------------------------------------------------\
//******************************************* Cart  *******************************************************

addcart : async(data)=>{
  const {item_id, quantity} = data
  try {
    const item = await itemModel.findById(item_id)
    if(!item) return('item not found')

    
  } catch (error) {
    
  }
},
//******************************************* Cart  *******************************************************

/* addCart : async (data)=>{
  const {item_id, shortName, quantity} = data
  try {

    if(!item_id || !quantity ){
      throw new Error ("both fields required")
    }
    
    const itemms = await itemModel.findById(item_id)
    if(!itemms){
      throw ("item not found")
    }
    if(itemms.quantity < quantity){
      console.log("insufficient stock")
      throw new Error ("insufficient stock")
    }

    let cartItem = await Cart.findOne({item_id, shortName})
    if(cartItem){
      cartItem.quantity += quantity
      cartItem.total_price = itemms.purchasePrice *cartItem.quantity
      itemms.quantity -= quantity
      await itemms.save()
      await cartItem.save()
    }else{
      cartItem = await Cart.create({
        item_id,
        shortName: itemms.shortName,
        quantity,
        total_price: itemms.purchasePrice * quantity

      })
    }

  
  itemms.quantity -= quantity
  console.log(cartItem);
  await itemms.save()

  return cartItem
  } catch (error) {
    throw new Error(`Failed to add customer: ${error.message}`);
  }
}, */

// calculatePrice : async (item, quantity) => {
  
//   const discountAmount = (item.retailPrice * (item.discount || 0)) / 100;
//   const totalTaxRate = (item.cgst || 0) + (item.sgst || 0) + (item.igst || 0) + (item.cessRate || 0);
//   const finalPrice = item.retailPrice + (item.retailPrice * totalTaxRate / 100) - discountAmount;
//   const totalPriceForItem = finalPrice * quantity;

//   const cgstAmount = ((item.retailPrice * (item.cgst || 0)) / 100) * quantity;
//     const sgstAmount = ((item.retailPrice * (item.sgst || 0)) / 100) * quantity;
//     const igstAmount = ((item.retailPrice * (item.igst || 0)) / 100) * quantity;
//     const cessAmount = ((item.retailPrice * (item.cessRate || 0)) / 100) * quantity;
//     const totalTaxAmount = cgstAmount + sgstAmount + igstAmount + cessAmount

//     console.log(discountAmount, totalTaxRate, finalPrice, totalPriceForItem, cgstAmount, sgstAmount, igstAmount, cessAmount, totalTaxAmount);

//     return { discountAmount, totalTaxRate, finalPrice, totalPriceForItem, cgstAmount, sgstAmount, igstAmount, cessAmount, totalTaxAmount};
// },  

// addCart: async (data)=>{
//   const { customer_id, item_id, quantity } = data;

//   try {
//       // Check if item exists
//       const item = await itemModel.findById(item_id);
//       if (!item) {
//           throw new Error("Item not found");
//       }

//       const { discountAmount, finalPrice, totalPriceForItem, cgstAmount, sgstAmount, igstAmount, cessAmount, totalTaxAmount } = await commonService.calculatePrice(item, quantity);

//       let cart = await Cart.findOne({ customer_id });

//       if (!cart) {
//           cart = await Cart.create({
//               customer_id,
//               items: [{
//                 item_id,
//                 quantity,
//                 price: finalPrice,
//                 total_price: totalPriceForItem,
//                 cgst: cgstAmount,
//                 sgst: sgstAmount,
//                 igst: igstAmount,
//                 cess: cessAmount
//             }],
//             total_price: totalPriceForItem,
//             discount:discountAmount,
//             total_cgst: cgstAmount,
//             total_sgst: sgstAmount,
//             total_igst: igstAmount,
//             total_cess: cessAmount,
//             total_tax_Amount:totalTaxAmount
//           });
//       } else {
//           if (!cart.items) {
//               cart.items = [];
//           }

//           const existingItem = cart.items.find(i => i.item_id.toString() === item_id);

//           if (existingItem) {
//               // Update quantity and price
//               existingItem.quantity += quantity;
//               existingItem.total_price = existingItem.quantity * finalPrice;
//               existingItem.cgst += cgstAmount;
//               existingItem.sgst += sgstAmount;
//               existingItem.igst += igstAmount;
//               existingItem.cess += cessAmount; 
//           } else {
//               cart.items.push({ item_id, quantity, price: finalPrice, total_price: totalPriceForItem,  cgst: cgstAmount,
//                 sgst: sgstAmount,
//                 igst: igstAmount,
//                 cess: cessAmount });
//           }

          
//           cart.total_price = cart.items.reduce((sum, i) => sum + i.total_price, 0);
//           cart.discount = cart.items.reduce((sum, i) => sum + i.discount, 0) 
//           cart.total_cgst = cart.items.reduce((sum, i) => sum + i.cgst, 0);
//           cart.total_sgst = cart.items.reduce((sum, i) => sum + i.sgst, 0);
//           cart.total_igst = cart.items.reduce((sum, i) => sum + i.igst, 0);
//           cart.total_cess = cart.items.reduce((sum, i) => sum + i.cess, 0);
//           cart.total_tax_Amount = cart.total_cgst + cart.total_sgst + cart.total_igst + cart.total_cess;
//         }
//       item.quantity -= quantity
//       await item.save()
//       await cart.save();

//       return cart;
//   } catch (error) {
//       throw new Error(`Failed to add cart: ${error.message}`);
//   }
  
// }


calculatePrice: async (item, quantity) => {
  const discountAmount = (item.retailPrice * (item.discount || 0)) / 100;
  const totalTaxRate = (item.cgst || 0) + (item.sgst || 0) + (item.igst || 0) + (item.cessRate || 0);
  const finalPrice = item.retailPrice + (item.retailPrice * totalTaxRate / 100) - discountAmount;
  const totalPriceForItem = finalPrice * quantity;

  const cgstAmount = ((item.retailPrice * (item.cgst || 0)) / 100) * quantity;
  const sgstAmount = ((item.retailPrice * (item.sgst || 0)) / 100) * quantity;
  const igstAmount = ((item.retailPrice * (item.igst || 0)) / 100) * quantity;
  const cessAmount = ((item.retailPrice * (item.cessRate || 0)) / 100) * quantity;
  const totalTaxAmount = cgstAmount + sgstAmount + igstAmount + cessAmount;
  const totalDiscountAmount = discountAmount * quantity; 

  console.log(discountAmount, totalTaxRate, finalPrice, totalPriceForItem, cgstAmount, sgstAmount, igstAmount, cessAmount, totalTaxAmount, totalDiscountAmount);

  return { discountAmount: totalDiscountAmount, totalTaxRate, finalPrice, totalPriceForItem, cgstAmount, sgstAmount, igstAmount, cessAmount, totalTaxAmount };
}, 
addCart: async (data) => {
  const { item_id, quantity } = data;

  try {
      
      const item = await itemModel.findById(item_id);
      if (!item) {
          throw new Error("Item not found");
      }

      const { finalPrice, totalPriceForItem, cgstAmount, sgstAmount, igstAmount, cessAmount, totalTaxAmount, discountAmount } = 
          await commonService.calculatePrice(item, quantity);

          console.log('oooo')
      let cart = await Cart.findOne();
      console.log('2222')

      if (!cart) {
          cart = await Cart.create({
              items: [{
                item_id,
                quantity,
                price: finalPrice,
                total_price: totalPriceForItem,
                cgst: cgstAmount,
                sgst: sgstAmount,
                igst: igstAmount,
                cess: cessAmount,
                total_tax: totalTaxAmount,
                discount: discountAmount
              }],
              total_price: totalPriceForItem,
              total_cgst: cgstAmount,
              total_sgst: sgstAmount,
              total_igst: igstAmount,
              total_cess: cessAmount,
              total_tax_Amount: totalTaxAmount,
              total_discount: discountAmount  // Store total discount
          });
          console.log('33333')
      } else {
          if (!cart.items) {
              cart.items = [];
          }

          const existingItem = cart.items.find(i => i.item_id.toString() === item_id);

          if (existingItem) {
              // Update existing item
              existingItem.quantity += quantity;
              existingItem.total_price = existingItem.quantity * finalPrice;
              existingItem.cgst += cgstAmount;
              existingItem.sgst += sgstAmount;
              existingItem.igst += igstAmount;
              existingItem.cess += cessAmount;
              existingItem.total_tax += totalTaxAmount;
              existingItem.discount += discountAmount; // Update discount
          } else {
              cart.items.push({
                item_id, 
                quantity, 
                price: finalPrice, 
                total_price: totalPriceForItem,  
                cgst: cgstAmount,
                sgst: sgstAmount,
                igst: igstAmount,
                cess: cessAmount,
                discount: discountAmount // Add discount
              });
          }

          // Update cart totals
          cart.total_price = cart.items.reduce((sum, i) => sum + i.total_price, 0); 
          cart.total_cgst = cart.items.reduce((sum, i) => sum + i.cgst, 0);
          cart.total_sgst = cart.items.reduce((sum, i) => sum + i.sgst, 0);
          cart.total_igst = cart.items.reduce((sum, i) => sum + i.igst, 0);
          cart.total_cess = cart.items.reduce((sum, i) => sum + i.cess, 0);
          cart.total_tax_Amount = cart.total_cgst + cart.total_sgst + cart.total_igst + cart.total_cess;
          cart.total_discount = cart.items.reduce((sum, i) => sum + i.discount, 0); // Sum all discounts
      }

      // Reduce item stock
      item.quantity -= quantity;
      await item.save();
      console.log('hhhh')
      await cart.save();
      console.log(cart)
      return cart;
  } catch (error) {
      throw new Error(`Failed to add cart: ${error.message}`);
  }
}, 

/* addCart: async (data) => {
  const { customer_id, item_id, quantity } = data;

  try {
      const cus = await customerModel.findById(customer_id)
      if(!cus) return ('customer not found')
      const item = await itemModel.findById(item_id);
      if (!item) {
          throw new Error("Item not found");
      }

      const { finalPrice, totalPriceForItem, cgstAmount, sgstAmount, igstAmount, cessAmount, totalTaxAmount, discountAmount } = 
          await commonService.calculatePrice(item, quantity);

          console.log('oooo')
      let cart = await Cart.findOne({customer_id});
      console.log('2222')

      if (!cart) {
          cart = await Cart.create({
              customer_id,
              items: [{
                item_id,
                quantity,
                price: finalPrice,
                total_price: totalPriceForItem,
                cgst: cgstAmount,
                sgst: sgstAmount,
                igst: igstAmount,
                cess: cessAmount,
                total_tax: totalTaxAmount,
                discount: discountAmount
              }],
              total_price: totalPriceForItem,
              total_cgst: cgstAmount,
              total_sgst: sgstAmount,
              total_igst: igstAmount,
              total_cess: cessAmount,
              total_tax_Amount: totalTaxAmount,
              total_discount: discountAmount  // Store total discount
          });
          console.log('33333')
      } else {
          if (!cart.items) {
              cart.items = [];
          }

          const existingItem = cart.items.find(i => i.item_id.toString() === item_id);

          if (existingItem) {
              // Update existing item
              existingItem.quantity += quantity;
              existingItem.total_price = existingItem.quantity * finalPrice;
              existingItem.cgst += cgstAmount;
              existingItem.sgst += sgstAmount;
              existingItem.igst += igstAmount;
              existingItem.cess += cessAmount;
              existingItem.total_tax += totalTaxAmount;
              existingItem.discount += discountAmount; // Update discount
          } else {
              cart.items.push({
                item_id, 
                quantity, 
                price: finalPrice, 
                total_price: totalPriceForItem,  
                cgst: cgstAmount,
                sgst: sgstAmount,
                igst: igstAmount,
                cess: cessAmount,
                discount: discountAmount // Add discount
              });
          }

          // Update cart totals
          cart.total_price = cart.items.reduce((sum, i) => sum + i.total_price, 0); 
          cart.total_cgst = cart.items.reduce((sum, i) => sum + i.cgst, 0);
          cart.total_sgst = cart.items.reduce((sum, i) => sum + i.sgst, 0);
          cart.total_igst = cart.items.reduce((sum, i) => sum + i.igst, 0);
          cart.total_cess = cart.items.reduce((sum, i) => sum + i.cess, 0);
          cart.total_tax_Amount = cart.total_cgst + cart.total_sgst + cart.total_igst + cart.total_cess;
          cart.total_discount = cart.items.reduce((sum, i) => sum + i.discount, 0); // Sum all discounts
      }

      // Reduce item stock
      item.quantity -= quantity;
      await item.save();
      console.log('hhhh')
      await cart.save();
      console.log(cart)
      return cart;
  } catch (error) {
      throw new Error(`Failed to add cart: ${error.message}`);
  }
}, */

removeCartItem: async (data) => {

  const { customer_id, item_id } = data;

  try {
      let cart = await Cart.findOne({ customer_id });
      if (!cart) {
        throw new Error( "Cart not found" );
      }

      const itemIndex = cart.items.findIndex(i => i.item_id.toString() === item_id);
      if (itemIndex === -1) {
        throw new Error("Item not found in cart" );
      }

      // Get item details before removing
      const removedItem = cart.items[itemIndex];
      cart.items.splice(itemIndex, 1);

      // Recalculate cart totals
      cart.total_price = cart.items.reduce((sum, i) => sum + i.total_price, 0);
      cart.total_cgst = cart.items.reduce((sum, i) => sum + i.cgst, 0);
      cart.total_sgst = cart.items.reduce((sum, i) => sum + i.sgst, 0);
      cart.total_igst = cart.items.reduce((sum, i) => sum + i.igst, 0);
      cart.total_cess = cart.items.reduce((sum, i) => sum + i.cess, 0);
      cart.total_tax_Amount = cart.total_cgst + cart.total_sgst + cart.total_igst + cart.total_cess;
      // cart.total_discount = cart.items.reduce((sum, i) => sum + i.discount, 0);

      // Restore item stock
      const item = await itemModel.findById(item_id);
      if (item) {
          item.quantity += removedItem.quantity;
          await item.save();
      }

      // Remove cart if empty
       if (cart.items.length === 0) {
        await Cart.deleteOne({ customer_id });
        return { message: "Cart is empty now and has been removed" };
    } else {
        await cart.save();
        return { message: "Item removed successfully", cart };
    }
      
  } catch (error) {
    throw new Error(`Failed to remove item: ${error.message}`);
  }
 
},

getCart : async (data)=>{
  const {customer_id} = data
  try {
    const cart = await Cart.findOne({customer_id} );
    if (!cart) {
        throw new Error("Cart not found");
    }
    console.log('gfjsjsj')
    console.log(cart)
    return cart;
  } catch (error) {
    throw new Error(`Failed to get cart: ${error.message}`);
  }
},


//********************************* Supplier **********************************


/* addSupplier : async (data) =>{
     const {admin_id, company_id, firm_name, gstin, phone, email, address, active} = data

     try {
      if(!admin_id || ! company_id ) return ('admin,company id are required')
      
        const admin = await adminRegisterModel.findById(admin_id)
        if(!admin) return ('admin not found')

          const supplier = await SupplierModel.create({
            admin_id,
            company_id,
            firm_name,
            gstin,
            phone,
            email,
            address,
            active
          })
          console.log(supplier)
          return (supplier)
     } catch (error) {
      throw new Error(`Failed to add cart: ${error.message}`);
     }
}, */

/* addWorkers: async(data) =>{
  const { org_id, admin_id,category_id, company_id, app_id, name,mobileno,loginName,password,role, destination,aadhar,email,address,active } = data
  console.log(data)
  try {
    const org = await organizationModel.findById(org_id)
    if(!org) return ('organization not found')
      const admin = await adminRegisterModel.findById(admin_id)
    if(!admin) return ('admin not found')
      const comp = await Company.findById(company_id)
    if(!comp) return ('company not found')

      const userRole = await Role.findOne({roleList:role})
      

      const hashedPassword = await bcrypt.hash(password, 10);

      const worker = await WorkersModel.create({
        org_id, admin_id, category_id, company_id, app_id, name, mobileno, loginName, password:hashedPassword , role:userRole.roleList , destination, aadhar, email, address, active
      })
      console.log(worker)
      return worker
  } catch (error) {
    throw new Error(`Failed to add workers: ${error.message}`);
  }
}, */


};

export default commonService;
