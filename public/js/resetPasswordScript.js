const resetBtn = document.getElementById('reset-btn');

const sendResetPasswordRequest = async (formDataJsonString) => {
  try {
    const result = await fetch('http://localhost:5000/resetPassword', {
      method: 'POST',
      body: formDataJsonString,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })

    const data = await result.json()

    resetBtn.disabled = false

    console.log(result.status)
    if (result.status == 200) {
      alert(data.message)
      window.location.href = '/login'
    } else {
      alert(data.message)
      window.location.reload()
    }
  } catch (error) {
    console.log(err)
    window.location.reload()
  }
}

window.onload = function () {
  const form = document.getElementById('resetPasswordForm')
  const password = document.getElementById('password')
  const confirmPassword = document.getElementById('confirmPassword')
  const pristine = new Pristine(form)

  pristine.addValidator(
    confirmPassword,
    function () {
      // here `this` refers to the respective input element
      if (this.value === password.value) {
        return true
      }
      return false
    },
    "Password doesn't match",
    false
  )

  //submitting sign up form
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    resetBtn.disabled = true
    // check if the form is valid
    const valid = pristine.validate() // returns true or false
    if (valid) {
      const formData = new FormData()
      for (let i = 0; i < form.length; i++) {
        formData.append(form[i].name, form[i].value)
      }
      formData.delete('confirmPassword')
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')
      // const myParam = urlParams.get('myParam')
      formData.append('token', token);

      const plainFormData = Object.fromEntries(formData.entries())
      const formDataJsonString = JSON.stringify(plainFormData)
      //sending ajax request
      sendResetPasswordRequest(formDataJsonString)
    }
  })
}
