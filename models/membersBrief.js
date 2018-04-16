const mongoose = require('mongoose');

const MemberBriefSchema = mongoose.Schema({
    active: Boolean,
    avatar:String,
    brief:String,
    enrolledYear:String,
    name:String,
    position:String

});

const MemberBriefList = module.exports = mongoose.model('membersBrief', MemberBriefSchema);

module.exports.getAllBriefList = (callback) => {
    MemberBriefList.find(callback);
}

module.exports.addList = (newList, callback) => {
    newList.save(callback);
}

module.exports.findBriefById = (id, callback) => {

    MemberBriefList.findById(id, callback);

};
