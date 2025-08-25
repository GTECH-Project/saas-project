const mongoose = require('mongoose')

const fundSchema=mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GtechUser'
    },
    amount: {
        type: Number,
        default: 0
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})
fundSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
fundSchema.set('toJSON',{
    virtuals: true
})

exports.Fund =mongoose.model('GtechFund', fundSchema)