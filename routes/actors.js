const express = require('express')
const router = express.Router()
const Actor = require('../models/actor')
const Film = require('../models/film')

//All actors route
router.get('/', async (req, res) => {

 let searchOptions = {}

 if (req.query.name != null && req.query.name !== ''){
    searchOptions.name = new RegExp(req.query.name, 'i')
 }

    try {

    const actors = await Actor.find(searchOptions)
    res.render('actors/index', {
        actors: actors,
        searchOptions: req.query})
    } catch (err) {

    res.redirect('/')
    

    }

    
})

//New actors route
router.get('/new', (req, res) => {
    res.render('actors/new', {
        actor: new Actor()
    })
})


//Create actor route
router.post('/', async (req, res ) => {
    const actor =  new Actor({
        name: req.body.name
    })
  
    try {
        const newActor = await actor.save()
        res.redirect(`actors/${newActor.id}`)
    } catch (err){ 
        res.render('actors/new', {
            actor: actor,
            errorMessage:'Error creating Actor!'
        })
      
    }
    
})

//Show Actor route
router.get('/:id', async(req, res)=>{
    
    try {
    const actor = await Actor.findById(req.params.id)
    const film = await Film.find({actor: actor.id}).limit(6).exec()
    res.render('actors/show', {
        actor: actor,
        filmByActor: film 
    })
    } catch (error) {
               
        res.redirect('/')
    }
   
})

//Edit Actor route
router.get('/:id/edit', async (req, res)=>{

    const actor = await Actor.findById(req.params.id)

    try {
        res.render('actors/edit', {
            actor: actor
        })
    } catch (error) {
        res.redirect('/actors')   
    }
    
})

//Update Actor - note 'put' for update
router.put('/:id', async(req, res)=>{
   let actor  
    try {
        actor = await Actor.findById(req.params.id)
        actor.name = req.body.name
        await actor.save()
        res.redirect(`/actors/${actor.id}`)
    } catch (err){
        if (actor == null) {
            res.redirect('/')
        } else {

            res.render('actors/edit', {
                actor: actor,
                errorMessage:'Error updating Actor!'
            
            })

        }
        
    }
})

//Delete Actor route
router.delete('/:id', async(req, res)=>{
    let actor  
    try {
        actor = await Actor.findById(req.params.id)
        await actor.remove()
        res.redirect('/actors')
    } catch (err){
        if (actor == null) {
            res.redirect('/')
        } else {
            res.redirect(`/actors/${actor.id}`)
        }
        
    }
})
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