import Company from "../model/company.js";
import adminRegisterModel from "../model/adminRegister.js";
import organizationModel from "../model/organizationModel.js";

import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

const storeService ={

  importExcelData : async (filePath, admin_id) => {
    try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
      for (const entry of jsonData) {
        const filter = { store_name: entry.Store_Name, admin_id };
        const update = {
          phoneNumber: entry.Phone_No,
          email: entry.Email,
          address: entry.Address,
          city: entry.City,
          state: entry.State,
          pincode: entry.Pincode,
          country: entry.Country,
          pan_no: entry.PAN_No,
          gstin: entry.GSTIN,
          tax_method: entry.Taxation_Method,
          currency: entry.Currency,
          admin_id,
        };
        await Company.findOneAndUpdate(filter, update, { upsert: true, new: true });
      }
  
      fs.unlinkSync(filePath); // Delete file after processing
      return { message: "Excel data imported successfully!" };
    } catch (error) {
      console.error("Service error:", error);
      throw new Error("Failed to import Excel data");
    }
  },

  addUpdateStore: async(data) =>{
    const { 
      admin_id, org_id,store_id,
      store_name, phoneNumber, email, address,  city, state,
      pincode,  country, pan_no, gstin, tax_method, currency, storeLogo } = data;
      try {

        const storeData = { 
          admin_id, org_id,
          store_name, phoneNumber, email, address,  city, state,
          pincode,  country, pan_no, gstin, tax_method, currency, storeLogo }

        if(store_id){
          const existStore = await Company.findById(store_id)
          if(existStore){
            const updateStore = await Company.findByIdAndUpdate(store_id, storeData, { new: true, runValidators: true })
            console.log(updateStore)
            return updateStore
          }else{
            throw{status:400, message:"store not found"}
          }
        }else{
          const newStore = await Company.create(storeData)
          console.log(newStore)
          return newStore
        }
      } catch (error) {
        console.error("Error in adding:", error);
        throw {
          status: error.status || 500,
          message: error.message || "Internal Server Error",
      }
      }
  },

    addStore: async (data) => {
      const { 
        admin_id, org_id,
        store_name, phoneNumber, email, address,  city, state,
        pincode,  country, pan_no, gstin, tax_method, currency, storeLogo } = data;
           
     console.log("Received Data:", data);
      try {
          // if(!admin_id || !org_id) return('both fields are required')
          // const admin = await adminRegisterModel.findById(admin_id)
          // if(!admin) {return ('admin not found')}
      
          //   const org = await organizationModel.findById(org_id)
          //   if(!org) {return ('org not found')}
    
    
          const company = await Company.create({
            admin_id, org_id,
            store_name, phoneNumber, email, address, city, state, pincode,
            country, pan_no, gstin, tax_method, currency, storeLogo 
          });
    
          console.log("Company Created:", company);
          return company;
    
      } catch (error) {
        console.error("Error in adding:", error);
        throw {
          status: error.status || 500,
          message: error.message || "Internal Server Error",
      }
      }
    },
    
    generateExcel: async (data) => {
      const { admin_id } = data;
      try {
        const companies = await Company.find({ admin_id });
    
        if (!companies.length) {
          throw { status: 404, message: "No companies found for this admin." };
        }
    
        const data = companies.map(company => ({
          Store_Name: company.store_name,
          Phone_No: company.phoneNumber,
          Email: company.email,
          Address: company.address,
          City: company.city,
          State: company.state,
          Pincode: company.pincode,
          Country: company.country,
          PAN_No: company.pan_no,
          GSTIN: company.gstin,
          Taxation_Method: company.tax_method,
          Currency: company.currency,
        }));
    
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Stores');
    
        const dirPath = path.resolve('public');
        const fileName = `Store_data_${Date.now()}.xlsx`;
        const filePath = path.join(dirPath, fileName);
    
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
    
        xlsx.writeFile(workbook, filePath);
    
        return filePath; // ✅ correct to return only path if you're hardcoding name in controller
      } catch (error) {
        console.error("Error in generateExcel:", error);
        throw {
          status: error.status || 500,
          message: error.message || "Failed to generate Excel file.",
        };
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
    
    getStore: async (data) => {
    const {admin_id} = data
      try {
          const company = await Company.find({admin_id});
          return company;
      } catch (error) {
        console.error("Error in adding:", error);
        throw {
          status: error.status || 500,
          message: error.message || "Internal Server Error",
      }
      }
    },
    
    updateStore: async (data) => {
      const {
        admin_id, org_id, store_id,
        store_name, phoneNumber, email, address,  city, state,
        pincode,  country, pan_no, gstin, tax_method, currency, storeLogo
      } = data;
    
      console.log("Company ID:", store_id, data);
    
      try {
        if(!admin_id || !org_id) return('admin org fields are required')
          const admin = await adminRegisterModel.findById(admin_id)
          if(!admin){
            throw{status:400, message:"admin not found"}
          }
      
            const org = await organizationModel.findById(org_id)
            if(!org){
              throw { status:400, message:"org not found"}
            }
    
        if (!store_id) {
          console.log("Company ID not found");
         throw{ status:400, message:"store not found"}
        }
    
        const existingCompany = await Company.findById(store_id);
        if (!existingCompany) {
         throw{status:400, message:"store not found"}
        }
    
        let updateData = {
            store_name, phoneNumber, email, address,  city, state,
            pincode,  country, pan_no, gstin, tax_method, currency, storeLogo, 
        };
    
        const updatedCompany = await Company.findByIdAndUpdate(
            store_id,
          updateData,
          { new: true, runValidators: true }
        );
    
        return updatedCompany;
      } catch (error) {
        console.error("Error in update:", error);
        throw {
          status: error.status || 500,
          message: error.message || "Internal Server Error",
      }
      }
    },
    
    deleteStore: async ({ admin_id, org_id, store_id }) => {
        try {
            if (!admin_id || !org_id) {
                throw{ status:400, message:"both id required"}
            }
    
            const admin = await adminRegisterModel.findById(admin_id);
            if (!admin) {
              throw{ status:400, message:"admin not found"}
            }
    
            const org = await organizationModel.findById(org_id);
            if (!org) {
              throw{ status:400, message:"org not found"}
            }
    
            if (!store_id) {
              throw{ status:400, message:"store id required"}
            }
    
            const company = await Company.findById(store_id);
            if (!company) {
              throw{ status:400, message:"store not found"}
            }
    
           const deleteStore =  await Company.findByIdAndDelete(store_id);
    
            return { message: "Store deleted successfully", deleteStore };
    
        } catch (error) {
          console.error("Error in adding:", error);
          throw {
            status: error.status || 500,
            message: error.message || "Internal Server Error",
        }
        }
    }
    
}

export default storeService