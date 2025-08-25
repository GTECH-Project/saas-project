const mongoose = require('mongoose')

const locationSchema=mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lga: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GtechLga',
        required: true
    },
    status: {
        type: String
    }
})
locationSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
locationSchema.set('toJSON',{
    virtuals: true
})

exports.Location =mongoose.model('GtechLocation', locationSchema)