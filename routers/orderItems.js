const express = require('express')
const {OrderItem} = require('../models/orderItems')
const router = express.Router();


router.get('/', async (req,res)=>{
    const orderItem = await OrderItem.find().then(()=>{
        return res.status(200).send(orderItem)
    }).catch(err=>{
        return res.status(400).json({
            success: false,
            error: err
        })
    })
})
router.get('/:id', (req,res)=>{
    const orderItem  = OrderItem.findById(req.params.id)
    .then(()=>{
        return res.status(200).send(orderItem)
    }).catch((err)=>{
        return res.status(400).json({
            success: false,
            error: err
        })
    })
})
router.post('/', (req, res)=>{
    const newOrderItem = new OrderItem({
        product: req.body.product,
        quality: req.body.quality

    });
    newOrderItem.save().then(()=>{
        res.status(201).send(newOrderItem)
    }).catch((err)=>{
        res.status(400).json({success: false})
    })
    console.log(newOrderItem)
    
})

router.delete('/:id', (req,res)=>{
    OrderItem.findByIdAndRemove(req.params.id)
    .then(category=>{
        return res.status(200).json({
            success: true,
            message: 'the orderItem is deleted'
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
        return res.status(400).send('Invalid OrderItem id')
    }
    const orderItem = await OrderItem.findByIdAndUpdate(req.params.id,
        {
            product: req.body.product,
            quality: req.body.quality
        },
        {new: true}
        )
    if(!orderItem){
        return res.status(400).send('The orderItem cannot be updated')
    }
    res.send(orderItem)
})

module.exports= router