const express = require('express')
const mongoose = require('mongoose')
const {User} = require('../models/user')
const router = express.Router();
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')
const { Wallet } = require('../models/wallet');


router.get('/', async (req,res)=>{
    const user = await User.find()
        
    if(!user){
        return res.status(400).json({
            success: false,
            message: 'Some error occur'
        })
    }
    res.status(200).send(user)
})


router.get('/:id', async (req,res)=>{
    const user  = await User.findById(req.params.id).select('name business_name email state lga nearest_busstop nearest_busstop1 nearest_busstop2 phone address dateCreated')
    .populate('lga')
    // console.log(user)
    if(!user){
        return res.status(400).json({
            success: false,
            message: 'Some error occur'
        })
    }
    res.status(200).send(user)
})

router.post('/', (req, res)=>{
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        state: req.body.state,
        lga: req.body.lga,
        nearest_busstop: req.body.nearest_busstop,
        address: req.body.address,
        role: req.body.role,
        phone: req.body.phone
    });
    newUser.save().then(()=>{
        res.status(201).send(newUser)
    }).catch((err)=>{
        res.status(400).json({success: false})
    })
    
})

router.post('/register', async (req, res)=>{

    const email = await User.find({email : req.body.email}).select('email')
    if(email.length > 0){
        return res.status(400).send('User already exist')
    }
    // console.log(email)
    const newUser = new User({
        name: req.body.name,
        business_name: req.body.business_name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        state: req.body.state,
        lga: req.body.lga,
        nearest_busstop: req.body.nearest_busstop,
        nearest_busstop1: req.body.nearest_busstop1,
        nearest_busstop2: req.body.nearest_busstop2,
        address: req.body.address,
        role: req.body.role,
        phone: req.body.phone
    });
    newUser.save().then(()=>{
        res.status(201).send(newUser)
    }).catch((err)=>{
        res.status(400).json({success: false})
    })
    // console.log(newUser)
    
})

router.post('/login', async (req, res)=>{
    const user = await User.findOne({email: req.body.email}).select('name email role passwordHash status')
    const secret= process.env.SECRET
    if(!user){
        return res.status(400).send('The User not found')
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
                name: user.name,
                status: user.status
            },
            secret,
            {expiresIn: '1d'}
        )
        res.status(200).send({user: user.email, token: token})
    } else{
        res.status(400).send('The entered password is wrong')
    }
    
    
})

router.get('/vendor/pending', async (req,res)=>{
    const new_vendors = await User.find({status:'Pending',role:'Vendor'})
    if(!new_vendors){
        res.status(500).json({
            success: false
        })
    } 
    res.status(200).send({
        'new_vendors': new_vendors
    })
})

router.get('/get/count', async (req,res)=>{
    const userCount = await User.countDocuments({}, { hint: "_id_" })
    if(!userCount){
        res.status(500).json({
            success: false
        })
    } 
    res.status(200).send({
        'userCount': userCount
    })
})

router.delete('/:id', (req,res)=>{
    User.findByIdAndRemove(req.params.id)
    .then(user=>{
        return res.status(200).json({
            success: true,
            message: 'the user is deleted'
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
        return res.status(400).send('Invalid user id')
    }
    const user = await User.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            business_name: req.body.business_name,
            email: req.body.email,
            state: req.body.state,
            lga: req.body.lga,
            nearest_busstop: req.body.nearest_busstop,
            nearest_busstop1: req.body.nearest_busstop1,
            nearest_busstop2: req.body.nearest_busstop2,
            address: req.body.address,
            phone: req.body.phone
        },
        {new: true}
        )
    if(!user){
        return res.status(400).send('The Product cannot be updated')
    }
    res.send(user)
})
router.patch('/review/:id', async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid user id')
    }
    const user = await User.findByIdAndUpdate(req.params.id,
        {
            status: req.body.status
        },
        {new: true}
        )
    if(!user){
        return res.status(400).send('The Product cannot be updated')
    }
    res.send(user)
})

module.exports= router