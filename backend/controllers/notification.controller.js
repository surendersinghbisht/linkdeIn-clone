export const getNotifications = async (req, res) => {
    try {
        const notification = await Notification.find({recipient: req.user._id}).sort({createdAt: -1}).
        populate("relatedUser", "name userName, profilePic").
        populate("relatedPost", "content image");

        res.status(200).json(notification);
    } catch (error) {
        console.log(error, "error in notification controller");
        res.status(500).json({message:"internal server error"});
    }
}

export const readNotifications = async (req, res) => {
    const notificationId = req.params.id;
    try {
        const notification = await Notification.findByIdandUpdate({_id:notificationId ,recipient: req.user._id}, {
            read: true
        },
        {new: true}
        );
        res.status(200).json(notification);
    } catch (error) {
        console.log(error, "error in notification controller");
        res.status(500).json({message:"internal server error"});
    }
}

export const deleteNotifications = async (req,res)=> {
    const notificationId = req.params.id;
    try {
       await Notification.findOneAndDelete({
            _id:notificationId 
            ,recipient: req.user._id
        });
res.status(200).json({message: "notification deleted successfully"});
    } catch (error) {
        console.log(error, "error in notification controller");
        res.status(500).json({message:"internal server error"});
    }
}