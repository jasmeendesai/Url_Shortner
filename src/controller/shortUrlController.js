const express = require("express");
const urlModel = require("../model/urlModel"); 
const validUrl = require("valid-url");
const shortId = require("shortid");
const axios = require("axios");
const redis = require("redis");
const { promisify } = require("util");
require('dotenv').config();

const { host, password } = process.env;

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit to 10 requests per window per user
  message: {
    message: "Too many requests, please try again later",
  },
});

// app.use("/api/shorten", limiter);


// const client = redis.createClient({
//   host: host,
//   port: 18895,
//   password: password,
// });

// client.on("error", console.error);
// client.on("connect", () => console.log("Connected to Redis"));

// const setCache = promisify(client.SET).bind(client);
// const getCache = promisify(client.GET).bind(client);

//=========================================CREATE SHORT URL===============================================
const shortUrl = async (req, res) => {
  try {
    const { longUrl, customAlias, topic } = req.body; 

    const user = req.user

    if (!longUrl) {
      return res.status(400).send({ status: false, message: "Please provide a URL" });
    }

    if (!validUrl.isWebUri(longUrl)) {
      return res.status(400).send({ status: false, message: "Invalid URL" });
    }

    // Check if a custom alias is provided, if so, validate its uniqueness
    if (customAlias) {

      const aliasExists = await urlModel.findOne({ alias : customAlias });
      if (aliasExists) {
        return res.status(400).send({ status: false, message: "This custom alias is already in use" });
      }
    }

    const baseUrl = "http://localhost:3000/api/shorten/";

    // Check Redis Cache for the long URL
    // let getDataCache = await getCache(longUrl);
    // getDataCache = JSON.parse(getDataCache);

    // if (getDataCache) {
    //   return res.status(200).send({
    //     status: true,
    //     message: "URL exists in cache",
    //     data: getDataCache,
    //   });
    // }

    // Check database for the long URL
    const urlExists = await urlModel.findOne({ longUrl }, { _id: 0, __v: 0 });
    if (urlExists) {
      // await setCache(longUrl, JSON.stringify(urlExists), "EX", 86400); // Cache for 1 day
      return res.status(200).send({
        status: true,
        message: "URL exists in database",
        data: {
          shortUrl : urlExists.shortUrl,
          createdAt : urlExists.createdAt
        },
      });
    }


    // Generate short URL
    const urlCode = customAlias || shortId.generate();
    const shortUrl = `${baseUrl}${urlCode}`;


    // Create new URL record
    const data = await urlModel.create({
      longUrl,
      shortUrl,
      urlCode,
      alias: customAlias,
      userId : user.id,
      topic: topic || 'acquisition', // If no topic, default to 'general'
    });

    // Cache the new URL for future requests
    // await setCache(longUrl, JSON.stringify(data), "EX", 86400);

    

    return res.status(201).send({
      status: true,
      message: "Short URL created successfully",
      data: {
        shortUrl : data.shortUrl,
        createdAt : data.createdAt
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

//===========================REDIRECT TO ORIGINAL URL===============================================
const getUrl = async (req, res) => {
  try {
    const urlCode = req.params.urlCode;
    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip;


    // Check Redis Cache for the URL
    // let getDataCache = await getCache(urlCode);

    // if (getDataCache) {
    //   const url = JSON.parse(getDataCache);
    //   return res.status(302).redirect(url.longUrl); // Redirect to original URL
    // }

    // Check database for the URL code
    const url = await urlModel.findOne({ urlCode });


    if (!url) {
      return res.status(404).send({
        status: false,
        message: `URL not found with the code ${urlCode}`,
      });
    }

    const geoResponse = await axios.get(`http://ip-api.com/json/${ipAddress}`);
    const geoData = geoResponse.data;


    // Log analytics
    const analyticsData = {
      userAgent,
      ipAddress,
      location: {
        country: geoData.country || "Unknown",
        region: geoData.regionName || "Unknown",
        city: geoData.city || "Unknown",
        latitude: geoData.lat || null,
        longitude: geoData.lon || null,
      },
      timestamp: new Date(),
    };
    url.analytics.push(analyticsData);
    url.clicks +=1;
    await url.save();

    // Cache the URL for future requests
    // await setCache(urlCode, JSON.stringify(url), "EX", 86400);
    // Fetch geolocation data
    

    return res.status(302).redirect(url.longUrl); 
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { shortUrl, getUrl };
