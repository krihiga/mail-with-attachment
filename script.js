document.getElementById('emailForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const fileInput = document.getElementById('file');
    const files = fileInput.files;

    
    const data = {
        email,
        subject,
        message
    };

    // Append each file to FormData
    for (let i = 0; i < files.length; i++) {
        data.append('attachments', files[i]);
    }

    fetch('https://mail-with-attachment.vercel.app/api/sendMail', { // Replace with your deployed Vercel URL
        method: 'POST',
        body: data,
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || 'Email sent successfully!');
    })
    .catch(error => {
        console.error('Error sending email:', error);
        alert('Error sending email: ' + error.message);
    });
});