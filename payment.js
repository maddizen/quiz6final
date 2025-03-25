const paypal = require('paypal-rest-sdk');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

// Route to create payment for an order
router.post('/pay/:orderId', async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('items.product');
  const items = order.items.map(item => ({
    name: item.product.name,
    sku: item.product._id,
    price: item.product.price,
    quantity: item.quantity
  }));

  const paymentJson = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: 'http://localhost:3000/payment/success',
      cancel_url: 'http://localhost:3000/payment/cancel'
    },
    transactions: [{
      item_list: {
        items: items
      },
      amount: {
        currency: 'USD',
        total: order.total.toString()
      },
      description: 'Transaction description here'
    }]
  };

  paypal.payment.create(paymentJson, async (error, payment) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Error during payment creation.');
    } else {
      // On successful payment creation, store the transaction
      const transaction = new Transaction({
        order: order._id,
        transactionId: payment.id,
        amount: order.total,
        currency: 'USD',
        description: order.items.map(item => item.product.name).join(', '),
        buyer: order.buyer
      });
      await transaction.save();
      res.redirect(payment.links[1].href); // Redirect to PayPal payment page
    }
  });
});
