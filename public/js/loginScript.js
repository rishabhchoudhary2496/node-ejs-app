const loginSpinner = document.getElementById('login-spinner')
const loginBtn = document.getElementById('login-Btn')
loginSpinner.style.display = 'none'

const sendLoginRequest = async (formDataJsonString) => {
  try {
    const result = await fetch('http://localhost:5000/login', {
      method: 'POST',
      body: formDataJsonString,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })

    const data = await result.json()
    loginBtn.disabled = false
    if (result.status == 200) {
      loginSpinner.style.display = 'none'
      window.location.href = '/'
    } else {
      alert(data)
      loginSpinner.style.display = 'none'
      window.location.reload()
    }
  } catch (error) {
    console.log(err)
    window.location.reload()
  }
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

const sendForgotPasswordRequest = async (formDataJsonString) => {
  try {
    const result = await fetch('http://localhost:5000/forgotPassword', {
      method: 'POST',
      body: formDataJsonString,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })

    const data = await result.json()

    console.log(result)
    if (result.status == 200) {
      alert('Reset Password link sent to email')
      window.location.reload()
    } else {
      console.log('data', data)
      alert(data.error)
    }
  } catch (error) {
    console.log(err)
    window.location.reload()
  }
}

const handleForgotPassword = () => {
  const email = document.getElementById('exampleInputEmail1')
  console.log(email.value)
  if (!email.value) {
    return alert('please provide email')
  }
  const isValidEmail = validateEmail(email.value)
  if (!isValidEmail) {
    return alert('not a valid email')
  }

  const formData = new FormData()
  formData.append('email', email.value)
  const plainFormData = Object.fromEntries(formData.entries())
  const formDataJsonString = JSON.stringify(plainFormData)
  sendForgotPasswordRequest(formDataJsonString)
}

window.onload = function () {
  const form = document.getElementById('loginForm')
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn')

  forgotPasswordBtn.addEventListener('click', handleForgotPassword)

  const pristine = new Pristine(form)

  form.addEventListener('submit', function (e) {
    e.preventDefault()
    loginBtn.disabled = true
    const valid = pristine.validate()
    if (valid) {
      const formData = new FormData()
      for (let i = 0; i < form.length; i++) {
        formData.append(form[i].name, form[i].value)
      }
      formData.delete('')

      const plainFormData = Object.fromEntries(formData.entries())
      const formDataJsonString = JSON.stringify(plainFormData)

      //sending ajax request
      sendLoginRequest(formDataJsonString)
      loginSpinner.style.display = 'block'
    }
  })
}
