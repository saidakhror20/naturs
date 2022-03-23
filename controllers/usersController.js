const User = require('./../models/userModel')

exports.addUser = async (req,res)=>{
    try{
        const newUser = await User.create(req.body)
        res.status(201).json({
            status:"success",
            data:{
                newUser
            }
        })
    }catch(err){
        res.status(400).json({
            status:'fail',
            message: err
        })
    }
}
exports.getUsers = async (req,res)=>{
    try{
        const users = await User.find()
        if(users.length === 0) throw Error()
        res.status(201).json({
            status:"success",
            data:{
                users
            }
        })
    }catch(err){
        res.status(400).json({
            status:'fail',
            message: err
        })
    }
}
exports.getUser = async (req,res)=>{
    try{
        const newUser = await User.findById(req.params.id)
        res.status(201).json({
            status:"success",
            data:{
                newUser
            }
        })
    }catch(err){
        res.status(400).json({
            status:'fail',
            message: err
        })
    }
}

exports.updateUser = async (req,res)=>{
    try{
        const newUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            runValidators:true, 
            new:true
        })
        res.status(201).json({
            status:"success",
            data:{
                newUser
            }
        })
    }catch(err){
        res.status(400).json({
            status:'fail',
            message: err
        })
    }
}
exports.deleteUser = async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status:"success",
            data:null            
        })
    }catch(err){
        res.status(400).json({
            status:'fail',
            message: err
        })
    }
}