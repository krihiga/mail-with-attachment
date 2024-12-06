const nodemailer = require('nodemailer');
const multer = require('multer');

// Set up storage for multer (in-memory storage for file upload)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('attachments');

// Create a transporter using Gmail's SMTP server
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // Gmail's SMTP server
    port: 587,               // TLS port
    secure: false,           // Use TLS
    auth: {
        user: process.env.GMAIL_USER,  // Your Gmail address
        pass: process.env.GMAIL_PASS,  // Your Gmail App password or regular password
    },
});

// API route for sending the email
module.exports = async (req, res) => {
    if (req.method === 'POST') {
        // Parse the incoming form data with file attachments
        upload(req, res, async (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(400).json({ error: 'Error uploading file' });
            }

            const { email, subject, message } = req.body;

            const mailOptions = {
                from: process.env.GMAIL_USER,  // Sender's email address
                to: email,                    // Recipient's email address
                subject: subject,             // Subject of the email
                text: message,                // Body of the email
                attachments: [],              // To store attachments
            };

            // Add files to the attachments array
            if (req.files) {
                req.files.forEach(file => {
                    mailOptions.attachments.push({
                        filename: file.originalname,
                        content: file.buffer,
                        encoding: 'base64',
                    });
                });
            }

            try {
                const info = await transporter.sendEmail(mailOptions);
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'Email sent successfully!' });
            } catch (error) {
                console.error('Error sending email:', error);
                res.status(500).json({ error: 'Error sending email' });
            }
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};
