import Invoice from "../demoModel/invoice.js";
import customerModel from "../model/customer.js";
import productModel from "../model/product.js";

const billingService ={
    createInvoice : async (data) => {
        const { payment_method, customer, orderItems } = data;
      
        try {
          if (!orderItems || orderItems.length === 0) {
            return { message: "Order items are empty" };
          }
      
          let totalAmount = 0;
          let totalTax = 0;
          let formattedItems = [];
      
          for (const orderItem of orderItems) {
            const item = await productModel.findById(orderItem.prod_id);
            if (!item) {
              return { message: `Item with ID ${orderItem.prod_id} not found` };
            }
      
            const itemTotalPrice = orderItem.price * orderItem.quantity;
            const itemTotalTax = orderItem.total_tax_Amount;
      
            totalAmount += itemTotalPrice;
            totalTax += itemTotalTax;
      
            formattedItems.push({
              product: item.name,
              quantity: orderItem.quantity,
              uom: item.uom,
              discount: orderItem.discount,
              salePrice: orderItem.price,
              amount: itemTotalPrice,
              cgst: orderItem.cgst,
              sgst: orderItem.sgst,
            });
          }
      
          // Create or find customer
          let customerData = null;
          if (customer?.phoneno) {
            const existingCustomer = await customerModel.findOne({ phoneno: customer.phoneno });
            if (!existingCustomer) {
              customerData = await customerModel.create({
                name: customer.name,
                phoneno: customer.phoneno,
                email: customer.email || "",
              });
            } else {
              customerData = existingCustomer;
            }
          }
      
          const invoice = new Invoice({
            invoiceType: "Sale",
            invoiceNo: `INV-${Date.now()}`,
            date: new Date(),
            soldBy: "Admin",
            customerName: customerData?.name || customer?.name,
            mobileNo: customerData?.phoneno || customer?.phoneno,
            products: formattedItems,
            totalQty: orderItems.reduce((sum, item) => sum + item.quantity, 0),
            discountAmount: orderItems.reduce((sum, item) => sum + item.discount, 0),
            roundOff: 0,
            cgstAmount: totalTax / 2,
            sgstAmount: totalTax / 2,
            totalTaxableValue: totalAmount,
            totalAmount,
            paymentMethod: payment_method,
            loyaltyPointsUsed: 0,
          });
      
          await invoice.save();
      
          return {
            message: "Invoice created successfully",
            invoice
          };
        } catch (error) {
          return { message: `Invoice creation failed: ${error.message}` };
        }
      }
}

export default billingService