const mongoose = require('mongoose');


const JobSchema = mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Missing company'],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, 'Please provide position'],
        maxlength: 100,
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: [true, 'Please provide user'],
    }
}, {timestamps: true})


module.exports = mongoose.model('Job', JobSchema);

