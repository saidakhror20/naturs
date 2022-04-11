const express = require('express')
const app = express()
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require("hpp")
const tourRouter = require('./routes/toursRouter')
const userRouter = require('./routes/userRouter')
const AppError = require('./utils/appError')
const AppErrorHander = require('./controllers/appErrorHandler')
// HTTP
app.use(helmet())
// BODY PARSER
app.use(express.json({
    limit:'10kb'
}))
// SANITIZE BODY AND PARAMS against noSQL query injection
app.use(mongoSanitize());
app.use(xss())
// Prevent parametre pollution
app.use(hpp({
    whitelist:['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize']
}))

// STATIC files
app.use(express.static(`${__dirname}/public`))


//   
app.use((req, res, next)=>{
    req.currentTime = new Date().toISOString()
    next()
})

const limiter = rateLimit({
    max:100,
    windowMs: 60 * 60 * 1000,
    message:"Too many requests, try later"
})
app.use('/api',limiter)


app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req,res,next)=>{    
    next(new AppError(`Path ${req.originalUrl} not found`, '404'))
})

app.use(AppErrorHander)







// app.all('*', (req,res,next)=>{
//     next(new AppError(`Cannot get the ${req.originalUrl} route`, '404'))
// })

// app.use(AppErrorHander)
module.exports = app;