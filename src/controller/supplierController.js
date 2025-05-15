import supplierService from "../service/supplierService.js"

const supplierController = {

    addSupplier : async (req, res) =>{
    
      try {
        const newSupplier = await supplierService.addSupplier(req.body)
        return res.status(200).json({message:"add supplier success!",newSupplier})
      } catch (error) {
        error.statusCode = 400;
        error.error = error.message;
        console.error(error);
        error.statuscode = 400;
        next(error);
      }
    },

    addUpdateSupplier : async(req, res, next)=>{
      try {
        const supplier = await supplierService.addUpdateSupplier(req.body)
        return res.status(200).json({message:"success !!", supplier})
      } catch (error) {
        error.statusCode = 400;
        error.error = error.message;
        console.error(error);
        error.statuscode = 400;
        next(error);
      }
    }
}

export default supplierController