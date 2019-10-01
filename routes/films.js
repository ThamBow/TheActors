const express = require('express')
const router = express.Router()
const Film = require('../models/film')
const Actor = require('../models/actor')
//const mime = require('mime-types')
const imageMimeTypes = ['image/png', 'image/jpeg', 'image/gif']


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

    
    try {
        const films = await query.exec()
        res.render('films/index', {
        films:films,
        searchOptions: req.query

    })
    } catch (error) {
        res.redirect('/')
    }
})

//New films route
router.get('/new', async (req, res) => {

     renderNewScene(res, new Film())
    
})  
 

//Create film route
router.post('/',  async (req, res) => { 
    
    const film =  new Film({
        title: req.body.title,
        actor: req.body.actor,
        publishDate: new Date(req.body.publishDate),
        sceneCount: req.body.sceneCount,
        description: req.body.description
    })
     //console.log(req.body.coverImageName)
    saveCover(film, req.body.cover)
    
    try {
        const newFilm = await film.save()
        //res.redirect(`films/${newFilm.id}`)
        
        res.redirect(`films`) 
    } catch (error){

        renderNewScene(res, film, true)
        //return res.send(error.message)
    }

    
})


async function renderNewScene(res, film, hasError = false){
    
    try {
        const actors = await Actor.find({})
        //const film = new Film()
        const params = {
            actors: actors,
            film: film
        }
        if (hasError) {params.errorMessage = 'Error Creating Film'}

        
        res.render('films/new', params)
      
    } catch (error) {
        // console.error(e)
        // console.error(error)
        res.redirect('/films')
       
        }
        
} 



 function saveCover(film, coverEncoded){
    //console.log(coverEncoded)
    
    if (coverEncoded == null) return /* new Promise(function(resolve){}) */
    
    const cover =  JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        film.coverImage = new Buffer.from(cover.data, 'base64')
        film.coverImageType = cover.type
    } 
    //console.log(cover)
}
module.exports = router
