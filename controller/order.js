import Order from "../model/order.js";
import {cart} from "../model/cart.js";
import axios from "axios";
import {product} from '../model/product.js'

export const createOrder = async (req, res) => {
  try {
   const { reference } = req.body;
   const userId = req.user.id

if (!reference) {
  return res.status(400).json({ message: "Reference required" });
}

const verify = await axios.get(
  `https://api.paystack.co/transaction/verify/${reference}`,
  {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
    },
  }
);

const paymentData = verify.data.data;

if (paymentData.status !== "success") {
  return res.status(400).json({ message: "Payment not verified" });
}

    const metadata = paymentData.metadata;
    
    console.log("User id from meta", req.user.id)
 
    const cartItems = await cart.find({ userId:req.user.id }).populate("productId");
    console.log("cart:", cartItems )
    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart empty after payment" });
    }

    const items = cartItems.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price
    }));

    const delivery = JSON.parse(metadata.delivery || "{}");

    const order = await Order.create({
      userId,
      email: paymentData.customer.email,
      items,
      delivery,
      totalAmount: paymentData.amount / 100,
      paymentReference: reference
    });

    console.log("FULL PAYMENT DATA:", paymentData);
    console.log("METADATA:", paymentData.metadata);
    
    for (const item of order.items) {
  await product.findByIdAndUpdate(
    item.productId,
    { $inc: { totalSold: item.quantity } }
  );

  await cart.deleteMany({ userId: req.user.id });
}

    res.json({ success: true, order });
    

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Order creation failed" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.productId").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteOrder  = async (req, res) => {
       try {
           const id = req.params.id
           const orders = await Order.findByIdAndDelete(id)
           if(!orders) return res.status(400).json({message: 'Order do not exist'}) 
           res.status(201).json({ success:true,
        message: 'Order deleted successful'})
           
             
       } catch (error) {
           res.status(500).json({ success:false,message:"Sever Error", error})
       }
}

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id,  }).populate("items.productId")

   res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["paid", "processing", "shipped", "delivered"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

