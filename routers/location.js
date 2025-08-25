const express = require('express')
const {Location} = require('../models/location');
const {Lga} = require('../models/lga');
const {State} = require('../models/state');
const { default: mongoose } = require('mongoose');
const router = express.Router();


router.get('/', async (req,res)=>{
    const category = await State.find()
    if(!category){
        res.status(400).json({
            success: false,
            Message: 'Some Error Occurs'
        })
    }
    res.status(200).send(category)
    
})

router.get('/lga/:id', async (req,res)=>{
    const category = await Lga.find({state : req.params.id})
    if(!category){
        res.status(400).json({
            success: false,
            Message: 'Some Error Occurs'
        })
    }
    res.status(200).send(category)
})

router.get('/area/:id', async (req,res)=>{
    const category = await Location.find({lga : req.params.id})
    if(!category){
        res.status(400).json({
            success: false,
            Message: 'Some Error Occurs'
        })
    }
    res.status(200).send(category)
})


router.post('/', (req, res)=>{
    const newState = new State({
        name: req.body.name,
        status: req.body.icon

    });
    newState.save().then(()=>{
        res.status(201).send(newState)
    }).catch((err)=>{
        res.status(400).json({success: false})
    })
})

router.post('/lga', (req, res)=>{
    const newLga = new Lga({
        name: req.body.name,
        state: req.body.state,
        status: req.body.status

    });
    newLga.save().then(()=>{
        res.status(201).send(newLga)
    }).catch((err)=>{
        res.status(400).json({success: false})
    })
})

router.post('/area', (req, res)=>{
    const newLocation = new Location({
        name: req.body.name,
        lga: req.body.lga,
        status: req.body.status

    });
    newLocation.save().then(()=>{
        res.status(201).send(newLocation)
    }).catch((err)=>{
        res.status(400).json({success: false})
    })
})

// router.delete('/:id', (req,res)=>{
//     Category.findByIdAndRemove(req.params.id)
//     .then(category=>{
//         return res.status(200).json({
//             success: true,
//             message: 'the category is deleted'
//         })
//     }).catch(err=>{
//         return res.status(400).json({
//             success: false,
//             error: err
//         })
//     })
// })
// router.put('/:id', async (req,res)=>{
//     if(!mongoose.isValidObjectId(req.params.id)){
//         return res.status(400).send('Invalid Category id')
//     }
//     const category = await Category.findByIdAndUpdate(req.params.id,
//         {
//             name: req.body.name,
//             icon: req.body.icon,
//             color: req.body.color
//         },
//         {new: true}
//         )
//     if(!category){
//         return res.status(400).send('The Category cannot be updated')
//     }
//     res.send(category)
// })
module.exports= router