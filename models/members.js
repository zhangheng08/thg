const mongoose = require('mongoose');

//Define BucketlistSchema with title, description and category
const MemberSchema = mongoose.Schema({

    active: Boolean,
    address: String,
    avatar:String,
    brief:String,
    chineseName:String,
    cv:String,
    email:String,
    enrolledYear:Number,
    firstName:String,
    introduction:String,
    lastName:String,
    mobile:String,
    name:String,
    position:String,
    publications:[
        {
            json:Object
        }]

});

const MemberList = module.exports = mongoose.model('members', MemberSchema);

//MemberList.find() returns all the lists
module.exports.getAllLists = (callback) => {
    MemberList.find(callback).sort({enrolledYear : 1});
}


module.exports.findMemberById = (id, callback) => {

    MemberList.findById(id, callback);

};

module.exports.findMemberByEmail = (eml, callback) => {

    MemberList.find({email:eml}, callback);

};

module.exports.findAndUpdate = (id, options, callback) => {

    MemberList.findById(id, function(err, member){

        var arr = member.publications;

        if(arr == null || arr == undefined) arr = [];

        var obj = {json:options};

        arr.push(obj);

        MemberList.findByIdAndUpdate(id, {publications:arr}, callback);

    });

};

module.exports.updateById = (id, options, callback) => {

    MemberList.findById(id, function(err, member){

        var obj = options;
        MemberList.findByIdAndUpdate(id, obj, callback);

    });

};

//newList.save is used to insert the document into MongoDB
module.exports.addList = (newList, callback) => {
    newList.save(callback);
}

//Here we need to pass an id parameter to BUcketList.remove
module.exports.deleteListById = (id, callback) => {
    let query = {_id: id};
    MemberList.remove(query, callback);
}

//Here we need to pass an id parameter to BUcketList.remove
module.exports.deletePublicationById = (id, pid, callback) => {

    MemberList.findById(id, function(err, member){

        var arr = member.publications;

        if(arr == null || arr == undefined) arr = [];

        for(var i = 0; i < arr.length; i ++) {

            if(pid != arr[i]._id) continue;

            arr.splice(i,1);

            break;

        }

        MemberList.findByIdAndUpdate(id, {publications:arr}, callback);

    });

}