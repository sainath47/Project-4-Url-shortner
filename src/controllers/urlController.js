const urlModel = require('../urlModel')
const shortId = require('shortid')
const validUrl = require('valid-url')


const urlShorten = async function(req, res){

try {
    
    let longUrl=req.body.longUrl


    if(!Object.keys(req.body).length) return res.status(400).send({status:false,message: "empty body"})
    if(!longUrl)return res.status(400).send({status:false,message: "enter long URL"})
    if(!validUrl.isUri(longUrl)) return res.status(400).send({status:false,message: "invalid URL"})

    
let findUrl = await urlModel.findOne({longUrl})
if(findUrl)return res.status(400).send({status:false,message: "already shortened"})
    
let baseUrl = "http://localhost:3000"
  let urlCode =   shortId.generate(longUrl)
  let shortUrl = baseUrl + '/' + urlCode

  const result = {
      longUrl,shortUrl,urlCode
  }

 await urlModel.create(result)

  res.status(201).send({status:true,data:result})}
  catch(err){
    res.status(500).send({status:false,message:err.message})}
  }


  const redirect = async function(req,res){

try { let urlCode =  req.params.urlCode
   
    let findUrl = await urlModel.findOne({urlCode})
    if(!findUrl) return res.status(404).send({status:false,message: "no document found with this url code"})

    res.status(302).redirect(findUrl.longUrl)}
catch(err){
  res.status(500).send({status:false,message:err.message})
}
    

  }

  module.exports= {urlShorten,redirect}