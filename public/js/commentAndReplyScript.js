let currentComment
const sendPostCommentRequest = async (formDataJsonString) => {
  try {
    const result = await fetch('http://localhost:5000/comment', {
      method: 'POST',
      body: formDataJsonString,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })

    const data = await result.json()
    postBtn.disabled = false
    if (result.status == 200) {
      window.location.reload()
    } else {
      alert(data)
      window.location.reload()
    }
  } catch (error) {
    console.log(err)
    window.location.reload()
  }
}

const sendPostReplyRequest = async (formDataJsonString, replyBtn) => {
  try {
    const result = await fetch('http://localhost:5000/reply', {
      method: 'POST',
      body: formDataJsonString,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })

    const data = await result.json()
    console.log(data)
    replyBtn.disabled = false
    if (result.status == 200) {
      window.location.reload()
    } else {
      alert(data.error)
      window.location.reload()
    }
  } catch (error) {
    console.log(err)
    window.location.reload()
  }
}

const getRepliesRequest = async () => {
  try {
    const result = await fetch('http://localhost:5000/reply', {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })

    const data = await result.json()
    console.log(data)
    if (result.status == 200) {
      return data.replies
      // window.location.reload()
    } else {
      alert(data)
      // window.location.reload()
    }
  } catch (error) {
    console.log(err)
    // window.location.reload()
  }
}

const createReplyBox = () => {
  const textArea = document.createElement('textarea')
  const replyBtn = document.createElement('button')
  const replyBox = document.createElement('div')
  // replyBtn.setAttribute('type', 'submit')
  replyBtn.setAttribute('id', 'button')
  textArea.setAttribute('id', 'replyArea')
  textArea.classList.add('form-control', 'mb-3')
  replyBtn.classList.add('btn', 'btn-primary')
  replyBtn.innerText = 'Reply'
  replyBox.appendChild(textArea)
  replyBox.appendChild(replyBtn)
  replyBox.classList.add('hide-reply-box')
  replyBtn.addEventListener('click', (e) => {
    const formData = new FormData()
    formData.append('userUUID', currentComment.user.uuid)
    formData.append('commentUUID', currentComment.uuid)
    replyBtn.disabled = true
    console.log(textArea.value)
    if (!textArea.value) {
      alert('reply required')
      replyBtn.disabled = false
    }
    formData.append('reply', textArea.value)
    const plainFormData = Object.fromEntries(formData.entries())
    const formDataJsonString = JSON.stringify(plainFormData)
    sendPostReplyRequest(formDataJsonString, replyBtn)
  })
  return replyBox
}

const updateRepliesToUI = async () => {
  const replies = await getRepliesRequest()
  console.log('replies**', replies)
  for (let i = 0; i < replies.length; i++) {
    const div = document.querySelector(
      `[data-uuid="${replies[i].comment.uuid}"]`
    )
    let replyBox = document.createElement('div')

    replyBox.classList.add('mx-4', 'my-2')

    if (replies[i].user && replies[i].user.profilePic) {
      const img = document.createElement('img')
      img.src = replies[i].user.profilePic
      img.height = 50
      img.width = 50
      img.classList.add('rounded-circle')
      replyBox.appendChild(img)
    }

    const namePara = document.createElement('p')
    namePara.innerText = `${replies[i].user.firstName} ${replies[i].user.lastName}`
    namePara.classList.add('text', 'text-primary')

    const boldName = document.createElement('strong')
    boldName.appendChild(namePara)

    replyBox.appendChild(boldName)

    let reply = document.createElement('p')
    reply.innerText = replies[i].reply
    replyBox.appendChild(reply)
    div.appendChild(replyBox)
  }
}

const updateCommentsToUI = (comments) => {
  const commentsDiv = document.getElementById('commentsDiv')
  for (let i = 0; i < comments.length; i++) {
    const userCommentDiv = document.createElement('div')
    userCommentDiv.setAttribute('data-uuid', comments[i].uuid)
    const namePara = document.createElement('p')
    const commentPara = document.createElement('p')
    const boldName = document.createElement('strong')
    const replyToggle = document.createElement('span')
    replyToggle.innerText = 'reply'
    replyToggle.classList.add('text', 'text-primary', 'mb-1')
    namePara.innerText = `${comments[i].user.firstName} ${comments[i].user.lastName}`
    commentPara.innerText = comments[i].comment
    namePara.classList.add('text', 'text-primary')

    //if profile pic is there set it to UI
    if (comments[i].user && comments[i].user.profilePic) {
      const img = document.createElement('img')
      img.src = comments[i].user.profilePic
      img.height = 50
      img.width = 50
      img.classList.add('rounded-circle')
      userCommentDiv.appendChild(img)
    }

    boldName.appendChild(namePara)
    userCommentDiv.append(boldName)
    userCommentDiv.append(commentPara)
    userCommentDiv.appendChild(replyToggle)

    userCommentDiv.classList.add('card', 'p-3', 'my-3')
    const replyBox = createReplyBox()
    userCommentDiv.appendChild(replyBox)
    commentsDiv.append(userCommentDiv)

    replyToggle.addEventListener('click', (e) => {
      currentComment = comments[i]
      console.log(comments[i])
      replyBox.classList.toggle('show-reply-box')
    })
  }

  updateRepliesToUI()

  const replyBtn = document.getElementById('button')
  console.log(replyBtn)

  // const replyArea = document.getElementById('replyArea');
}

const getComments = async () => {
  try {
    const result = await fetch('http://localhost:5000/comment', {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })

    const data = await result.json()

    if (result.status == 200) {
      console.log(data)
      updateCommentsToUI(data.comments)

      //   window.location.reload()
    } else {
      alert(data)
      //   window.location.reload()
    }
  } catch (error) {
    console.log(error)
    // window.location.reload()
  }
}

window.onload = function () {
  const postBtn = document.getElementById('postBtn')
  const script = document.getElementById('commentScript')
  const uuid = script.getAttribute('data-user')
  const form = document.getElementById('commentForm')

  getComments(uuid)

  const pristine = new Pristine(form)
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const valid = pristine.validate()
    if (valid) {
      postBtn.disabled = true
      let formData = new FormData()
      for (let i = 0; i < form.length; i++) {
        formData.append(form[i].name, form[i].value)
      }
      formData.append('uuid', uuid)
      const plainFormData = Object.fromEntries(formData.entries())
      const formDataJsonString = JSON.stringify(plainFormData)
      sendPostCommentRequest(formDataJsonString)
    }
  })
}
