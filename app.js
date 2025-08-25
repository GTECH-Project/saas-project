const express = require('express');
const app = express();
const bodyParser= require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

const productRouter = require('./routers/products')
const categoryRouter = require('./routers/categories')
const orderRouter = require('./routers/orders')
const orderItemRouter = require('./routers/orderItems')
const userRouter = require('./routers/users')
const fundRouter = require('./routers/funds')
const locationRouter = require('./routers/location')
const complaintRouter = require('./routers/complaints')
const authJwt= require('./helpers/jwt')
var path = require ('path');
const errorHandler= require('./helpers/error-handler')
require('dotenv/config')




const api= process.env.API_URL
app.use(cors());
app.options('*',cors())
//middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(express.static(path.join(__dirname + "/browser")));
app.use(authJwt());
// app.use('/public/uploads', express.static(__dirname+'/public/uploads'));
// app.use(express.static(path.join(__dirname + "/browser")));
app.use(errorHandler);


app.use(`${api}/product`, productRouter)
app.use(`${api}/category`, categoryRouter)
app.use(`${api}/order`, orderRouter)
app.use(`${api}/orderItem`, orderItemRouter)
app.use(`${api}/user`, userRouter)
app.use(`${api}/fund`, fundRouter)
app.use(`${api}/location`, locationRouter)
app.use(`${api}/complaint`, complaintRouter)




mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log('Database connected Successfully !!')
}).catch((err)=>{
    console.log(err)
});

// const connection = mongoose.connection

app.listen(3000, ()=>{
    console.log('The server is running on https://localhost:3000')
})

// connection.once('open', ()=>{
//     console.log('MongoDB Connected !!.....')
// })