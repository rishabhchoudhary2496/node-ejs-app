const wagner = require('wagner-core')

module.exports = function storage() {
  wagner.invoke((multer) => {
    multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './public/uploads')
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
      },
    })
  })
}
