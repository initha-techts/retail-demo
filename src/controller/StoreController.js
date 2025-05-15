import storeService from "../service/StoreService.js";

const storeController ={

  importExcel : async (req, res) => {
    try {
      const { admin_id } = req.body;
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  
      const result = await storeService.importExcelData(req.file.path, admin_id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Controller error:", error);
      res.status(500).json({ message: error.message || "Import failed" });
    }
  },

    addUpdateStore: async(req, res) =>{
      try {
        const store = await storeService.addUpdateStore(req.body)
        res.json({ message:"success", store})
      } catch (error) {
        console.log("Error occurred:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

    },


    addStore: async (req, res) => {
        try {
    
          const newCompany = await storeService.addStore(req.body);
    
          return res
            .status(200)
            .json({ message: "Company added successfully!", newCompany });
        } catch (error) {
          console.log("Error occurred:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }
      },
    
      generateExcel: async (req, res) => {
        try {
          const filePath = await storeService.generateExcel({ admin_id: req.params.admin_id });
      
          res.download(filePath, "company_data.xlsx", (err) => {
            if (err) {
              console.error("Error downloading file:", err);
              res.status(500).send("Error downloading file");
            }
          });
        } catch (error) {
          console.error("Error generating Excel:", error);
          res.status(500).send(error.message || "Error generating Excel file");
        }
      },
      
    
    // generateExcel: async (req, res) => {
    //   try {
    //     const buffer = await storeService.generateExcel(req.params);
    //     res.setHeader("Content-Disposition", "attachment; filename=company_data.xlsx");
    //     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    //     res.send(buffer);
    // } catch (error) {
    //     res.status(500).send("Error generating Excel file");
    // }
    // },
    
    getStore: async (req, res) => {
        try {
          const allCompany = await storeService.getStore(req.params);
    
          if (!allCompany || allCompany.length === 0) {
            return res.status(404).json({ message: "No admin found" });
          }

          if (allCompany?.error) {
            return res.status(400).json({ success: false, message: result.error });
        }
    
          return res.status(200).json({ allCompany });
        } catch (error) {
          console.error("Error fetching books:", error);
          return res
            .status(500)
            .json({ error: "An error occurred while fetching books" });
        }
      },
    
      updateStore: async (req, res) => {
        try {
          const data = req.body;
      
          const result = await storeService.updateStore(data);
      
          if (result?.error) {
            return res.status(400).json({ success: false, message: result.error });
        }
          return res.status(200).json({
            data: result,
          });
        } catch (error) {
          console.error("Controller Error:", error);
          return res.status(500).json({ success: false, message: "Internal server error" });
        }
      },
    
      deleteStore: async (req, res) => {
        try {
            const result = await storeService.deleteStore(req.body);
    
            if (result?.error) {
                return res.status(400).json({ success: false, message: result.error });
            }
    
            return res.status(200).json({ success: true, message: result.message });
        } catch (error) {
            console.error("Controller Error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    


}

export default storeController