const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const initData = require('./data.js');
const axios = require('axios');

main().
then(res => {console.log('connection successful')})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const geocode = async (location) => {
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: location,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "wanderlust-app" // Required by Nominatim usage policy
      }
    });

    if (res.data && res.data.length > 0) {
      const { lat, lon } = res.data[0];
      return {
        type: "point",
        coordinates: [parseFloat(lon), parseFloat(lat)],
      };
    } else {
      console.log("No geocode found for:", location);
      return null;
    }
  } catch (err) {
    console.error("Error geocoding:", location, err);
    return null;
  }
};

const initDB = async() => {
    try{
        await Listing.deleteMany({});
        const updatedData = [];

        for (let obj of initData.data) {
            const geo = await geocode(obj.location);
            if (geo) {
                obj.Geolocation = geo;
             } else {
                // Set default coordinates or skip
                obj.Geolocation = {
                type: "point",
                coordinates: [0, 0], // fallback coordinates
                 };
             }

      obj.owner = "684f8e0b93e77a1e06d00dd6"; // add owner
      updatedData.push(obj);

    }
        await Listing.insertMany(initData.data);
        //console.log(updatedData);
        console.log('data inserted successfully');
    }catch(err){
        console.log(err);
    }
}

initDB();
