const express = require('express')
const router = express.Router()
const fs = require('fs')
const multer = require('multer')
const path = require('path') //Require this in order to use variable from film model
const Film = require('../models/film')
const Actor = require('../models/actor')
const uploadPath = path.join('public', Film.coverImageBasePath)
const imageMimeTypes = ['images/jpeg', 'images/png', 'images/gif']
const upload = multer({
dest: uploadPath,
fileFilter: (req, file, callback) => {

    callback(null, uploadPath/* imageMimeTypes.includes(file.mimetype) */)

  }
})

//All films route
router.get('/', async (req, res) => {
    //res.send('All Films') 
    let query = Film.find({}) 
    if (req.query.title != null && req.query.title != ''){

        query = query.regex('title', new RegExp(req.query.title, 'i'))//Filter by title on searching
    }

    if (req.query.publishedBefore != null && req.query.publishedBefore != ''){

        query = query.lte('publishDate', req.query.publishedBefore)//Filter by published before on searching
    }

    if (req.query.publishedAfter != null && req.query.publishedAfter != ''){

        query = query.gte('publishDate', req.query.publishedAfter)//Filter by published after on searching
    }



    const films = await query.exec()
    res.render('films/index', {
        films:films,
        searchOptions: req.query

    })
    try {
        
    } catch (error) {
        res.redirect('/')
    }
})

//New films route
router.get('/new', async (req, res) => {

    renderNewPage(res, new Film())
    
})
 

//Create film route
router.post('/', upload.single("cover"), async (req, res) => {

    let fileName = req.file != null ? req.file.filename : null //If filename not equal to null, get filename, else if so return null(:). Assign req.filename to const 'filename'
   
    
    const film =  new Film({
        title: req.body.title,
        actor: req.body.actor,
        publishDate: new Date(req.body.publishDate),
        sceneCount: req.body.sceneCount,
        coverImageName: fileName,
        description: req.body.description
    })
     console.log(req.body.coverImageName)
   
    
    try {
        const newFilm = await film.save()
        //res.redirect(`films/${newFilm.id}`)
        
        res.redirect(`films`) 
    } catch (error) {

        if (film.coverImageName != null){
            removeFilmCover(film.coverImageName)
        }
        
         //console.log(err)
        renderNewPage(res, film, true)
    }

    
})

function removeFilmCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}
async function renderNewPage(res, film, hasError = false){
    
    try {
        const actors = await Actor.find({})
        //const film = new Film()
        const params = {
            actors: actors,
            film: film
        }
        if (hasError) params.errorMessage = 'Error Creating Film'

        
        res.render('films/new', params)

    } catch (e) {
        console.error(e)
        res.redirect('/films')
       
        }

}
module.exports = router









/* let actor = new Actor();
    
   name = req.body.name;
  
    actor.save(function(err, newActor){

        if(err){
            errorMessage: 'Error creating Actor!'
            return;
        }

        else {
           //res.redirect(`actors/${newActor.id}`)
           actor: actor,
           res.redirect(`actors`)
        }
    }) */