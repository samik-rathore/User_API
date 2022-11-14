const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
});

module.exports = mongoose.model('Users',userSchema);