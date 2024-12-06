const nodemailer = require('nodemailer');
const formidable = require('formidable');
const fs = require('fs');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: 'Error parsing form data' });
        return;
      }

      const { from, subject, message } = fields;
      const attachment = files.file;

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
        logger: true,  // Logs SMTP details to the console
        debug: true,   // Enables debugging
      });
      const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'onlyrithi@gmail.com',
  from: 'your-email@gmail.com',
  subject: 'Test Email with Attachment',
  text: 'This is a test email.',
  attachments: [
    {
      content: fileContent.toString('base64'),
      filename: 'test.txt',
      type: 'text/plain',
      disposition: 'attachment',
    },
  ],
};

sgMail.send(msg)
  .then(() => console.log('Email sent'))
  .catch((error) => console.error('Error sending email:', error));


      const mailOptions = {
        to: process.env.GMAIL_USER,
        from,
        subject,
        text: message,
        attachments: [
            {
              filename: attachment.originalFilename,
              path: attachment.filepath,
            },
          ],
      };

      try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });
      } catch (error) {
        res.status(500).json({ message: 'Failed to send email', error });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
