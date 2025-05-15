import userService from "../service/userService.js"

const userController= {

    addUpdateRole :async(req, res, next) =>{
      try {
        const addRole = await userService.addUpdateRole(req.body);
      
        res.status(200).json(addRole);
      } catch (error) {
        error.statusCode = 400;
        error.error = error.message;
        console.error(error);
        error.statuscode = 400;
        next(error);
      }
    },

    getRole : async (req, res, next) =>{
      try {
        const roles = await userService.getRole(req.params)
        res.status(200).json(roles)
      } catch (error) {
        error.statusCode = 400;
        error.error = error.message;
        console.error(error);
        error.statuscode = 400;
        next(error);
      }
    },
    
    // updateRole:async (req, res)=>{
    
    //   try {
    //     const updateRoll = await userService.updateRole(req.body)
    //     return res.status(200).json(updateRoll);
        
    //   } catch (error) {
    //     res.status(500).json({ message: error.message });
    //   }
    // },
    
    deleteRole :async (req, res)=>{
      try {
        const delRole = await userService.deleteRole(req.params)
        return res.status(200).json(delRole);
        
      } catch (error) {
        console.error("Error deleting role", error.message);
        error.statusCode = 400;
        error.error = error.message;
        console.error(error);
        error.statuscode = 400;
        next(error);
      }
    
    },
    addUpdateUsers: async(req, res, next) =>{

       try {
          const newWorker = await userService.addUpdateUsers(req.body)
          return res.status(200).json({message:"add workers success!!", newWorker})
        } catch (error) {
          console.error("Error fetching posts:", error.message);
          error.statusCode = 400;
          error.error = error.message;
          console.error(error);
          error.statuscode = 400;
          next(error);
        }
    }

}

export default userController