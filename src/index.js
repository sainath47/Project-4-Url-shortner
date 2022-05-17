const express = require('express')
const mongoose = require('mongoose')
const bodyParser=require('body-parser')
const app = express()
const route = require('../src/route')

mongoose.connect('mongodb+srv://functionup-uranium-cohort:q8znVj4ly0Fp0mpU@cluster0.0wdvo.mongodb.net/group9Database',
{
    useNewUrlParser
})
.then(()=>console.log('CONNECTION ESTABLISHED'))
.catch(error=>console.log(error.message))

app.use('/',route)


app.listen(3000,function(){
    console.log('SERVER RUNNING ON PORT'+3000)
})