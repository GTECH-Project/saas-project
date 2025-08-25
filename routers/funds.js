const express = require('express')
const {Fund} = require('../models/fund');
const { default: mongoose } = require('mongoose');
const router = express.Router();


router.get('/', async (req,res)=>{
    const fund = await Fund.find()
    if(!fund){
        res.status(400).json({
            success: false,
            Message: 'Some Error Occurs'
        })
    }
    res.status(200).send(fund)
    
})
router.get('/:id', async (req,res)=>{
    const fund = await Fund.findById(req.params.id)
    if(!fund){
        res.status(400).json({
            success: false,
            Message: 'Some Error Occurs'
        })
    }
    res.status(200).send(fund)
})
router.post('/', (req, res)=>{
    if(!mongoose.isValidObjectId(req.body.user)){
        return res.status(400).send('Invalid User id')
    }
    const newFund = new Fund({
        user: req.body.user,
        amount: req.body.amount

    });
    newFund.save().then(()=>{
        res.status(201).send(newFund)
    }).catch((err)=>{
        res.status(400).json({success: false})
    })
    console.log(newFund)
    
})
router.delete('/:id', (req,res)=>{
    Fund.findByIdAndRemove(req.params.id)
    .then(fund=>{
        return res.status(200).json({
            success: true,
            message: 'the fund is deleted'
        })
    }).catch(err=>{
        return res.status(400).json({
            success: false,
            error: err
        })
    })
})
router.put('/:id', async (req,res)=>{
    if(!mongoose.isValidObjectId(req.body.user)){
        return res.status(400).send('Invalid User id')
    }
    const fund = await Fund.findByIdAndUpdate(req.body.user,
        {
            user: req.body.user,
            amount: req.body.amount
        },
        {new: true}
        )
    if(!fund){
        return res.status(400).send('Your Fund cannot be updated')
    }
    res.send(fund)
})
module.exports= router