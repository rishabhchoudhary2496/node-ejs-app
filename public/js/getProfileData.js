window.onload = async function () {
  try {
    const result = await fetch('http://localhost:5000/profile', {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        // 'Content-Type': 'application/json',
      },
      
    })
    const data = await result.json();
    console.log('data');
} catch (err) {
    console.log(err)
  }
}
