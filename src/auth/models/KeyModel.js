const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true, 
        unique: true
    },
    publicKey: { 
        type: String, 
        required: true 
    },
    privateKey: { 
        type: String, 
        required: true 
    }
}, { 
    timestamps: true, 
    collection: 'Keys' 
});

module.exports = mongoose.model('Key', keySchema);