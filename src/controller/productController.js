import productService from "../service/productService.js";

const productController = {

    addUpdateProduct: async(req, res, next)=>{
        try {

            const product = await productService.addUpdateProduct(req.body)
            return res.status(200).json({message:"add product success!!", product})
            
        } catch (error) {
            error.statusCode = 400;
            error.error = error.message;
            console.error(error);
            error.statuscode = 400;
            next(error);
        }
    },

    getAllProduct: async(req, res, next)=>{
        try {
            const allProducts = await productService.getAllProduct(req.params)
            return res.status(200).json({message:"all products data", allProducts})
            
        } catch (error) {
            error.statusCode = 400;
            error.error = error.message;
            console.error(error);
            error.statuscode = 400;
            next(error);
        }
    },

    getProduct: async(req, res, next)=>{
        try {
            const prod = await productService.getProduct(req.params)
            return res.status(200).json({message:"product data", prod})
        } catch (error) {
            error.statusCode = 400;
            error.error = error.message;
            console.error(error);
            error.statuscode = 400;
            next(error);
        }
    },

    deleteProduct: async(req, res, next)=>{
        try {
            const del_Prod = await productService.deleteProduct(req.body)
            return res.status(200).json({message:"product data", del_Prod})
        } catch (error) {
            error.statusCode = 400;
            error.error = error.message;
            console.error(error);
            error.statuscode = 400;
            next(error);
        }
    },

    search_prod: async(req, res, next)=>{
        try {
            const keyword = req.query.q;
            const products = await productService.search_prod(keyword);
            return res.json(products);
        } catch (error) {
            error.statusCode = 400;
            error.error = error.message;
            console.error(error);
            error.statuscode = 400;
            next(error);
        }
    }

}

export default productController