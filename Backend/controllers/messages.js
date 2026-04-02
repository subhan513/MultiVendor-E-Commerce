const Conversation = require('../model/conversation');
const Message = require('../model/messages');
const ErrorHandler = require('../utils/ErrorHandler');

const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const express = require('express');
const { upload } = require('../multer');
const router = express.Router();

// create new message


router.post("/create-new-message",upload.array("images"),catchAsyncErrors(async (req,res,next) => {
  try {

    const messageData = req.body;
    if(req.files){
      const files  = req.files;
      const imageUrls = files.map((file)=>`${file.filename}`);
     const messageData =req.body;
     messageData.images = imageUrls;
    }
    const message = await Message.create({
      conversationId : messageData.conversationId,
      text : messageData.text,
      sender : messageData.sender,
      images : messageData.images ? messageData.images : undefined
    })
    await message.save();


    res.status(201).json({
      success : true,
      message
    })
  } catch (error) {
    return next(new ErrorHandler(error.reponse.message, 500));
  }
}))


router.get('/get-all-messages/:id',catchAsyncErrors(async (req,res,next) => {
  try {
    const messages = await Message.find({
      conversationId : req.params.id
    })
    res.status(201).json({
      success : true,
      messages
    })
  } catch (error) {
    
  }
}))

module.exports = router;