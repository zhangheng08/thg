const mongoose = require('mongoose');

//Define BucketlistSchema with title, description and category
const PublicationSchema = mongoose.Schema({

    author:String,
    pdf:String

});

const PublicationList = module.exports = mongoose.model('publication', PublicationSchema);