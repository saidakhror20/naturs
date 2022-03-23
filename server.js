const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})

process.on('uncaughtException', err=>{
    console.log(`${err.name}, ${err.message}`);
    console.log('Unhandled rejection');
    process.exit(1)

})

const app = require('./app')


mongoose.connect(process.env.DATABASE_LOCAL, {
    useUnifiedTopology: true, 
    useNewUrlParser: true 
}).then(()=> console.log('DB working'))


let server = app.listen(3000, ()=>{
    console.log('Port is running');
})

process.on('unhandledRejection', err=>{
    console.log(err);
    console.log('Unhandled rejection');
    server.close(()=>{
        process.exit(1)
    })
})

