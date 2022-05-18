const urlModel = require("../model/urlModel");
const shortId = require("shortid");
const validUrl = require("valid-url");



const redis = require('redis')
const {promisify} = require("util");
const { json } = require("body-parser");

const redisClient = redis.createClient(
  19908,
  "redis-19908.c264.ap-south-1-1.ec2.cloud.redislabs.com",
  {no_ready_check:true}
);
redisClient.auth("O6zkefoY4RLJmorPB5xjVTYlkFoFFTtI",function(err){
  if(err) throw err
})

redisClient.on("connect",async function(){
  console.log("connected to Redis..")
})


const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);



const urlShorten = async function (req, res) {
  try {
    let longUrl = req.body.longUrl;

    if (!Object.keys(req.body).length)
      return res.status(400).send({ status: false, message: "empty body" });
    if (!longUrl)
      return res.status(400).send({ status: false, message: "enter long URL" });
    if (!validUrl.isUri(longUrl))
      return res.status(400).send({ status: false, message: "invalid URL" });

    let findUrl = await urlModel.findOne({ longUrl });
    if (findUrl)
      return res
        .status(400)
        .send({ status: false, message: "already shortened", data: findUrl });

    let baseUrl = "http://localhost:3000";
    let urlCode = shortId.generate(longUrl);
    let shortUrl = baseUrl + "/" + urlCode;

    const result = {
      longUrl,
      shortUrl,
      urlCode,
    };

    await urlModel.create(result);

    res.status(201).send({ status: true, data: result });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};



const redirect = async function (req, res) {
  try {
    let urlCode = req.params.urlCode;
    if(!shortId.isValid(urlCode)) return res.status(400).send({ status: false, message: "not a valid URL code in params" });
let cacheUrl = await GET_ASYNC(`${urlCode}`)

if(cacheUrl){
  let paresedUrl=JSON.parse(cacheUrl)
  res.status(302).redirect(paresedUrl['longUrl'])
}
else{
    let findUrlDB = await urlModel.findOne({ urlCode });
    if (!findUrlDB)
      return res
        .status(404)
        .send({
          status: false,
          message: "no document found with this url code",
        });
      
      await SET_ASYNC(`${urlCode}`,JSON.stringify(findUrlDB))
      res.status(302).redirect(findUrlDB.longUrl);
      }



    
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { urlShorten, redirect };
