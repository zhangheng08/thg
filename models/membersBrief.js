const mongoose = require('mongoose');

const MemberBriefSchema = mongoose.Schema({
    id: String,
    active: Boolean,
    avatar:String,
    brief:String,
    enrolledYear:Number,
    name:String,
    position:String

});

const MemberBriefList = module.exports = mongoose.model('membersBrief', MemberBriefSchema);

module.exports.getAllBriefList = (callback) => {
    MemberBriefList.find(callback).sort({enrolledYear : 1});
}

module.exports.addList = (newList, callback) => {

    let query = {id: newList.id};

    MemberBriefList.find(query, function(err, arr){

        if(arr.length == 0)  newList.save(callback);
        else {

            var notContaine = true;

            for(var i = 0; i < arr.length; i ++) {

                if(arr[i].id === newList.id) {
                    notContaine = false;
                    break;
                }

            }

            if(notContaine) {

                newList.save();

            }

        }

    });

}

module.exports.findBriefById = (id, callback) => {

    MemberBriefList.findById(id, callback);

};

module.exports.updateById = (id, options, callback) => {

    MemberBriefList.find({id: id}, function(err, arr){

        var _id = '';

        for(var i = 0; i < arr.length; i ++) {

            if(arr[i].id === id) {
                _id = arr[i]._id;
                var obj = options;
                MemberBriefList.findByIdAndUpdate(_id, obj, callback);
                break;
            }

        }

    });

};
