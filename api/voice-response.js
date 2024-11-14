const twilio = require('twilio');

module.exports = (req, res) => {
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
};