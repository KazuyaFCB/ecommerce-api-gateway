//!dmbg
const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum: ['verified', 'not verified', 'blocked'],
        default: 'not verified',
    },
    roles: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    // collation: 'Users',
    collection: 'Users'
});

//Export the model
module.exports = mongoose.model('User', userSchema);