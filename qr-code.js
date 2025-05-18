const express = require('express');
const QRCode = require('qrcode');
const app = express();
const PORT = 3000;

app.get('/generateQR', async (req, res) => {
  try {
    // const url = req.query.url || 'https://example.com';
    const number = 1;
    const ip_address=",192.168.100.12";
    const text = number.toString()+ip_address;
    const qrCodeImage = await QRCode.toDataURL(text);
    res.send(`<img src="${qrCodeImage}" alt="QR Code"/>`);
  } catch (err) {
    console.error('Error generating QR code:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});