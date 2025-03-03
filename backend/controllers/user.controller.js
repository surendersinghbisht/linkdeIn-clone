import User from "../models/user.model.js"

export const getSugggestedConnection = async (req, res)=> {

    try{
const currentUser = await User.findById(req.user._id).select("connections");

const suggestedUsers = await User.find({
    _id: {
    $ne: currentUser._id,
    $nin: currentUser.connections || []
},  
}).select("name userName profilePic headline").
limit(3);  

res.json(suggestedUsers);
    }catch(error){
console.log(error,"error in get suggested connection");
res.status(500).json({message:"internal server error"});
    }
}

export const getPublicProfile = async (req, res)=> {
    try {

    const user = await User.findOne({userName: req.params.userName}).select("-password");

    if(!user){
        console.log("user not found");
        return res.status(404).json({message: "User not found"});
    }
res.json(user);
    }catch(error) {
console.log(error,"error in get public profile");
res.status(500).json({message:"internal server error"});
    }
}

export const updateProfile = async (req, res) => {
    try{
const allowedFields = [
    "name",
    "userName",
    "headline",
    "location",
    "profilePic",
    "bannerImg",
    "about",
    "experience",
    "education",
    "skills",
]

const updatedFields = {};

for(const field of allowedFields) {
    if(req.body[field]){
        updatedFields[field] = req.body[field];
    }
}

const user = await User.findByIdAndUpdate(req.user._id, {$set: updatedFields}, {new: true}).select("-password");

//todo updating profile profilePic and bannerPic which is going to be uploaded in cloudinary

if(req.body.profilePic){
    const result = await cloudinary.uploader.upload(req.body.profilePic);
    updatedFields.profilePic = result.secure_url;
}


if(req.body.bannerImg){
    const result = await cloudinary.uploader.upload(req.body.bannerImg);
    updatedFields.bannerImg = result.secure_url;
}

res.json(user);
    }catch(error){  
console.log(error,"error in update profile");
return res.status(500).json({message:"internal server error"});
    }
}
