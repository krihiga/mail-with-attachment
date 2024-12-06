document.getElementById('emailForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    try {
      const response = await fetch('https://mail-with-attachment.vercel.app/api/sendEmail', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      
      document.getElementById('response').textContent = result.message;
    } catch (error) {
      document.getElementById('response').textContent = 'Error sending email!';
    }
  });
  