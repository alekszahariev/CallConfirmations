const twilio = require('twilio');

module.exports = (req, res) => {
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
};