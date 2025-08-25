const mongoose = require('mongoose')

const lgaSchema=mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GtechState',
        required: true
    },
    status: {
        type: String
    }
})
lgaSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
lgaSchema.set('toJSON',{
    virtuals: true
})

exports.Lga =mongoose.model('GtechLga', lgaSchema)