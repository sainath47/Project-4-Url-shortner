const urlModel = require('../urlModel')
const shortId = require('shortid')



const urlShorten = async function(req, res){

try {
    
    
    let longUrl=req.body.longUrl
    
let baseUrl = "http://localhost:3000"
  let urlCode =   shortId.generate(longUrl)
  let shortUrl = baseUrl + '/' + urlCode

  const result = {
      longUrl,shortUrl,urlCode
  }

 await urlModel.create(result)

  res.status(200).send({status:true,data:result})}
  catch(err){
    res.status(500).send({status:false,message:err.message})}
  }


  module.exports= {urlShorten}