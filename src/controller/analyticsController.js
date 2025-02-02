const moment = require("moment");
const urlModel = require('../model/urlModel');
const { shortUrl } = require("./shortUrlController");


const getAnalytics = async (req, res) => {
  try {
    const alias = req.params.alias;

    // Fetch the URL document
    const url = await urlModel.findOne({ urlCode: alias });


    if (!url) {
      return res.status(404).send({
        status: false,
        message: `No URL found with alias ${alias}`,
      });
    }

    const analytics = url.analytics || [];
    const now = moment();

    // Total clicks
    const totalClicks = url.clicks;

    // Unique users (based on unique IP addresses)
    const uniqueUsers = new Set(analytics.map((entry) => entry.ipAddress)).size;

    // Clicks by date (last 7 days)
    const recent7Days = [];
    for (let i = 0; i < 7; i++) {
      const date = now.clone().subtract(i, "days").format("YYYY-MM-DD");
      const clicks = analytics.filter((entry) =>
        moment(entry.timestamp).isSame(date, "day")
      ).length;

      recent7Days.push({ date, clicks });
    }

    // Group by OS
    const osType = analytics.reduce((acc, entry) => {
      const osName = entry.userAgent || "Unknown";
      const os = acc.find((item) => item.osName === osName);

      if (os) {
        os.uniqueClicks++;
        os.uniqueUsers.add(entry.ipAddress);
      } else {
        acc.push({ osName, uniqueClicks: 1, uniqueUsers: new Set([entry.ipAddress]) });
      }

      return acc;
    }, []).map((os) => ({
      osName: os.osName,
      uniqueClicks: os.uniqueClicks,
      uniqueUsers: os.uniqueUsers.size,
    }));

    // Group by device type (mobile/desktop)
    const deviceType = analytics.reduce((acc, entry) => {
      const deviceName = entry.userAgent.includes("Mobile") ? "Mobile" : "Desktop";
      const device = acc.find((item) => item.deviceName === deviceName);

      if (device) {
        device.uniqueClicks++;
        device.uniqueUsers.add(entry.ipAddress);
      } else {
        acc.push({
          deviceName,
          uniqueClicks: 1,
          uniqueUsers: new Set([entry.ipAddress]),
        });
      }

      return acc;
    }, []).map((device) => ({
      deviceName: device.deviceName,
      uniqueClicks: device.uniqueClicks,
      uniqueUsers: device.uniqueUsers.size,
    }));

    // Construct response
    const response = {
      totalClicks,
      uniqueUsers,
      clicksByDate: recent7Days.reverse(), // Show in chronological order
      osType,
      deviceType,
    };

    return res.status(200).send({
      status: true,
      message: "Analytics fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};


const getTopicAnalytics = async (req, res) => {
  try {
    const {topic} = req.params;

    // Fetch the URL document
    const urlData = await urlModel.find({ topic : topic });

    if (urlData.length===0) {
      return res.status(404).send({
        status: false,
        message: `No URL found with topic ${topic}`,
      });
    }

    const analytics = urlData.map((item)=> item.analytics) || [];
    const now = moment();

    
    // Total clicks
    const totalClicks = urlData.reduce((acc, curr)=> acc + curr.clicks, 0);


    // Unique users (based on unique IP addresses)
    // const uniqueUsers = new Set(analytics.map((item)=> item.map((entry) => entry.ipAddress))).size;
    const uniqueUsers = new Set(analytics.flatMap((item) => item.map((entry) => entry.ipAddress))).size;


    const recent7Days = [];
for (let i = 0; i < 7; i++) {
  const date = moment().subtract(i, "days").format("YYYY-MM-DD"); // Generate the date for each day
  const clicks = analytics.flat().filter((entry) =>
    moment(entry.timestamp).isSame(date, "day")
  ).length; 
  recent7Days.push({ date, clicks });
}



    const url = urlData.map((item)=> {
        const uniqueUsers = new Set(item.analytics.map((entry) => entry.ipAddress)).size;

        return {
            shortUrl : item.shortUrl,
            totalClicks : item.clicks,
            uniqueUsers : uniqueUsers
        }

    })

    // Construct response
    const response = {
      totalClicks,
      uniqueUsers,
      clicksByDate: recent7Days.reverse(), // Show in chronological order
      url
    };

    return res.status(200).send({
      status: true,
      message: "Analytics fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};


const getOverAllAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the URL document
    const urlData = await urlModel.find({userId});


    if (urlData.length===0) {
      return res.status(404).send({
        status: false,
        message: `No URL Data found with this user`,
      });
    }

    const analytics = urlData.map((item)=> item.analytics) || [];
    const now = moment();

    // Total clicks
    const totalClicks = urlData.reduce((acc, curr)=> acc + curr.clicks, 0);

    // Unique users (based on unique IP addresses)

    const uniqueUsers = new Set(analytics.flatMap((item) => item.map((entry) => entry.ipAddress))).size;


    // Clicks by date (last 7 days)

    const recent7Days = [];
for (let i = 0; i < 7; i++) {
  const date = moment().subtract(i, "days").format("YYYY-MM-DD"); // Generate the date for each day
  const clicks = analytics.flat().filter((entry) =>
    moment(entry.timestamp).isSame(date, "day")
  ).length; 
  recent7Days.push({ date, clicks });
}



 
    
    // Group by OS

        const osTypeData = urlData.flatMap((item)=> {
        
        const osType = item.analytics.reduce((acc, entry) => {
      const osName = entry.userAgent || "Unknown";
      const os = acc.find((ele) => ele.osName === osName);

      if (os) {
        os.uniqueClicks++;
        os.uniqueUsers.add(entry.ipAddress);
      } else {
        acc.push({ osName, uniqueClicks: 1, uniqueUsers: new Set([entry.ipAddress]) });
      }

      return acc;
    }, []);
    return osType.map((os) => ({
      osName: os.osName,
      uniqueClicks: os.uniqueClicks,
      uniqueUsers: os.uniqueUsers.size,
    }));

    })
    
  

    // Group by device type (mobile/desktop)
    const deviceTypeData = urlData.flatMap((item)=> {
      const deviceType = item.analytics.reduce((acc, entry) => {
        const deviceName = entry.userAgent.includes("Mobile") ? "Mobile" : "Desktop";
        const device = acc.find((ele) => ele.deviceName === deviceName);
  
        if (device) {
          device.uniqueClicks++;
          device.uniqueUsers.add(entry.ipAddress);
        } else {
          acc.push({
            deviceName,
            uniqueClicks: 1,
            uniqueUsers: new Set([entry.ipAddress]),
          });
        }
  
        return acc;
      }, []);

      return deviceType.map((device) => ({
        deviceName: device.deviceName,
        uniqueClicks: device.uniqueClicks,
        uniqueUsers: device.uniqueUsers.size,
      }));
    })

    

    // Construct response
    const response = {
      totalUrls : urlData.length,
      totalClicks,
      uniqueUsers,
      clicksByDate: recent7Days.reverse(), 
      osTypeData,
      deviceTypeData
    };

    return res.status(200).send({
      status: true,
      message: "Analytics fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};


module.exports = {getAnalytics, getTopicAnalytics, getOverAllAnalytics}