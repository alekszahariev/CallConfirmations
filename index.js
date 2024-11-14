require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Twilio client
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Route to initiate a call
app.post('/api/call-customer', async (req, res) => {
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
});

// Voice response route for confirmation
app.post('/api/voice-response/:orderId', (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();

    twiml.say('Hello, this is a confirmation call for your recent order. Press 1 to confirm or 0 to cancel.');

    twiml.gather({
        input: 'dtmf',
        timeout: 5,
        numDigits: 1,
        action: `/api/handle-response/${req.params.orderId}`
    });

    res.type('text/xml');
    res.send(twiml.toString());
});

// Handle response route
app.post('/api/handle-response/:orderId', (req, res) => {
    const digit = req.body.Digits;
    const orderId = req.params.orderId;

    if (digit === '1') {
        console.log(`Order ${orderId} confirmed.`);
        // Update order status to 'Confirmed' in the database here.
    } else if (digit === '0') {
        console.log(`Order ${orderId} canceled.`);
        // Update order status to 'Cancelled' in the database here.
    }

    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Thank you. Your response has been recorded.');
    res.type('text/xml');
    res.send(twiml.toString());
});