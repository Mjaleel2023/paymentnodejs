const express = require('express');
const stripe = require('stripe')('sk_test_51OA9IySFi52b2GGyPITKclfzToTktxuhubge8guDiIxLVMkJZ4hqbsfnx8Y7TXmPvd53KKxX3RTfeidoWEUY3uBk00B2OcBN6m'); // Replace with your Stripe secret key
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  // Serve the new.html file for the root path
  res.sendFile(__dirname + '/new.html');
});

app.post('/process-payment', async (req, res) => {
  try {
    const paymentMethod = req.body.paymentMethod;
    if (!paymentMethod) {
      throw new Error('Payment Method is missing.');
    }
    
    const intent = await stripe.paymentIntents.create({
      payment_method: paymentMethod,
      amount: 1000, // Amount in cents
      currency: 'usd', // Change to your preferred currency
      description: 'Example Payment',
    });
    
    // Include the transaction ID (Payment Intent ID) in the response
    res.json({ success: true, transactionId: intent.id });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
