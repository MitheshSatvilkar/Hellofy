const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please tell us your name!']
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email']
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false
        },
        phone:{
            type:String,
            required:[true, "Please provide your Phone number"],
            validate:[validator.isMobilePhone, 'Pleaseprovide a valid Number...']
        },
        role: {
            type: String,
            enum: ['Admin', 'Manager'],
            default: 'Customer'
        },
        active: {
            type: Boolean,
            default: true,
            select: false
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function() {
    this.password = await bcrypt.hash(this.password, 12);
})

userSchema.methods.correctPassword = async function( password, userPassword ) {
    return await bcrypt.compare(password, userPassword);
}


const User = mongoose.model('User', userSchema);
module.exports = User;