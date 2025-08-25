const { type } = require('express/lib/response');
const mongoose = require('mongoose')

const userSchema=mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    business_name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    
    passwordHash: {
        type: String,
        required: true
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GtechState'
    },
    lga: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GtechLga'
    },
    nearest_busstop: {
        type: String,
        required: true
    },
    nearest_busstop1: {
        type: String
    },
    nearest_busstop2: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "User",
        required: true
    },
    status: {
        type: String,
        default: "Pending",
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})
userSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
userSchema.set('toJSON',{
    virtuals: true
})

exports.User =mongoose.model('GtechUser', userSchema)
exports.userSchema= userSchema;