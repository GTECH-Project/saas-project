const express = require('express')
const mongoose = require('mongoose')
const {Order} = require('../models/order')
const { Wallet } = require('../models/wallet');
const {OrderItem} = require('../models/orderItems')
const {Product} = require('../models/product');
const router = express.Router();



router.get('/', async (req,res)=>{
    const order = await Order.find().populate('user','name').sort({'dateOrdered': -1})
    if(!order){
        return res.status(400).json({
            success: false,
            error: err
        })
    }
    res.status(200).send(order)
    
})

router.get('/recent', async (req,res)=>{
    const order = await Order.find({vendor_status : { $ne : 'Pending'}}).populate('vendor').sort({'dateOrdered': -1}).limit(10)
    if(!order){
        return res.status(400).json({
            success: false,
            error: err
        })
    }
    res.status(200).send(order)
    
})

router.get('/pending', async (req,res)=>{
    const order = await Order.find({vendor_status : 'Pending'}).populate('vendor').sort({'dateOrdered': -1}).limit(10)
    if(!order){
        return res.status(400).json({
            success: false,
            error: err
        })
    }
    res.status(200).send(order)
    
})

router.get('/:id', async (req,res)=>{
    const order  = await Order.findById(req.params.id).populate('user', 'name')
    .populate({path: 'orderItems', populate: {path: 'product', populate: 'category'}})
    
    if(!order){
        return res.status(400).json({
            success: false,
            error: err
        })
    }
    res.status(200).send(order)
})
router.get('/wallet/:id', async (req,res)=>{
    console.log("Hello!")
    const wallet = await Wallet.find({user: req.params.id}).sort({'dateOrdered': -1})
    
    if(!wallet){
        return res.status(400).json({
            success: false,
            error: err
        })
    }
    res.status(200).send(wallet)
    
})

router.get('/get/myorders/:id', async (req,res)=>{
    
    const orders = await Order.find({user: req.params.id}).populate('vendor category')
    .select('address lga category nearest_busstop product quantity vendor phone vendor_status totalPrice price dateOrdered').sort({'dateOrdered': -1})
    if(!orders){
        res.status(500).json({
            success: false
        })
    } 
    res.status(200).send(orders)
})

router.get('/get/vendororders/:id', async (req,res)=>{
    
    const orders = await Order.find({vendor: req.params.id}).populate('vendor category')
    .select('name address category product quantity vendor phone admin_status vendor_status totalPrice price dateOrdered').sort({'dateOrdered': -1})
    if(!orders){
        res.status(500).json({
            success: false
        })
    } 
    res.status(200).send(orders)
})


router.post('/', async (req, res)=>{
    
    // const totalPrice= Number(req.body.price)*Number(req.body.quantity);
    // res.send("HI")
    let user;
    let prices= Promise.all(req.body.orders.map(async orderItem => {
        let product = await Product.findById(orderItem.id)
        // const totalPrice = await 
        user=orderItem.user
        let price= product.price * orderItem.quantity

        return price
    }))
    let totalPrice = await prices
    totalPrice = totalPrice.reduce((a, b) => a + b, 0)
   
    const wallet = await Wallet.find({user:user})
  
    if(wallet.length == 0){
        return res.status(400).json({
            success: false,
            error: 'Insufficient fund'
        })
    }
    let balance = wallet[wallet.length-1].fund
    if(totalPrice > balance){
        return res.status(400).json({
            success: false,
            error: 'Insufficient funds'
        })
    }
    const newBalance = balance - totalPrice
    const newWallet = new Wallet({
        amount: totalPrice,
        fund:newBalance,
        status: 'Purchased',
        user: user
    });
    const saveWallet = await newWallet.save()
    // console.log(wallet[wallet.length-1].fund)

    const orderItems = Promise.all(req.body.orders.map(async orderItem => {
 
        const newOrderItem = new Order({
            name: orderItem.name,
            nearest_busstop: orderItem.nearest_busstop,
            lga: orderItem.lga,
            address: orderItem.address,
            category: orderItem.category,
            product: orderItem.product,
            quantity: orderItem.quantity,
            vendor: orderItem.vendor,
            phone: orderItem.phone,
            totalPrice: orderItem.total,
            price: orderItem.price,
            user: orderItem.user,
        })
        const savedOrderItem = await newOrderItem.save();
        return savedOrderItem
    }))
    let result = await orderItems
    if(!result){
        res.status(400).json({success: false})
    }else{
        res.status(201).send(result)
    }
    
})

router.post('/wallet', async(req, res)=>{
    const wallet = await Wallet.find({user: req.body.user})
    if(wallet.length > 0){
        let newBalance=0
        newBalance=wallet[wallet.length-1].fund + Number(req.body.fund)
        // console.log(newBalance)
        const newWallet = new Wallet({
            amount: req.body.fund,
            fund:newBalance,
            status: 'Add fund',
            user: req.body.user
        });
        newWallet.save().then(()=>{
            res.status(201).send(newWallet)
        }).catch((err)=>{
            res.status(400).json({success: false})
        })
    }else{
        const newWallet = new Wallet({
            amount: req.body.fund,
            fund:req.body.fund,
            status: 'Add fund',
            user: req.body.user
        });
        newWallet.save().then(()=>{
            res.status(201).send(newWallet)
        }).catch((err)=>{
            res.status(400).json({success: false})
        })
    }
    
    // console.log(newWallet)
    // res.send("It is ok")
    
})

router.post('/debit', async(req, res)=>{
    const wallet = await Wallet.find({user: req.body.user})
    if(wallet.length > 0){
        if(wallet[wallet.length-1].fund < req.body.fund){
            return res.status(400).send("Insuficient fund!")
        }
        let newBalance=0
        newBalance=wallet[wallet.length-1].fund - Number(req.body.fund)
        // console.log(newBalance)
        const newWallet = new Wallet({
            amount: req.body.fund,
            fund:newBalance,
            status: 'Debit',
            user: req.body.user
        });
        newWallet.save().then(()=>{
            res.status(201).send(newWallet)
        }).catch((err)=>{
            res.status(400).json({success: false})
        })
    }else{
        res.status(400).json({success: false})
    }
    
    // console.log(newWallet)
    // res.send("It is ok")
    
})

router.delete('/:id', (req,res)=>{
    Order.findByIdAndRemove(req.params.id)
    .then(async order=>{
        if(order){
            await order.OrderItems.map(async orderItem =>{
                await OrderItem.findByIdAndRemove(orderItem)
            })
        }
        return res.status(200).json({
            success: true,
            message: 'the order is deleted'
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
        return res.status(400).send('Invalid Order id')
    }
    const order = await Order.findByIdAndUpdate(req.params.id,
        {
            status: req.body.status
        },
        {new: true}
        )
    if(!order){
        return res.status(400).send('The Order cannot be updated')
    }
    res.send(order)
})
router.get('/get/totalsales', async (req,res)=>{
    const totalSales = await Order.aggregate([
        {$group: {_id:null, totalsales: {$sum: '$totalPrice'}}}
    ])
    if(!totalSales){
        return res.status(500).json({
            success: false,
            message: 'The Order Sales cannot be generated'
        })
    } 
    res.status(200).send({
        'totalsales': totalSales.pop().totalsales
    })
})

router.get('/get/count', async (req,res)=>{
    const orderCount = await Order.countDocuments({}, { hint: "_id_" })
    if(!orderCount){
        res.status(500).json({
            success: false
        })
    } 
    res.status(200).send({
        'orderCount': orderCount
    })
})

router.get('/get/userorders/:userId', async (req,res)=>{
    const userOrderList = await Order.find({user: req.params.userId})
    .populate({
        path: 'orderItems', populate: {
            path: 'product', populate: 'category'
        }
    }).sort({'dateOrdered': -1})
    if(!userOrderList){
        res.status(500).json({
            success: false
        })
    } 
    res.status(200).send({
        'userOrderList': userOrderList
    })
})

router.delete('/wallet/:id', (req,res)=>{
    Wallet.deleteMany({user : req.params.id})
    .then( order=>{
        return res.status(200).json({
            success: true,
            message: 'the wallet is deleted'
        })
    }).catch(err=>{
        return res.status(400).json({
            success: false,
            error: err
        })
    })
})

router.patch('/review/:id', async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid user id')
    }
    // Delivered
    if(req.body.vendor_status=='Delivered'){
        const orderInfo = await Order.findById(req.params.id).select('vendor totalPrice totalPrice')
        
        const previousFund = await Wallet.find({user: req.body.user})
        let newBalance=0
        if(previousFund.length > 0){
        newBalance=previousFund[previousFund.length-1].fund + Number(orderInfo.totalPrice)
        }else{
            newBalance=orderInfo.totalPrice
        }
        // const vendorId = orderInfo.vendor
        // console.log(orderInfo)
        const newWallet = new Wallet({
            amount: orderInfo.totalPrice,
            fund:newBalance,
            status: 'Credit',
            user: orderInfo.vendor
        });
        const saveWallet = await newWallet.save()
        // console.log(saveWallet)
    }
    // console.log("Finally")
        
    const user = await Order.findByIdAndUpdate(req.params.id,
        {
            vendor_status: req.body.vendor_status
        },
        {new: true}
        )
    if(!user){
        return res.status(400).send('The Order cannot be updated')
    }
    res.send(user)
})

router.patch('/report/:id', async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid user id')
    }
    const user = await Order.findByIdAndUpdate(req.params.id,
        {
            admin_status: req.body.admin_status
        },
        {new: true}
        )
    if(!user){
        return res.status(400).send('The Order cannot be updated')
    }
    res.send(user)
})
router.patch('/change/vendor/:id', async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid user id')
    }
    const user = await Order.findByIdAndUpdate(req.params.id,
        {
            vendor: req.body.vendor
        },
        {new: true}
        )
    if(!user){
        return res.status(400).send('The Order cannot be updated')
    }
    res.send(user)
})
module.exports= router