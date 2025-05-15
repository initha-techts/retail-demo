import bcrypt from "bcrypt"


import adminRegisterModel from "../model/adminRegister.js"
import Company from "../model/company.js"
import organizationModel from "../model/organizationModel.js"
import Role from "../model/Role.js"
import UserModel from "../model/users.js"

const userService = {

    addUpdateRole : async(data) =>{
      const {org_id, admin_id, store_id, role_id, roleList, roleName}=data
      console.log(data)
      try {
        const roleData = { roleName, roleList }

        const org = await organizationModel.findById(org_id)
        if(!org) {
          throw {  status: 400, message: "Org not found." }
        }
          const admin = await adminRegisterModel.findById(admin_id)
        if(!admin) {
          throw { status: 400, message: "admin not found." }
        }
          const comp = await Company.findById(store_id)
        if(!comp){
          throw { status: 400, message: "Store not found." }
        }

        if(role_id){
          const roleID = await Role.findById(role_id)
          if(!roleID){
            throw {status: 400, message:"role id not found"}
          }
          const updateRole = await Role.findByIdAndUpdate(role_id, roleData, { new: true, runValidators: true } )
          console.log(updateRole)
          return updateRole
        }else{
          const newRole = await Role.create({
            org_id, admin_id, store_id, roleList, roleName
          })
          console.log(newRole)
          return newRole
        }
        
      } catch (error) {
        console.error("Error in addUser:", error);
        throw { status: error.status || 500, message: error.message || "Internal Server Error" };
      }
    },


    getRole : async(data)=>{
      const {store_id} = data
      try {
        const allRole = await Role.find({store_id})
        return allRole
      } catch (error) {
        console.error("Error in addUser:", error);
        throw { status: error.status || 500, message: error.message || "Internal Server Error" };
      }
    },
    
   /*  updateRole : async(data) =>{
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
        
        }, */
    
    deleteRole: async(data) =>{
      const {admin_id, store_id, role_id} = data
      try {
        if(!admin_id || !store_id || !role_id){
          throw {
              status: 400, message:"both id are required"
          }
      }
      const admin = await adminRegisterModel.findById(admin_id)
      if(!admin){
          throw{ status: 400, message:"admin not found" }
      }

      const store = await Company.findById(store_id)
      if(!store){
          throw{status: 400, message:"store not found"}
      }

      const role = await Role.findOne({ _id: role_id, admin_id, store_id });
      if (!role) {
          throw {
              status: 404,
              message: "role not found or does not belong to the specified admin/store",
          };
      }

      const deleteRole = await Role.findByIdAndDelete(role_id)
      if (!deleteRole) {
          throw { status: 404, message: "role not found or not authorized to delete" };
        }
    
      return {message:"role delete successfull !!", deleteRole}
    
    } catch (error) {
      console.error("Error in delete Role:", error);
      throw { status: error.status || 500, message: error.message || "Internal Server Error" };
    }
    },

    addUpdateUsers: async(data) =>{
      const { org_id, admin_id,category_id, store_id, app_id, user_id, name,mobileno,loginName,password,role, destination,aadhar,email,address,active } = data
      console.log(data)
      try {
        const userData = { name, mobileno, loginName, password, role, destination, aadhar, email, address, active }
        const org = await organizationModel.findById(org_id)
        if(!org) {
          throw {  status: 400, message: "Org not found." }
        }
          const admin = await adminRegisterModel.findById(admin_id)
        if(!admin) {
          throw { status: 400, message: "admin not found." }
        }
          const comp = await Company.findById(store_id)
        if(!comp){
          throw { status: 400, message: "Store not found." }
        }

        if(user_id){
          const userId = await UserModel.findById(user_id)
          if(!userId){
            throw {status: 400, message:"user id not found"}
          }
          const updateUser = await UserModel.findByIdAndUpdate(user_id, userData, { new: true, runValidators: true } )
          console.log(updateUser)
          return updateUser
        }else{
          const hashedPassword = await bcrypt.hash(password, 10)
          const newUser = await UserModel.create( {org_id, admin_id,category_id, store_id, app_id, name, mobileno, loginName, password: hashedPassword, role, destination, aadhar, email, address, active} )
          console.log(newUser)
          return newUser
        }
      } catch (error) {
        console.error("Error in addUser:", error);
        throw { status: error.status || 500, message: error.message || "Internal Server Error" };
      }
    },

}

export default userService