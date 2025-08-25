const express = require('express');
const mongoose = require('mongoose')
const {Product} = require('../models/product');
const { Category } = require('../models/category');
const multer = require('multer');
const router = express.Router();

const FILE_TYPE_MAP= {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid= FILE_TYPE_MAP[file.mimetype];
        let uploadError= new Error("Invalid image type");
        if(isValid){
            uploadError=null
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const fileName= file.originalname.split(' ').join('-');
      const extension= FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  
  const uploadOptions = multer({ storage: storage })

router.get('/', async (req,res)=>{
    let filter={};
    if(req.query.categories){
        filter= {category: req.query.categories.split(',')}
    }
    const productList = await Product.find(filter).populate('category')
    res.status(200).json(productList)
})

router.get('/:id', async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid product id')
    }
    const product  = await Product.findById(req.params.id)
    
    if(!product){
        res.status(400).send({
            success: false,
            error: err
        })
    }
    res.status(200).send(product)
        
       
})

router.get('/category/:id', async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid product id')
    }
    const product  = await Product.find({category : req.params.id})
    
    if(!product){
        res.status(400).send({
            success: false,
            error: err
        })
    }
    res.status(200).send(product)   
})

router.get('/vendor/:id', async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid product id')
    }
    const product  = await Product.find({vendor : req.params.id}).select('name category price description dateCreated').populate('category')
    
    if(!product){
        res.status(400).send({
            success: false,
            error: err
        })
    }
    res.status(200).send(product)   
})

router.get('/vendor/food/:id', async (req,res)=>{
    // if(!mongoose.isValidObjectId(req.params.id)){
    //     return res.status(400).send('Invalid product id')
    // }
    const product  = await Product.find({name : req.params.id}).select('name category vendor').populate('vendor')
    .populate({path:'vendor', populate: 'lga'}) // {path: 'orderItems', populate: {path: 'product', populate: 'category'}}
    
    if(!product){
        res.status(400).send({
            success: false,
            error: err
        })
    }
    res.status(200).send(product)   
})

// uploadOptions.single('image'),
router.post('/',  async(req, res)=>{
    if(!mongoose.isValidObjectId(req.body.category)){
        return res.status(400).send('Invalid Category Id')
    }
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')
    // const file= req.file;
    // if(!file) return res.status(400).send('No image in the request')

    // const fileName= req.file.filename
    // const basePath= `${req.protocol}://${req.get('host')}/public/uploads/`

    const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        vendor: req.body.vendor

    });
    newProduct.save().then(()=>{
        res.status(201).send(newProduct)
    }).catch((err)=>{
        res.status(400).json({success: false})
    })
    console.log(newProduct)
    
})

router.delete('/:id', (req,res)=>{
    Product.findByIdAndRemove(req.params.id)
    .then(poduct=>{
        return res.status(200).json({
            success: true,
            message: 'the product is deleted'
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
        return res.status(400).send('Invalid product id')
    }
    if(!mongoose.isValidObjectId(req.body.category)){
        return res.status(400).send('Invalid Category Id')
    }
    const categorys = await Category.findById(req.body.category)
    if(!categorys){
        return res.status(400).send('Invalid Category')
    }
    
    const product = await Product.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        },
        {new: true}
        )
    if(!product){
        return res.status(400).send('The Product cannot be updated')
    }
    res.send(product)
})
router.get('/get/count', async (req,res)=>{
    const productCount = await Product.countDocuments({}, { hint: "_id_" })
    if(!productCount){
        res.status(500).json({
            success: false
        })
    } 
    res.status(200).send({
        'productCount': productCount
    })
})
router.get('/get/featured', async (req,res)=>{
    const products = await Product.find({isFeatured: true}).select('name description isFeatured richDescription image images brand price')
    if(!products){
        res.status(500).json({
            success: false
        })
    } 
    res.send(products)
})
router.get('/get/bestselling', async (req,res)=>{
    const products = await Product.find({richDescription: 'Best Selling'}).select('name description isFeatured richDescription image images brand price')
    if(!products){
        res.status(500).json({
            success: false
        })
    } 
    res.send(products)
})
router.get('/get/featured/:count', async (req,res)=>{
    const count = req.params.count? req.params.count: 0
    
    const products = await Product.find({isFeatured: true}).limit(+count).select('name description isFeatured richDescription image images brand price')
    if(!products){
        res.status(500).json({
            success: false
        })
    } 
    res.send(products)
})

router.put('/gallary-image/:id', uploadOptions.array('images',10), async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid product id')
    }
    const files= req.files
    let imagesPath=[]
    const basePath= `${req.protocol}://${req.get('host')}/public/uploads/`
    if(files){
        files.map(file=>{
            imagesPath.push(`${basePath}${file.filename}`)
        })
    }
    const product = await Product.findByIdAndUpdate(req.params.id,
        {
            
            images: imagesPath
        },
        {new: true}
        )
    if(!product){
        return res.status(400).send('The Product cannot be updated')
    }
    res.send(product) 
})
module.exports= router