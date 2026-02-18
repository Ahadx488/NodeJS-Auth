const Image  =require('../models/image')
const {uploadtoCloudinary} = require('../helpers/cloudinaryHelper')
const fs = require('fs')
const cloudinary = require('../config/cloudinary')

const uploadImageController = async(req,res)=>{
    try {
        console.log('file:-',req.file);
        // check if file is missing in request object 
        if(!req.file){
            return res.status(400).json({
                success : false,
                message : 'File is required. Please Upload an Image'
            })
        }

        // upload to cloudinary
        const  {url , publicId} = await uploadtoCloudinary(req.file.path)

        // store the image url and publicId along with uploaded user id in database
        const newlyUploadedImage = new Image({
            url,
            publicId,
            UploadedBy : req.userInfo.userId
        })
        await newlyUploadedImage.save()

        // delete uploaded image from local storage
        fs.unlinkSync(req.file.path)

        return res.status(200).json({
            success : true,
            message : 'Image uploaded successfully',
            image : newlyUploadedImage
        })
    } catch (error) {
        console.log("Upload errror",error)
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Something went wrong! Please try again'
            });
        }
    }
};

const fetchImagesController = async(req, res)=> {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 2 ;
        const skip = (page-1)*limit;

        const sortBy = req.query.sortBy || 'createdAt'
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit)

        const sortObj = {}
        sortObj[sortBy] = sortOrder
        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

        if(images){
            res.status(200).json({
                success : true,
                currentPage : page,
                totalPages : totalPages,
                totalImages  : totalImages,
                data : images
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again'
        });
    }
}

// delete image

const deleteImageController = async (req,res)=>{
    try {
        
        const getCurrentIdOfImageTobeDeleted = req.params.id
        const userId = req.userInfo.userId

        const image = await Image.findById(getCurrentIdOfImageTobeDeleted)

        if(!image){
            return res.status(404).json({
                success : false,
                message : 'Image not found'
            })
        }
        // check if the image is uploaded by the same user who is trying to delete the image
        if(image.UploadedBy.toString() !== userId){
            return res.status(403).json({
                success : false,
                message : 'You are not authorized to delete the image'
            })
        }

        // delete this image from cloudinary storage first
        await cloudinary.uploader.destroy(image.publicId)

        // delete this image from mongodb 
        await Image.findByIdAndDelete(getCurrentIdOfImageTobeDeleted)

        res.status(200).json({
            success : true,
            message : 'Image deleted successfully'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again'
        });
    }
} 


module.exports = {
    uploadImageController,
    fetchImagesController,
    deleteImageController
}