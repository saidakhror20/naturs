const {promisify} = require('util')
const User = require('./../models/userModel')
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const sendEmail = require('./../utils/email');
const crypto = require('crypto')

const createToken = id =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user,statusCode, res)=>{
    const token = createToken(user._id)
        res.status(statusCode).json({
            status:'success',
            token,
            user   
        })
}
exports.signup = catchAsync(
    async (req,res,next)=>{
        let newUser = await User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm,
            passwordChangedAt : req.body.passwordChangedAt,
            role:req.body.role
        });
        createSendToken(newUser, 201, res)
    }
)

exports.login = catchAsync(
    async(req,res,next)=>{
        const {email,password} = req.body;
        if(!email||!password){
            return next(new AppError('Please provide both email and password', 400))
        }
        const user = await User.findOne({email}).select('+password');
        if(!user || !(await user.correctPassword(password, user.password))){
            return next(new AppError('Invalid email or password', 401))
        }
        createSendToken(user, 200, res)
    }
)

exports.protect = catchAsync(
    async(req,res,next)=>{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1]
        }
        if(!token){
            return next(new AppError('You are not authorized', 401))
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const freshUser = await User.findById(decoded.id)
        if(!freshUser){
            return next(new AppError('This user no longer exists', 401))
        }
        if(freshUser.changedPasswordAfter(decoded.iat)){
            return next(new AppError('Password changed. Please log in again', 401))
        }
        req.user = freshUser;
        next()
    }
)

exports.restrictTo = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('Not allowed', 403))
        }
        next()
    }
}

exports.forgotPassword = catchAsync(
    async (req,res,next)=>{
        // get user based on post email
        const user = await User.findOne({email:req.body.email});
        if(!user) return next(new AppError('User with this email does not exist', 404));
        const resetToken = user.changePasswordToken();
        // const users = await User.find()
        // console.log(users);
        await user.save({validateBeforeSave:false})
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
        const message = `If  you have forgotten your password go to this URL ${resetUrl} and send a new Password with password confirm`  
        //   !Warning mailtrap not working
        // try{
        //     console.log(6);
        //     await sendEmail({
        //         email:user.email,
        //         subject:'Password reset token (valid for 10 mins)',
        //         message
        //     })
        //     res.status(200).json({
        //         status:"success",
        //         message:"Token sent to email"
        //     })
        //     console.log(7);
        // }catch(err){
        //     user.passwordResetToken = undefined;
        //     user.passwordResetTokenExpiresAt = undefined;
        //     await user.save({validateBeforeSave:false})
        //     return next(new AppError('There was error in sending email. Try again later', 500))
        // }
        res.status(200).json({
            resetToken,
            resetUrl,
            message
        })
    }
)

exports.resetPassword = catchAsync(
    async(req,res,next)=>{
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
        // get user based on the token
        const user = await User.findOne({passwordResetToken:hashedToken})
        // set new password if token is valid and user
        if(!user){
            return next(new AppError('The token is not valid or has expired', 400))
        }
        // update the changed password at property for current user
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiresAt = undefined;
        await user.save();
        // log user in
        createSendToken(user, 200, res)
    }
)

exports.updatePassword = catchAsync(
    async(req,res,next)=>{
        // get user from collection
        const user = await User.findById(req.user.id).select('+password')
        // await user.correctPassword(req.body.passwordCurrent, user.password)
        // await user.correctPassword(req.body.passwordCurrent, user.password)
        if(!(await user.correctPassword(`${req.body.passwordCurrent}`, user.password))){
            return next(new AppError('Password is incorrect', 401))
        }
        // check is POST password is correct
        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm
        user.save()
        // update password

        // send user
        createSendToken(user, 200, res)
    }
)
