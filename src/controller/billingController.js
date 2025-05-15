
import billingService from "../service/billingService.js";

const billingController ={

    createInvoice: async(req, res, next)=>{
        try {
            const invoice = await billingService.createInvoice(req.body)
            return res.status(200).json({message:"product data", invoice})
        } catch (error) {
            error.statusCode = 400;
            error.error = error.message;
            console.error(error);
            error.statuscode = 400;
            next(error);
        }
    }
}

export default billingController