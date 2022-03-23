const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')
const tourSchema = mongoose.Schema({
    // Schema type options
    name:{
        type:String,
        required:[true, 'A tour must have name'],
        unique:[true, 'This name was used before'],
        minlength:[10, 'A minimum of 10 characters are needed'],
        maxlength:[40, 'A maximum of 40 characters are needed'],
    },
    duration:{
        type:Number,
        required:[true, 'A tour must have duration'],
    },
    maxGroupSize:{
        type:Number,
        required:[true, 'A tour must have a group size'],
    },
    difficulty:{
        type:String,
        required:[true, 'A tour must have a difficulty'],
        enum:{
            values:['easy', 'medium', 'difficult'],
            message:'difficulty must be "easy","difficult" or "medium"'
        }
    },

    ratingAverage:{
        type:Number,
        default:4.5,
        max:[5.0, 'Rating must be no more than 5.0'],
        min:[1.0, 'Rating must be no less than 1.0']
    },
    ratingQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true, 'A tour must have a price']
    },

    priceDiscount:{
        type:Number,
        validate:{
            validator:function(val){
                // this key word works only when creating a new document not in updating
                return val < this.price
            },
            message:`The discount ({VALUE}) has to be below the price`
        }

    },
    summary:{
        type:String,
        // required:[true, 'A tour must have a summary']
    },
    description:{
        type:String,
        // required:[true, 'A tour must have a description']
    },
    imageCover:{
        type:String,
        required:[true, 'A tour must have an image cover']
    },
    images:[String],
    createdAt :{
        type:Date,
        default:Date.now(),
        select: false //later we'll see
    },
    startDates:[Date],
    slug:String,
    secretTour:{
        type:Boolean,
        default:false
    }
}, {
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7
})




// DOCUMENT middleware - save() // create()
tourSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true})
    next()
})

// tourSchema.post('save',function(doc, next){
//     console.log(doc);
//     next()
// })


// // QUERY middleware
// findOne, find, findMany
tourSchema.pre(/^find/, function(next){
    this.find({secretTour:{$ne:true}})
    next()
})

// tourSchema.post(/^find/, function(doc, next){
//     console.log(doc);
//     next()
// })

// DOCUMENT, QUERY
// MODEL, AGGREGATE

tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({$match:{secretTour:{$ne:true}}})
    next()
})

const Tour = mongoose.model('Tour', tourSchema)
module.exports = Tour;
/*
VALIDATORS

STRING validators, maxlength:[40, "errorMessage"]
STRING validators, minlength:[10, "errorMessage"]


DATE/NUMBER validators, max:[5.0, "errorMessage"]
DATE/NUMBER validators, min:[1.0, "errorMessage"]

STRING allowed option values validators, 
enum:{
    values: ['easy', 'difficult', 'medium']
    message:"Error message"
    }

CUSTOM VALIDATOR 
priceDiscount:{
    type:Number,
    validate:function(val){
        this = current object,
        val = current valuse of price discount
    }

}

VALIDATOR LIBRARY

*/