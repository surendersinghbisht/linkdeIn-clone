import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        dafault: ""
    },
    bannerImg: {
        type: String,
        dafault: ""
    },
headline: {
    type: String,
    dafault: "Linkdein user"
},
about: {
    type: String,
    default: ""
},
skills:[String],
experience: {
    title: String,
    company: String,
    startDate:Date,
    endDate:Date,
    description:String
},
location: {
type: String,
default: "earth"
},
education: {
    school: String,
    degree: String,
    startYear:Number,
    endYear:Number
},
connections:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
}]
},{timestamps: true})


const User = mongoose.model("User", userSchema);

export default User;