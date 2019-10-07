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
        res.redirect(`films/${newFilm.id}`)
        
        //res.redirect(`films`) 
    } catch (error){

        renderNewScene(res, film, true)
        //return res.send(error.message)
    }

    
})

//Show films route
router.get('/:id', async (req, res) => {

    try {
        const film = await Film.findById(req.params.id).populate('actor').exec()
        res.render('films/show', {film: film})
    } catch (error) {
        res.redirect('/') 
    }
   
})  


//Edit Film route
router.get('/:id/edit', async (req, res) => {
    const film = await Film.findById(req.params.id)
    try {
        renderEditScene(res, film)
    } catch (error) {
        res.redirect('/') 
    }
   
})  

//Update film route
router.put('/:id',  async (req, res) => { 
    
   let film
    
    try {
        film = await Film.findById(req.params.id)

        film.title = req.body.title,
        film.actor = req.body.actor,
        film.publishDate = new Date(req.body.publishDate),
        film.sceneCount = req.body.sceneCount,
        film.description = req.body.description

        if (req.body.cover != null && req.body.cover !== ''){
            saveCover(film, req.body.cover)

        }
        await film.save()
        res.redirect(`/films/, ${film.id} `)
        
    } catch (error){
        if(film != null){
            renderEditScene(res, film, true)
        } else {
            res.redirect('/')  
        }
       
        //return res.send(error.message)
    }

    
})

//Delete film route
router.delete('/:id',  async (req, res) => { 
    
   let film
    try {
        film = await Film.findById(req.params.id)
        await film.remove()
        res.redirect('/films')
    } catch (error) {
        if(film != null){
           res.render('films/show', {
            films: films,
            errorMessage: 'CFould not remove film'  
           })

        } else{
            res.redirect('/')
        }
    }     

})


async function renderNewScene(res, film, hasError = false){
    
    renderFormScene(res, film, 'new', hasError)
        
} 

async function renderEditScene(res, film, hasError = false){
    
    renderFormScene(res, film, 'edit', hasError)
        
} 

async function renderFormScene(res, film, form, hasError = false){
    
    try {
        const actors = await Actor.find({})
        //const film = new Film()
        const params = {
            actors: actors,
            film: film
        }
        if (hasError) {
            if(form === edit){
                params.errorMessage = 'Error Updating Film'

            } else {
            params.errorMessage = 'Error Creating Film'
            }
        }

        
        res.render(`films/${form}`, params)
      
    } catch (err) {
        console.log(err)
        
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
