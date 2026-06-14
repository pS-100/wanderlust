const mongoose = require("mongoose");
const {Schema }= mongoose;
const passportLocalMongoose = require("passport-local-mongoose").default;

// console.log(passportLocalMongoose);
// console.log(typeof passportLocalMongoose);

const userSchema = new mongoose.Schema({
     email: {
        type: String,
        required: true
     }
});

userSchema.plugin(passportLocalMongoose);     //username, hashinh, salting, password automatically implement

module.exports = mongoose.model("User", userSchema); 