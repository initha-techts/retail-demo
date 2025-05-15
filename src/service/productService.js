import adminRegisterModel from "../model/adminRegister.js"
import Company from "../model/company.js"
import productModel from "../model/product.js"

const productService ={

    addUpdateProduct: async (data)=>{
        const {org_id, admin_id,  store_id, prod_id,
        category, brand, prod_code, barcode, prod_name, uom, total_stock, low_stock, expiry_alert, purchase_price,
        sale_price, MRP, cgst, sgst, igst, discount, prod_image, active } = data
        try {

             const prodData = { 
                category, brand, prod_code, barcode, prod_name, uom, total_stock, low_stock, expiry_alert, purchase_price,
                sale_price, MRP, cgst, sgst, igst, discount, prod_image, active }
            
                    if(prod_id){
                      const existProd = await productModel.findById(prod_id)
                      if(existProd){
                        const updateProd = await productModel.findByIdAndUpdate(prod_id, prodData, { new: true, runValidators: true })
                        console.log(updateProd)
                        return updateProd
                      }else {
                        throw {
                          status: 400,
                          message: `Product with ID ${prod_id} not found`
                        };
                      }
                    }else{
                      const newProd = await productModel.create({org_id, admin_id,  store_id,
                        category, brand, prod_code, barcode, prod_name, uom, total_stock, low_stock, expiry_alert, purchase_price,
                        sale_price, MRP, cgst, sgst, igst, discount, prod_image, active })
                      console.log(newProd)
                      return newProd
                    }
            
        } catch (error) {
            console.error("Error in addProduct:", error);
            throw { status: error.status || 500, message: error.message || "Internal Server Error" };
        }

        
    },

    getAllProduct : async (data)=>{
        const {store_id, admin_id} = data
        try {
            const product = await productModel.findOne({ admin_id, store_id });
            if (!product) {
                throw {
                    status: 404,
                    message: "Product not found or does not belong to the specified admin/store",
                };
            }
            const products = await productModel.find({store_id, admin_id})
            console.log(products)
            return products
        } catch (error) {
            console.error("Error in get products:", error);
            throw { status: error.status || 500, message: error.message || "Internal Server Error" };
        }
    },

    getProduct : async(data)=>{
        const {prod_id} = data
        try {
            const product = await productModel.findById(prod_id)
            return product
        } catch (error) {
            console.error("Error in get product:", error);
            throw { status: error.status || 500, message: error.message || "Internal Server Error" };
        }
    },

    deleteProduct : async(data)=>{
        const { admin_id, store_id, prod_id } = data
        console.log(data)
        try {
            if(!admin_id || !store_id || !prod_id){
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

            const product = await productModel.findOne({ _id: prod_id, admin_id, store_id });
            if (!product) {
                throw {
                    status: 404,
                    message: "Product not found or does not belong to the specified admin/store",
                };
            }

            const deleteProd = await productModel.findByIdAndDelete(prod_id)
            if (!deleteProd) {
                throw { status: 404, message: "Product not found or not authorized to delete" };
              }
          
            return {message:"product delete successfull !!", deleteProd}
        } catch (error) {
            console.error("Error in delete product:", error);
            throw { status: error.status || 500, message: error.message || "Internal Server Error" };
        }
    },

    search_prod: async(keyword)=>{
        try {
            const search = await productModel.find({ prod_name: { $regex: keyword, $options: 'i' } });
            return search
        } catch (error) {
            console.error("Error in search:", error);
            throw { status: error.status || 500, message: error.message || "Internal Server Error" };
        }
    }


}

export default productService