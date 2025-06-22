const mongoose = require('mongoose');
const Review = require('./reviews.js');
const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: String,
        url : String,
    },
    price: Number,
    location: String,
    country: String,
    reviews : [
        {
           type:Schema.Types.ObjectId,
           ref : "Review"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    Geolocation : {
        type:{
        type : String,
        enum:["point"],
        required : true,
        default: 'point'
        },
        coordinates:{
            type:[Number],
            required : true,
        }
    }
})

listingSchema.post('findOneAndDelete',async(listing) => {
     await Review.deleteMany({_id : {$in:listing.reviews}});
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;