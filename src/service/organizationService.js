import MaincategoryModel from "../model/MainCategoryTable.js";
import organizationModel from "../model/organizationModel.js";
import adminRegisterModel from "../model/adminRegister.js";
import appModel from "../model/appModel.js";
import bcrypt from "bcrypt";

import commonService from "./commonService.js";
// import itemModel from "../model/item.js";
import demoCart from "../demoModel/demoCart.js";
import Order from "../demoModel/order.js";
import customerModel from "../model/customer.js";

const OrganizationService = {
  createApp: async (data) => {
    const { admin_id, org_id, appLogo, mainCategory_id, app_category } = data;
    try {
      const createapp = await appModel.create({
        admin_id,
        org_id,
        appLogo,
        mainCategory_id,
        app_category,
      });
      console.log(createapp);
      return createapp;
    } catch (error) {
      throw error;
    }
  },

  createMainCategory: async (data) => {
    const { categoryName, price } = data;

    try {
      const createCategory = await MaincategoryModel.create({
        categoryName,
        price,
      });
      console.log("Successfully stored");
      return createCategory;
    } catch (error) {
      throw error;
    }
  },

  organization: async (category_id) => {
    try {
      const organization = await organizationModel.create({
        category_id,
        admin_id: 0,
      });

      console.log(organization, "Organization created successfully");
      return organization;
    } catch (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
  },

  updateOrganization: async (data) => {
    const { org_id, admin_id } = data;
    console.log(data, "dataa");
    try {
      const updateOrg = await organizationModel.findByIdAndUpdate(
        org_id,
        {
          admin_id: admin_id,
        },
        {
          new: true,
        }
      );
      console.log(updateOrg, "Organization updated with admin_id");
      return updateOrg;
    } catch (error) {
      throw error;
    }
  },

  adminReg: async (data) => {
    const { category_id, email, userName, password } = data;

    try {
      const admin = await adminRegisterModel.findOne({email})
      if(admin){return {error:"email already exists !!"}}
      else{
        const organization = await OrganizationService.organization(category_id);
        const register = await OrganizationService.registers({
          org_id: organization._id,
          category_id,
          email,
          userName,
          password,
        });
        console.log(register, "Registration created");
  
        const updateOrg = await OrganizationService.updateOrganization({
          org_id: organization._id,
          admin_id: register._id,
          userName,
          password,
        });
        // console.log(updateOrg, "Organization updated");
  
        return {
          organization,
          updateOrg,
          register,
        };
      }
      
    } catch (error) {
      throw error;
    }
  },

  registers: async (data) => {
    const { org_id, email, category_id, userName, password } = data;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const register = await adminRegisterModel.create({
        org_id,
        category_id,
        email,
        applogo_id: 0,
        userName,
        password: hashedPassword,
      });
      console.log(register, "Registration created");
      return register;
    } catch (error) {
      throw error;
    }
  },
  Login: async (data) => {
    const { email, password } = data;
    console.log("Login attempt with:", data);
  
    try {
      const admin = await adminRegisterModel.findOne({ email });
      if (!admin) {
        throw { status: 400, message: "Admin email not found" };
      }
  
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        throw { status: 404, message: "Invalid password" };
      }
  
      console.log("Admin login successful");
      return {
        success: true,
        role: "admin",
        data: {
          _id: admin._id,
          org_id: admin.org_id,
          category_id: admin.category_id,
          applogo_id: admin.applogo_id,
        },
      };
  
    } catch (error) {
      console.error("Error in login:", error);
      // Normalize the error
      throw {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      };
    }
  },
  
  
  
  

  //===================================================

  demoAddCart: async (data) => {
    const { item_id, quantity } = data;
    try {
      const item = await itemModel.findById(item_id);
      if (!item) {
        return { message: "Item not found" };
      }

      const {
        finalPrice,
        totalPriceForItem,
        cgstAmount,
        sgstAmount,
        igstAmount,
        cessAmount,
        totalTaxAmount,
        discountAmount,
      } = await commonService.calculatePrice(item, quantity);

      let cartItem = await demoCart.findOne({ item_id });

      if (cartItem) {
        cartItem.quantity += quantity;
        cartItem.total_price = cartItem.quantity * finalPrice;
        cartItem.cgst += cgstAmount;
        cartItem.sgst += sgstAmount;
        cartItem.igst += igstAmount;
        cartItem.cess += cessAmount;
        cartItem.total_tax_Amount += totalTaxAmount;
        cartItem.discount += discountAmount;
      } else {
        cartItem = new demoCart({
          item_id,
          quantity,
          price: finalPrice,
          total_price: totalPriceForItem,
          cgst: cgstAmount,
          sgst: sgstAmount,
          igst: igstAmount,
          cess: cessAmount,
          total_tax_Amount: totalTaxAmount,
          discount: discountAmount,
        });
      }

      item.quantity -= quantity;
      await item.save();
      await cartItem.save();
      console.log(cartItem);

      return { message: "Item added to cart", cartItem };
    } catch (error) {
      return { message: `Failed to add cart: ${error.message}` };
    }
    //   try {
    //     const item = await itemModel.findById(item_id);
    //     if (!item) return { message: 'Item not found' };

    //     const priceDetails = await commonService.calculatePrice(item, quantity);

    //     let cartItem = await demoCart.findOne({ item_id });

    //     if (cartItem) {
    //         cartItem.quantity += quantity;
    //         cartItem.total_price = cartItem.quantity * priceDetails.finalPrice;
    //         ['cgst', 'sgst', 'igst', 'cess', 'total_tax_Amount', 'discount'].forEach(key => {
    //             cartItem[key] += priceDetails[`${key}Amount`];
    //         });
    //     } else {
    //         cartItem = new demoCart({
    //             item_id,
    //             quantity,
    //             price: priceDetails.finalPrice,
    //             total_price: priceDetails.totalPriceForItem,
    //             ...Object.fromEntries(
    //                 ['cgst', 'sgst', 'igst', 'cess', 'total_tax_Amount', 'discount'].map(key => [key, priceDetails[`${key}Amount`]])
    //             )
    //         });
    //     }

    //     item.quantity -= quantity;
    //     await Promise.all([item.save(), cartItem.save()]);

    //     return { message: 'Item added to cart', cartItem };
    // } catch (error) {
    //     return { message: `Failed to add cart: ${error.message}` };
    // }
  },

  demoDelCart: async (data) => {
    const { dCart_id } = data;
    try {
      const dcart = await demoCart.findByIdAndDelete(dCart_id);
      return { message: "delete success" }, dcart;
    } catch (error) {
      return { message: `Failed to add cart: ${error.message}` };
    }
  },

 /*  order: async (data) => {
    const { payment_method } = data;
    try {
      const cartItems = await demoCart.find();
      if (!cartItems.length) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      let totalAmount = 0;
      let totalTax = 0;
      let orderItems = [];

      for (const cartItem of cartItems) {
        const item = await itemModel.findById(cartItem.item_id);
        if (!item) {
          return res
            .status(400)
            .json({ message: `Item with ID ${cartItem.item_id} not found` });
        }

        totalAmount += cartItem.total_price;
        totalTax += cartItem.total_tax_Amount;

        orderItems.push({
          item_id: cartItem.item_id,
          quantity: cartItem.quantity,
          price: cartItem.price,
          total_price: cartItem.total_price,
          cgst: cartItem.cgst,
          sgst: cartItem.sgst,
          igst: cartItem.igst,
          cess: cartItem.cess,
          total_tax_Amount: cartItem.total_tax_Amount,
          discount: cartItem.discount,
        });
      }

      const newOrder = new Order({
        items: orderItems,
        total_amount: totalAmount,
        total_tax: totalTax,
        payment_method,
        status: "Pending",
      });
      await newOrder.save();

      await demoCart.deleteMany();

      console.log(newOrder);
      return { message: "Order placed successfully", order: newOrder };
    } catch (error) {
      return { message: `Order failed: ${error.message}` };
    }
  }, */


order: async (data) => {
  const { payment_method, customer } = data;

  try {
    const cartItems = await demoCart.find();
    if (!cartItems.length) {
      return { message: "Cart is empty" };
    }

    let totalAmount = 0;
    let totalTax = 0;
    let orderItems = [];

    for (const cartItem of cartItems) {
      const item = await itemModel.findById(cartItem.item_id);
      if (!item) {
        return { message: `Item with ID ${cartItem.item_id} not found` };
      }

      totalAmount += cartItem.total_price;
      totalTax += cartItem.total_tax_Amount;

      orderItems.push({
        item_id: cartItem.item_id,
        quantity: cartItem.quantity,
        price: cartItem.price,
        total_price: cartItem.total_price,
        cgst: cartItem.cgst,
        sgst: cartItem.sgst,
        igst: cartItem.igst,
        cess: cartItem.cess,
        total_tax_Amount: cartItem.total_tax_Amount,
        discount: cartItem.discount,
      });
    }

    // 👤 Create new customer if data is passed
    let customerData = null;
    if (customer?.phoneno) {
      const existingCustomer = await customerModel.findOne({ phoneno: customer.phoneno });
      if (!existingCustomer) {
        customerData = await customerModel.create({
          name: customer.name,
          phoneno: customer.phoneno,
          email: customer.email || "", // optional
        });
      } else {
        customerData = existingCustomer;
      }
    }
    

    const newOrder = new Order({
      items: orderItems,
      total_amount: totalAmount,
      total_tax: totalTax,
      payment_method,
      status: "hold"
    });

    await newOrder.save();
    await demoCart.deleteMany();

    return { message: "Order placed successfully", order: newOrder };
  } catch (error) {
    return { message: `Order failed: ${error.message}` };
  }
},



};

export default OrganizationService;
