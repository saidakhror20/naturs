const AppError = require("../utils/appError")
const castError = err =>{
    return new AppError(`You have provided an invalid ID`, '400')
}
const duplicateNameError =  err =>{
    return new AppError(`You have provided duplicate name ${err.keyValue.name}`, '400')
}
const validatorError = err =>{
    let errors = Object.values(err.errors).map(el=>el.message)
    let message = `Invalid input: ${errors.join(' ')}`
    return new AppError(message, '400')
}

const sendErrorDev = (err,res)=>{
    // console.log(err.stack);
    // if(err.isOperational){
        res.status(err.statusCode).json({
            status:err.status,
            err,
            message:err.message,
            stack: err.stack,
        })
    // }else{
    //     res.status(500).json({
    //         status:'error',
    //         message:'Something went wrong'
    //     })
    // }
}
const sendErrorProd = (err, res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
    })
}



module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || '500';
    err.status = err.status || 'error';
    let error = {...err}
    if(process.env.NODE_ENV === 'development'){
        if (err.name === "CastError") error = castError(error);
        if(error.code === 11000) error = duplicateNameError(error);
        if(err.name === 'ValidationError') error = validatorError(err)
        sendErrorDev(error, res)
    }
    if(process.env.NODE_ENV === 'production'){
        sendErrorProd(error,res)
    }
    next()
}