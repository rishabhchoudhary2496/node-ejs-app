const form = document.getElementById("resendForm");
const btn = document.getElementById('btn');

form.addEventListener('submit', async function() {
    btn.disabled = true;
    try {
    const result = await fetch(
      'http://localhost:5000/resendVerificationEmail',
      {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await result.json()
    btn.disabled = false

    console.log(result.status)
    if (result.status == 200) {
      alert('Verification Email Sent')
    } else {
        alert(data.message);
    }
  } catch (error) {
    console.log(err)
  }
})