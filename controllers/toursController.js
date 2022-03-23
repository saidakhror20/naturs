const catchAsync = require('../utils/catchAsync');
const Tour = require('./../models/tourModel')
const APIfeatures = require('./../utils/apiFeatures')
const AppError = require('./../utils/appError')
exports.aliasTopCheapest = (req,res,next)=>{
    req.query.limit = '5'
    req.query.sort = 'price';
    req.query.fields = 'name,price,ratingAverage,difficulty';
    next()
}
exports.aliasTopTours = (req,res,next)=>{
    req.query.limit = '5'
    req.query.sort = '-ratingAverage';
    req.query.fields = 'name,price,ratingAverage,difficulty';
    next()
}



exports.getAllTours = catchAsync(
    async (req,res,next)=>{
        const features = new APIfeatures(Tour.find(), req.query).filter().sort().limitFields().paginate()
        const tours = await features.query;

        res.status(201).json({
            status:"success",
            results: tours.length,
            data:{
                tours
            }
        })
    }
)

exports.getTour = catchAsync(
    async (req,res,next)=>{
        const tour = await Tour.findById(req.params.id)
        if(!tour){
           return next(new AppError('This data was not found', 404))
        }
        res.status(201).json({
            status:"success",
            data:{
                tour
            }
        })
    }
)

exports.addTour = catchAsync(
    async (req,res, next)=>{
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status:"success",
            data:{
                newTour
            }
        })
    }
)

exports.updateTour = catchAsync(
    async (req,res,next)=>{
        const newTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new:true, // yangilangan obyektni return qila
            runValidators:true // Schema bilan solishtiradi
        })
        res.status(201).json({
            status:"success",
            data:{
                newTour
            }
        })
    }
)

exports.deleteTour = catchAsync(
    async (req,res,next)=>{
        await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status:"success",
            data:null
        })
    }
)

exports.getTourStats = catchAsync(
    async (req,res,next)=>{
        const stats = await Tour.aggregate([
            // STAGE 1 - Filter
            {
                $match:{
                    ratingAverage:{$gte:4.5}
                }
            },

            // STAGE 2 - Grouping
            {
                $group:{
                    _id:'$difficulty',
                    numTours:{$sum:1},
                    minPrice:{$min:'$price'},
                    maxPrice:{$max:'$price'},
                    avgPrice:{$avg:'$price'},
                    avgRating:{$avg:'$ratingAverage'}
                }
            },
            // STAGE 3
            {
                $sort:{
                    avgRating:-1
                }
            },
        ])
        res.status(200).json({
            status:"success",
            results:stats.length,
            data:{
                stats
            }
        })
    }
)

exports.getMonthlyPlan = catchAsync(
    async (req,res,next)=>{
        const year = +req.params.year;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },           
            { 
                $match:{      
                        startDates:{
                            $gte:new Date(`${year}-01-01`),
                            $lte:new Date(`${year}-12-31`)
                        }
                    }
            },
            {
                $group:{
                    _id:{$month:'$startDates'},
                    numTourStarts:{$sum:1},
                    tours:{$push:'$name'},
                }
            },
            {
                $addFields:{
                    month:'$_id'
                }
            },
            {
                $project:{'_id':0}
            },
            {
                $sort:{
                    numTourStarts:-1
                }
            }
            
        ])
        res.status(200).json({
            status:"success",
            results:plan.length,
            data:plan
        })
    }
)
exports.resetPassword = (req,res, next)=>{
    
}

