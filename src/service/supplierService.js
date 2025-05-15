import adminRegisterModel from "../model/adminRegister.js"
import SupplierModel from "../model/supplier.js"


const supplierService = {

    addSupplier : async (data) =>{
         const {admin_id, store_id, firm_name, gstin, phone, email, address, active} = data
    
         try {
          if(!admin_id || ! store_id ){
            throw{ status:400, message:"both id are required"}
          }
          
            const admin = await adminRegisterModel.findById(admin_id)
            if(!admin) {
              throw { status:401, error:"admin not found"}
            }
    
              const supplier = await SupplierModel.create({
                admin_id,
                store_id,
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
          console.error("Error in adding:", error);
          throw {
            status: error.status || 500,
            message: error.message || "Internal Server Error",
         }
        }
    },


    addUpdateSupplier: async(data)=>{
      const {admin_id, store_id, supplier_id, firm_name, gstin, phone, email, address, active} = data
    
      try {
        const suppData = { firm_name, gstin, phone, email, address, active }
      
              if(supplier_id){
                const existSupp = await SupplierModel.findById(supplier_id)
                if(existSupp){
                  const updatesupp = await SupplierModel.findByIdAndUpdate(supplier_id, suppData, { new: true, runValidators: true })
                  console.log(updatesupp)
                  return updatesupp
                }else {
                  throw {
                    status: 400,
                    message: `Product with ID ${supplier_id} not found`
                  };
                }
              }else{
                const newProd = await SupplierModel.create({admin_id, store_id, firm_name, gstin, phone, email, address, active })
                console.log(newProd)
                return newProd
              }
      } catch (error) {
        console.error("Error in adding:", error);
        throw {
          status: error.status || 500,
          message: error.message || "Internal Server Error",
      }
    }
  }, 

}

export default supplierService