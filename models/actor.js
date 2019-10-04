const mongoose = require('mongoose')
const Film = require('./film')

const actorSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    }
})

actorSchema.pre('remove', function(next){

    Film.find({actor:this.id}, (err, films)=>{
        if (err) {
            next(err)
        } else if (films.length > 0){
            next(new Error('This actor has films still'))
        } else  {
            next()
        }
    })
})
module.exports = mongoose.model('Actor', actorSchema)