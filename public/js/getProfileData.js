window.onload = async function () {
  try {
    const result = await fetch('http://localhost:5000/profile', {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })

    if (result.status === 200) {
      window.location.reload()
    }

    // const data = await result.json();
  } catch (err) {
    console.log(err)
  }
}
