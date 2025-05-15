import mongoose from "../db/db.js";
const categorySchema  =new mongoose.Schema({

    org_id: {
        type:String,
        required:false 
    },
    admin_id: {
        type:String,
        required:false 
    },
    company_id: {
        type:String,
        required:true 
    },
    categoryName: { 
        type: String, 
        required: true 
    },
    categoryCode: { 
        type: String, 
        required: true 
    },
    dept_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "department",
      },
    departmentName: { 
        type: String, 
        required: true ,
        ref: "department" 
    },
    categoryLogo:{
        type: String, 
        required: false 
    },
    timestamp: { type: Date, default: Date.now },
},{ versionKey: false });

categorySchema.virtual('category_id').get(function(){
    return this._id.toString();
  })

const Category = mongoose.model("category", categorySchema )

export default Category