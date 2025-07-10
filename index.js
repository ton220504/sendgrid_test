const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config({ path: './.env' });
const { sendEmail } = require('./service/emailService');

const app = express();
const upload = multer();

app.use(cors());

app.post('/api/email-send', upload.any(), async (req, res) => {
  try {
    const { to, cc, subject, html } = req.body;

    const attachments = req.files.map((file) => ({
      Name: file.originalname,
      Content: file.buffer.toString('base64'),
      ContentType: file.mimetype,
      ContentID: file.fieldname === 'inlineImage' ? 'inlineImage' : undefined,
      Disposition: file.fieldname === 'inlineImage' ? 'inline' : 'attachment',
    }));

    await sendEmail(to, cc, subject, html, attachments);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
})