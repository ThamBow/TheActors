const express = require('express')
const router = express.Router()
const Actor = require('../models/actor')

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
        //res.redirect(`actors/${newActor.id}`)
        res.redirect(`actors`) 

    } catch (err){
        
        res.render('actors/new', {
            actor: actor,
            errorMessage:'Error creating Actor!'
        
        })
      
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