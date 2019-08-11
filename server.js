if (process.env.NODE_ENV !== 'production')
{
   require('dotenv').config() 
}
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
// const path = require('path')



const indexRouter = require('./routes/index')
const actorRouter = require('./routes/actors')
const filmRouter = require('./routes/films')




//Connect to database
const mongoose = require('mongoose')



mongoose.connect( process.env.DATABASE_URL, {
    useNewUrlParser: true
})


const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose!'))


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

app.use(expressLayouts )
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false }))

/* app.use(express.json())
app.use(express.urlencoded({ extended: true }))
 */

// Possible mongoose line

//Point to router in question
app.use('/', indexRouter)//Points to index.js in the root folder
app.use('/actors', actorRouter)//Views folder/actors
app.use('/films', filmRouter)//Views folder/actors


app.listen(process.env.PORT || 3000)

