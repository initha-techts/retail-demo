import dashBoardService from "../service/dashBoardService.js";

const dashBoardController ={

    getExpiring: async(req, res)=>{
        try {
            const result = await dashBoardService.getExpiring();

            res.status(200).json({
              success: true,
              expiringSoon: result.expiringSoon,
              expired: result.expired
            });
        } catch (error) {
            console.error("Error in get:", error);
          res.status(500).json({ success: false, message: "Server Error" });
        }
    },

    getLowStock: async (req, res) => {
        try {
          const lowStock = await dashBoardService.getLowStock(req.params);
      
          res.status(200).json({
            success: true,
            count: lowStock.length,
            data: lowStock
          });
        } catch (error) {
          console.error("Error in get:", error);
          res.status(500).json({ success: false, message: "Server Error" });
        }
      },

    getOutOfStock: async (req, res) => {
        try {
          const outOfStockItems = await dashBoardService.getOutOfStock(req.params);
      
          res.status(200).json({
            success: true,
            count: outOfStockItems.length,
            data: outOfStockItems
          });
        } catch (error) {
          console.error("Error in get:", error);
          res.status(500).json({ success: false, message: "Server Error" });
        }
      }

}

export default dashBoardController