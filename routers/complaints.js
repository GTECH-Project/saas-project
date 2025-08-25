const express = require('express')
const {Complaint} = require('../models/complaint');
const { default: mongoose } = require('mongoose');
const { populate } = require('dotenv');
const router = express.Router();


router.get('/', async (req,res)=>{
    const category = await Complaint.find({status : { $ne : 'Closed'}}).populate('order_id')
    .populate({path: 'order_id', populate: 'vendor'})
    if(!category){
        res.status(400).json({
            success: false,
            Message: 'Some Error Occurs'
        })
    }
    res.status(200).send(category)
    
})

router.get('/:id', async (req,res)=>{
    const category = await Complaint.findById(req.params.id)
    if(!category){
        res.status(400).json({
            success: false,
            Message: 'Some Error Occurs'
        })
    }
    res.status(200).send(category)
})

router.get('/user/:id', async (req,res)=>{
    const category = await Complaint.find({user_id : req.params.id}).sort({dateCreated : -1})
    if(!category){
        res.status(400).json({
            success: false,
            Message: 'Some Error Occurs'
        })
    }
    res.status(200).send(category)
})

// router.get('/area/:id', async (req,res)=>{
//     const category = await Location.find({lga : req.params.id})
//     if(!category){
//         res.status(400).json({
//             success: false,
//             Message: 'Some Error Occurs'
//         })
//     }
//     res.status(200).send(category)
// })


router.post('/', (req, res)=>{
    const newState = new Complaint({
        user_id: req.body.user_id,
        order_id: req.body.order_id,
        details: req.body.details,
        status: req.body.status

    });
    newState.save().then(()=>{
        res.status(201).send(newState)
    }).catch((err)=>{
        res.status(400).json({success: false})
    })
})

router.delete('/:id', (req,res)=>{
    Complaint.findByIdAndRemove(req.params.id)
    .then(category=>{
        return res.status(200).json({
            success: true,
            message: 'the category is deleted'
        })
    }).catch(err=>{
        return res.status(400).json({
            success: false,
            error: err
        })
    })
})
router.put('/:id', async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Category id')
    }
    const category = await Complaint.findByIdAndUpdate(req.params.id,
        {
            user_id: req.body.user_id,
            order_id: req.body.order_id,
            details: req.body.details,
            status: req.body.status
        },
        {new: true}
        )
    if(!category){
        return res.status(400).send('The Category cannot be updated')
    }
    res.send(category)
})
module.exports= router