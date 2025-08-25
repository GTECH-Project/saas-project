const mongoose = require('mongoose')

const stateSchema=mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String
    }
})
stateSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
stateSchema.set('toJSON',{
    virtuals: true
})

exports.State =mongoose.model('GtechState', stateSchema)