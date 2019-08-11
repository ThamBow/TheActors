const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/filmCovers' //Path to where images to be stored, not hardcoded in films.js(multer)

const filmSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String  
    },
    publishDate: {
        type: Date,
        required: true
    },
    sceneCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName:{
        type: String,
        required: [true, 'This is required']
        
    },
    actor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Actor'
    }

})
filmSchema.virtual('coverImagePath').get(function(){
if(this.coverImageName != null){
    return path.join('/', coverImageBasePath, this.coverImageName)
}

})

module.exports = mongoose.model('Film', filmSchema)
module.exports.coverImageBasePath = coverImageBasePath //Path to where images to be stored exported as named variable here
//console.log(filmSchema.path('coverImageName'))