const mongoose = require('mongoose')

const complaintSchema=mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GtechUser'
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GtechOrder'
    },
    details: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Pending"
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})
complaintSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
complaintSchema.set('toJSON',{
    virtuals: true
})

exports.Complaint =mongoose.model('GtechComplaint', complaintSchema)