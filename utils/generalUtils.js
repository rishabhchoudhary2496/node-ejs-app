const JWT = require('jsonwebtoken')
const secret = 'd41d8cd98f00b204e9800998ecf8427e'
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(
  'SG.vLTQ2KJbRvCg-46vOaZeEA.3Jf7G-Jx4NTiIgpE-HJya1eeCJNEJwvNLeCvvWRwWqg'
)

const generateToken = async function (payload) {
  try {
    const token = JWT.sign(payload, secret, { expiresIn: '6h' })
    return token
  } catch (err) {
    console.log(err)
  }
}

const verifyToken = async function (token) {
  let decoded
  try {
    decoded = JWT.verify(token, secret)
    return decoded
  } catch (err) {
    console.log(err)
    throw err
  }
}

const decodeToken = async function (token) {
  try {
    const decoded = JWT.decode(token)
    return decoded
  } catch (err) {
    console.log(err)
  }
}

const sendVerificationEmail = async function (CLIENT_URL, token, user) {
  const msg = {
    to: user.email,
    from: 'rishabh_choudhary@softprodigy.com', // Use the email address or domain you verified above
    subject: 'Verification Email',
    html: `<p>Please click the link below to activate your account</p><br><a href="${CLIENT_URL}/verifyAccount?token=${token}" target="_blank">${CLIENT_URL}/verifyAccount/token=${token}</a>`,
  }
  try {
    const result = await sgMail.send(msg)
  } catch (err) {
    console.log('send grid', err)
  }
}

const sendResetPasswordEmail = async function (CLIENT_URL, token, user) {
  const msg = {
    to: user.email,
    from: 'rishabh_choudhary@softprodigy.com', // Use the email address or domain you verified above
    subject: 'Reset Password',
    html: `<p>Please click the link below to reset your account</p><br><a href="${CLIENT_URL}/resetPassword?token=${token}" target="_blank">${CLIENT_URL}/resetPassword?token=${token}</a>`,
  }

  try {
    const result = await sgMail.send(msg)
  } catch (err) {
    console.log('send grid', err)
  }
}

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  sendVerificationEmail,
  sendResetPasswordEmail,
}
