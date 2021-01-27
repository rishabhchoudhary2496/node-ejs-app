const file = document.getElementById('file');
const form = document.getElementById('uploadPicForm');

let imgFile
let imageUrl

file.addEventListener('change', (e) =>{
    const previewImg = document.getElementById('previewImg')
    imgFile= e.currentTarget.files[0];
    imageUrl = URL.createObjectURL(imgFile)
    console.log(imageUrl)
    previewImg.height = 200;
    previewImg.width = 200;
    previewImg.src = imageUrl
})

form.addEventListener('submit', async(req,res) => {
    if(!imgFile){
        return alert('Please Upload Photo');
    }

      const formData = new FormData();
      formData.append('profilePic',imgFile);
      const plainFormData = Object.fromEntries(formData.entries())

      try {
        const result = await fetch('http://localhost:5000/uploadProfilePic', {
          method: 'POST',
          body: plainFormData,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        })

        const data = await result.json()

        console.log(result)
        if (result.status == 200) {
          window.location.href='/profile'
        } else {
          console.log('data', data)
          alert(data.error)
        }
      } catch (error) {
        console.log(err)
        window.location.reload()
      }
})


