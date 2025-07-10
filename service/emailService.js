const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Hoặc gán trực tiếp tạm thời

const sendEmail = async (to, cc, subject, html, attachments = []) => {
  const msg = {
    to: to.split(';'),               // Danh sách người nhận
    cc: cc ? cc.split(';') : [],
    from: process.env.FROM_EMAIL,  // Email bạn đăng ký với SendGrid
    subject,
    html,
    attachments: attachments.map((file) => ({
      content: file.Content,
      filename: file.Name,
      type: file.ContentType,
      disposition: file.Disposition,
      content_id: file.ContentID || undefined
    }))
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('SendGrid error:', error.response?.body?.errors);
  }

};
module.exports = {
  sendEmail
};