document.addEventListener("DOMContentLoaded", function() {
  const stripe = Stripe('pk_test_51OA9IySFi52b2GGy0oWZprDnFqQ9pUSvVRBLWYMnuejQzVdLnbKqACz49YUla0fHrjPKZK9JzI3xdo3xywFatCNx00QQCMEwwl'); // Replace with your Stripe publishable key
  const elements = stripe.elements();
  const cardElement = elements.create('card');
  cardElement.mount('#card-element');
  const form = document.getElementById('payment-form');
  const errorElement = document.getElementById('card-errors');
  const paymentResult = document.getElementById('payment-result');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // Create a Payment Method from the card element
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    if (error) {
      errorElement.textContent = error.message;
      paymentResult.textContent = 'Payment failed';
    } else {
      // Send the paymentMethod.id to your server for payment processing
      fetch('/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethod: paymentMethod.id }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            paymentResult.textContent = 'Payment successful';
          } else {
            paymentResult.textContent = 'Payment failed: ' + data.error;
          }
        })
        .catch(error => {
          console.error('Error processing payment:', error);
          paymentResult.textContent = 'Payment failed';
        });
    }
  });
});
