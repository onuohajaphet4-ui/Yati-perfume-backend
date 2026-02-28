export const paystackWebhook = async (req, res) => {
  try {
    const event = req.body;

    // Paystack sends this when payment is successful
    if (event.event === "charge.success") {

      const paymentData = event.data;

      console.log("PAYMENT SUCCESS");
      console.log("Reference:", paymentData.reference);
      console.log("Email:", paymentData.customer.email);
      console.log("Amount:", paymentData.amount / 100);

      // 🧠 Later: create order here

    }

    res.sendStatus(200);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};