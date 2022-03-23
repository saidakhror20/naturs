const crypto = require('crypto')
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, 'User needs to have name'],
        unique:true
    },   
    role:{
        type:String,
        enum:['user', 'admin', 'guide', 'lead-guide'],
        default:'user'
    },
    
    photo:String,
    email:{
        type:String,
        required:[true, 'User needs to have email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail, 'Email must contain @ . com']
    },
    password:{
        type:String,
        required:[true, 'User needs to have password'],
        minlength: [8, 'A minimum of 8 chars are required'],
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true, 'Confirm your password'],
        validate:{
            // works only on save and create
            validator:function(val){
                return val === this.password
            },
            message:'Password and confirm have to be the same'
        }
    },
    passwordChangedAt : Date,
    role:String,
    passwordResetToken: String,
    passwordResetTokenExpiresAt: Date
});

// DOCUMENT MIDDLEWARE
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined;
    next();
})

userSchema.pre('save', function(next){
    if(!this.isModified('password')&& this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next()
})

userSchema.methods.correctPassword =  async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function(tokenTimestamp){
    if(this.passwordChangedAt){
        const changedPasswordTime = parseInt(this.passwordChangedAt.getTime()/1000);
        return tokenTimestamp < changedPasswordTime
    }
    return false
}

userSchema.methods.changePasswordToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000
    return resetToken
}

const User = mongoose.model('User', userSchema);

module.exports = User;