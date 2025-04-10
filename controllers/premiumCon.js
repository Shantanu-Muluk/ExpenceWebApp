const { Cashfree } = require("cashfree-pg");
const db = require('../database/database');

Cashfree.XClientId = "TEST10550502d7c9fa09a15dbd9810e020505501"; // Replace with actual
Cashfree.XClientSecret = "cfsk_ma_test_c8afb7850a2562c205f9e46a5bef614d_a5152040"; // Replace with actual
Cashfree.XEnvironment = "SANDBOX"; // Or "PRODUCTION"

const createCashfreeOrderForPremium = async (req, res) => {
    try {
        const { amount, currency, customerEmail, customerName } = req.body;
        const userId = req.user.userId;
        const orderId = `PREMIUM_${userId}_${Date.now()}`;

        const request = {
            order_amount: amount,
            order_currency: currency,
            order_id: orderId,
            customer_details: {
                customer_id: userId.toString(),
                customer_email: customerEmail,
                customer_phone: req.user.phone || "9999999999",
                customer_name: customerName,
            },
            order_meta: {
                return_url: `${req.headers.origin}/premium/payment/success?order_id=${orderId}`,
                notify_url: `${req.headers.origin}/api/premium/cashfree-webhook`,
                payment_methods: "cc,dc,upi",
            },
            order_expiry_time: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour
        };

        const result = await Cashfree.orders.create(request);

        res.status(200).json({
            orderId: result.order_id,
            paymentSessionId: result.payment_session_id,
        });
    } catch (error) {
        console.error("Cashfree error:", error);
        res.status(500).json({ error: "Cashfree order failed." });
    }
};

const handleCashfreeWebhook = async (req, res) => {
    try {
        const { order, customer, payment } = req.body;

        if (order.order_status === 'PAID') {
            await db.query(`
                INSERT INTO memberships (user_id, start_date, end_date, plan_type, payment_transaction_id)
                VALUES (?, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), ?, ?)`,
                [customer.customer_id, 'monthly', payment.transaction_id]
            );
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Webhook error:', error);
        res.sendStatus(500);
    }
};

module.exports = { createCashfreeOrderForPremium, handleCashfreeWebhook };
