const express = require('express')
const authMiddleware = require('../middleware/auth-middleware')
const adminMiddleware = require('../middleware/admin-middleware')
const uploadMiddleware = require('../middleware/upload-middleware')
const {uploadImageController , fetchImagesController , deleteImageController} = require('../controllers/image-controllers')
const router = express.Router()

// upload an image
router.post('/upload' , authMiddleware , adminMiddleware , uploadMiddleware.single('image'), uploadImageController)
// router.post(
//     '/upload',
//     uploadMiddleware.single('image'),
//     authMiddleware,
//     adminMiddleware,
//     uploadImageController
//   )
  
// get all the images
router.get('/get' , authMiddleware , fetchImagesController)

// delete image route
// 69943a49dd4fefa18627ff3e
router.delete('/:id' , authMiddleware , adminMiddleware , deleteImageController )

module.exports = router;