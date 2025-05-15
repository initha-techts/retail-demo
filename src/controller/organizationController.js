// import demoCart from "../demoModel";
// import organizationModel from "../model/organizationModel.js";
import OrganizationService from "../service/organizationService.js";


const OrganizationController = {
    createApp: async (req, res) => {
        try {
            const createdApp = await OrganizationService.createApp(req.body)
            res.status(200).json({
                data: createdApp
            });
        } catch (error) {
            res.status(500).json({ messsage: error.message})
        }

    },

    createMainCategory: async (req, res) => {
        try {
            const createCategory = await OrganizationService.createMainCategory(req.body)
            res.status(200).json({
                data: createCategory
            });
        } catch (error) {
            res.status(500).json({ messsage: error.message})
        }

    },
    adminReg: async (req, res) => {
        try {
            const register = await OrganizationService.adminReg(req.body)
            console.log(register)
            if (register ?.error) {
                return res.status(400).json({ success: false, message: result.error });
            }
            res.status(200).json({
                message: "registered successfully",
                data: register
            });
        } catch (error) {
            res.status(500).json({ messsage: error.message})
        }

    },
    Login: async(req, res, next)=>{
        try {
            const login = await OrganizationService.Login(req.body)
           
            return res.status(200).json({
                data: login
            });
        } catch (error) {
            error.error = error.message;
            console.error(error);
            error.statuscode = 400;
            next(error);
        }
    },


    demoAddCart:async (req, res) =>{
    try {
      
      const cart = await OrganizationService.demoAddCart(req.body)
      res.status(200).json(cart)
    } catch (error) {
      res.status(500).json({ messsage: error.message})
    }
  },
  demoDelCart: async (req, res) =>{
    try {
        const dcart = await OrganizationService.demoDelCart(req.body)
        return res.status(200).json(dcart)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
  },

  order: async (req, res) =>{
    try {
        const ord = await OrganizationService.order(req.body)
        res.status(200).json(ord)
    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
  }

}

export default OrganizationController