const signUpBtn = document.getElementById('signup-btn');
const signUpSpinner = document.getElementById('signup-spinner');
signUpSpinner.style.display = 'none'

const sendSignUpRequest = async (formDataJsonString) => {
  
  try {
    const result = await fetch('http://localhost:5000/signUp', {
      method: 'POST',
      body: formDataJsonString,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })

    signUpBtn.disabled = false
    signUpSpinner.style.display = 'none'

    console.log(result.status)
    if (result.status == 200) {
      alert('Verification Email Sent')
      window.location.href = '/login'
    } else {
      window.location.reload();
    }
  } catch (error) {
    console.log(err)
    window.location.reload();
  }
}


window.onload = function () {
  const form = document.getElementById('signUpForm')
  const password = document.getElementById('password')
  const confirmPassword = document.getElementById('confirmPassword')
  const age = document.getElementById('age')
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
    signUpBtn.disabled = true
    signUpSpinner.style.display = 'block'
    const checkBox = document.querySelector('.form-check-input:checked').value
    // check if the form is valid
    const valid = pristine.validate() // returns true or false
    if (valid) {
      const formData = new FormData()
      for (let i = 0; i < form.length; i++) {
        formData.append(form[i].name, form[i].value)
      }
      formData.delete('gender')
      formData.append('gender', checkBox)
      formData.delete('')
      formData.delete('confirmPassword')

      const plainFormData = Object.fromEntries(formData.entries())
      const formDataJsonString = JSON.stringify(plainFormData)

      //sending ajax request
      sendSignUpRequest(formDataJsonString);

    }
  })
}
