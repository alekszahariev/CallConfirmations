require('dotenv').config();
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports = async (req, res) => {
    const { customerPhoneNumber, orderId } = req.query;

    if (!customerPhoneNumber || !orderId) {
        return res.status(400).json({ message: 'Missing required parameters: customerPhoneNumber or orderId' });
    }

    console.log('Phone Number:', customerPhoneNumber);
    console.log('Order ID:', orderId);

    try {
        const call = await client.calls.create({
            url: `${req.protocol}://${req.get('host')}/api/voice-response/${orderId}`,
            to: customerPhoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER,
        });
        res.status(200).json({ message: 'Call initiated', callSid: call.sid });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to initiate call' });
    }
};