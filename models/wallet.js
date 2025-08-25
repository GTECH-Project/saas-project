const mongoose = require('mongoose')

const walletSchema=mongoose.Schema({
    fund: {
        type: Number
    },
    amount: {
        type: Number
    },
    status: {
        type: String
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
walletSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
walletSchema.set('toJSON',{
    virtuals: true
})

exports.Wallet =mongoose.model('GtechWallet', walletSchema)
exports.walletSchema= walletSchema;