const { type } = require('express/lib/response');
const mongoose = require('mongoose')

const orderSchema=mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    nearest_busstop: {
        type: String,
        required: true
    },
    lga: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GtechCategory'
    },
    product: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GtechUser'
    },
    phone: {
        type: String,
        required: true
    },
    vendor_status: {
        type: String,
        default: "Pending"
    },
    admin_status: {
        type: String,
        default: "Pending"
    },
    totalPrice: {
        type: Number
    },
    price: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GtechUser'
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    }
})
orderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
orderSchema.set('toJSON',{
    virtuals: true
})

exports.Order =mongoose.model('GtechOrder', orderSchema)