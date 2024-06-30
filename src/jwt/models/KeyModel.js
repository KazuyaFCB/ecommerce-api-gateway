const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true, 
        unique: true
    },
    privateKey: { 
        type: String, 
        required: true 
    },
    publicKey: { 
        type: String, 
        // only need for RS256, no need for HS256
    }
}, { 
    timestamps: true, 
    collection: 'Keys' 
});

module.exports = mongoose.model('Key', keySchema);