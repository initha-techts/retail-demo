import moment from "moment";
import productModel from "../model/product.js";


const dashBoardService ={

    getExpiring: async()=>{
        try {
            const today = moment().startOf("day");
            const nextWeek = moment().add(7, "days").endOf("day");
        
            const allItems = await productModel.find({ active: true });
        
            const expiringSoon = [];
            const alreadyExpired = [];
        
            allItems.forEach(item => {
              if (item.expiry_date) {
                const expiry = moment(item.expiry_alert, "YYYY-MM-DD");
                
                if (expiry.isBefore(today)) {
                  alreadyExpired.push({ name: item.prod_name, expiry_date: item.expiry_alert });
                } else if (expiry.isBetween(today, nextWeek, undefined, "[]")) {
                  expiringSoon.push({ name: item.prod_name, expiry_date: item.expiry_alert });
                }
              }
            });
        
            return {
              expiringSoon: {
                count: expiringSoon.length,
                items: expiringSoon
              },
              expired: {
                count: alreadyExpired.length,
                items: alreadyExpired
              }
            };
        } catch (error) {
            console.error("Error in finding:", error);
            throw {
              status: error.status || 500,
              message: error.message || "Internal Server Error",
           }
        }

    },

    getLowStock: async(data)=>{
        const {store_id} = data
        console.log(data)
        try {
          const allItems = await productModel.find({ active: true, store_id });

          const lowStockItems = allItems
            .filter(item => item.total_stock <= item.low_stock && item.total_stock > 0)
            .map(item => ({
              name: item.prod_name,
              item_quantity: item.total_stock
            }));
      
          return {
            count: lowStockItems.length,
            items: lowStockItems
          };
        } catch (error) {
            console.error("Error in finding:", error);
            throw {
              status: error.status || 500,
              message: error.message || "Internal Server Error",
           }
        }
    },

    getOutOfStock: async (data)=>{
        const {store_id} = data
        console.log(data)
        try {
            const allItems = await productModel.find({ active: true, store_id });

            const outOfStockItems = allItems
              .map(item => {
                if (item.total_stock === 0) {
                  return {itmeName : item.prod_name};
                }
                return null;
              })
              .filter(item => item !== null);
          
            return outOfStockItems ;
        } catch (error) {
            console.error("Error in finding:", error);
            throw {
              status: error.status || 500,
              message: error.message || "Internal Server Error",
           }
        }

    },

}

export default dashBoardService