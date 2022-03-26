const express = require('express')
const app = express()
const rateLimit = require('express-rate-limit')
const tourRouter = require('./routes/toursRouter')
const userRouter = require('./routes/userRouter')
const AppError = require('./utils/appError')
const AppErrorHander = require('./controllers/appErrorHandler')
app.use(express.json())
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