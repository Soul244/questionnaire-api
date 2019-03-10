const mongoose = require('mongoose');

exports.CreatePostObject = (obj) => {
    let postObject = {};
    postObject["_id"] = new mongoose.Types.ObjectId();
    for (const [key, value] of Object.entries(obj)) {
      postObject[key] = value;
    }
    return postObject;
}