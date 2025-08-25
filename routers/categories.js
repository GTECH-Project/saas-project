const express = require('express')
const {Category} = require('../models/category');
const { default: mongoose } = require('mongoose');
const router = express.Router();


router.get('/', async (req,res)=>{
    const category = await Category.find()
    if(!category){
        res.status(400).json({
            success: false,
            Message: 'Some Error Occurs'
        })
    }
    res.status(200).send(category)
    
})
router.get('/food', async (req,res)=>{
    const food="Food"
    const category = await Category.find({category_type : food})
    if(!category){
        res.status(400).json({
            success: false,
            Message: 'Some Error Occurs'
        })
    }
    res.status(200).send(category)
    
})

router.get('/:id', async (req,res)=>{
    const category = await Category.findById(req.params.id)
    if(!category){
        res.status(400).json({
            success: false,
            Message: 'Some Error Occurs'
        })
    }
    res.status(200).send(category)
})


router.post('/', (req, res)=>{
    const newCategory = new Category({
        name: req.body.name,
        category_type: req.body.category_type,
        icon: req.body.icon,
        color: req.body.color

    });
    newCategory.save().then(()=>{
        res.status(201).send(newCategory)
    }).catch((err)=>{
        res.status(400).json({success: false})
    })
    // console.log(newCategory)
    
})
router.delete('/:id', (req,res)=>{
    Category.findByIdAndRemove(req.params.id)
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
    const category = await Category.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        {new: true}
        )
    if(!category){
        return res.status(400).send('The Category cannot be updated')
    }
    res.send(category)
})
module.exports= router