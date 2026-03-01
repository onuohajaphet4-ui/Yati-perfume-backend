import axios from "axios";

export const initializePayment = async (req, res) => {
  try {
    const { email, cartItems, delivery } = req.body;
    const userId = req.user.id
    let total = 0;
    cartItems.forEach(item => {
      total += item.productId.price * item.quantity;
    });

    const tax = total * 0.05;
    const deliveryFee = 5000;
    total = total + tax + deliveryFee;

    const amountInKobo = Math.round(total * 100);

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: email,
        amount: amountInKobo,
        callback_url: "http://localhost:5173/payment-success",

        metadata: {
        userId,
        email,
        cartItems:JSON.stringify(cartItems),
        delivery: JSON.stringify(delivery)
       }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("AUTH HEADER:", req.headers.authorization);

    res.json({
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference
    });

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ message: "Payment initialization failed" });
  }
};



export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
     const userId = req.user.id

    console.log("VERIFYING:", reference);

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
        },
        timeout: 10000, // 10s max wait
      }
    );

    console.log("PAYSTACK RESPONSE RECEIVED");

    const data = response.data.data;

    if (data.status === "success") {
      return res.json({
        success: true,
        userId,
        email: data.customer.email,
        cartItems: JSON.parse(data.metadata.cartItems),
        delivery: JSON.parse(data.metadata.delivery)
      });
    }

    return res.json({ success: false });
  } catch (err) {
    console.log("VERIFY ERROR:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};