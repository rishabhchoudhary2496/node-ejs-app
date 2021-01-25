console.log('hello')
window.onload = async function () {
  console.log(window.location.search)
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  // const myParam = urlParams.get('myParam')
  const data = { token }
  const formDataJsonString = JSON.stringify(data)
  console.log(formDataJsonString)

  try {
    const result = await fetch('http://localhost:5000/verifyAccount', {
      method: 'POST',
      body: formDataJsonString,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })

    const data = await result.json();

    if (result.status == 200) {
      alert('Verfication complete');
      window.location.replace('/')
    } else {
      console.log(result.status)
      alert(data.message)
    }
  } catch (err) {
    console.log(err)
  }
}
