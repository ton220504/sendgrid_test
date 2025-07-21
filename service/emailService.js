const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Hoặc gán trực tiếp tạm thời

const sendEmail = async (to, cc, subject, html, attachments = []) => {

  const msg = {
    to: to.split(';'),               // Danh sách người nhận
    cc: cc ? cc.split(';') : [],
    from: process.env.FROM_EMAIL,  // Email bạn đăng ký với SendGrid
    subject,
    html,
    attachments: attachments.map(file => ({
      content: file.content,
      filename: file.filename,
      type: file.contentType,
      disposition: 'attachment'
    }))
  };
  try {
    const result = await sgMail.send(msg);
    console.log('✅ Email sent result:', result);
  } catch (error) {
    console.error('❌ SendGrid error:', error.response?.body?.errors || error);
    throw error; 
  }

};
module.exports = {
  sendEmail
};