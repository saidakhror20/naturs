// const fs = require('fs')
// const Tour = require('./../../models/tourModel')
// const mongoose = require('mongoose')
// const dotenv = require('dotenv')
// dotenv.config({path:'./config.env'})

// mongoose.connect(process.env.DATABASE_LOCAL, {
//     useUnifiedTopology: true, 
//     useNewUrlParser: true 
// }).then(()=> console.log('DB working'))

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))
// const importData = async () =>{
//     try{
//         console.log(tours[0]);
//         await Tour.create(tours)
//         console.log('Data imported successfully');
//     }catch(err){
//         console.log(err);
//     }
//     process.exit();
// }
// const deleteData = async () =>{
//     try{
//         await Tour.deleteMany()
//         console.log('Data deleted successfully');
//     }catch(err){
//         console.log(err);
//     }
//     process.exit();
// }

// if(process.argv[2]=== '--delete'){
//     deleteData()
// }else if(process.argv[2] === '--import'){
//     importData()
// }

const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const Tour = require('./../../models/tourModel')

mongoose.connect(process.env.DATABASE_LOCAL, {
    useUnifiedTopology: true, 
    useNewUrlParser: true 
}).then(()=> console.log('DB working'))

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))

const importData = async()=>{
    try{
        await Tour.create(tours)
        console.log('Data has been imported successfully');
    }catch(err){
        console.log(err);
    }
    process.exit()
}

const deleteData = async()=>{
    try{
        await Tour.deleteMany()
        console.log('Data has been deleted successfully');
    }catch(err){
        console.log(err);
    }
    process.exit()
}

if(process.argv[2] === '--import'){
    importData()
}else if (process.argv[2] === '--delete'){
    deleteData()
}

