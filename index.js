// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// require('dotenv').config({ path: './.env' });
// const { sendEmail } = require('./service/emailService');

// const app = express();
// const upload = multer();

// app.use(cors());

// app.post('/api/email-send', upload.any(), async (req, res) => {
//   try {
//     const { to, cc, subject, html } = req.body;

//     const attachments = req.files.map((file) => ({
//       Name: file.originalname,
//       Content: file.buffer.toString('base64'),
//       ContentType: file.mimetype,
//       ContentID: file.fieldname === 'inlineImage' ? 'inlineImage' : undefined,
//       Disposition: file.fieldname === 'inlineImage' ? 'inline' : 'attachment',
//     }));

//     await sendEmail(to, cc, subject, html, attachments);
//     console.log('Email sent successfully');
//     res.status(200).json({ message: 'Email sent successfully' });

//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).json({ message: 'Error sending email', error: error.message });
//   }
// });

//  const PORT = 5000;
// //const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// })
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({ path: './.env' });
const { sendEmail } = require('./service/emailService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
//app.use(bodyParser.json()); // Đọc JSON body
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));


app.post('/api/email-send', async (req, res) => {
  try {
    // const { to, cc, subject, html } = req.body;
    // await sendEmail(to, cc, subject, html);
    const { to, cc, subject, html, attachments } = req.body;
    const parsedAttachments = Array.isArray(attachments) ? attachments : [];
    if (to.includes(',')) {
      return res.status(400).json({
        message: "Email người nhận phải phân tách bằng dấu ';' thay vì dấu ','"
      });
    }
    if (cc && cc.includes(',')) {
      return res.status(400).json({
        message: "Email CC phải phân tách bằng dấu ';' thay vì dấu ','"
      });
    }
    await sendEmail(to, cc, subject, html, parsedAttachments);

    res.status(200).json({ message: 'Email sent successfully' });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
