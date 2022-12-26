function sendMessage(_req, res, next, message) {
  if (!message) {
    res.status(400).send('Message is required');
    return;
  }

  try {
    console.log(`Message buy product: ${message.message}`);
    _req.session.sessionFlash = {
      error: message.error || undefined,
      success: message.success || undefined,
      message: message.message
    }
    return;
  } catch (err) {
    next(err);
  }
}

module.exports = {
  sendMessage
};