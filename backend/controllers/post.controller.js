import Post from "../models/post.model.js"
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import Notification from "../models/notification.model.js";


export const getFeedPosts = async (req, res) => {
	try {
		const posts = await Post.find({ author: { $in: [...req.user.connections, req.user._id] } })
			.populate("author", "name userName profilePic headline")
			.populate("comments.user", "name profilePic")
			.sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		console.error("Error in getFeedPosts controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const createPost = async (req, res) => {
    try{
      
const {content, image} = req.body;
let newPost;

if(image) {
    const imageResult = await cloudinary.uploader.upload(image);
    newPost = new Post({
        author: req.user._id,
        content,
        image: imageResult.secure_url,
    })
}else{
    newPost =   new Post({
        author: req.user._id,
        content
    })
}

await newPost.save();
res.status(201).json(newPost);
    }catch(error){
console.log(error, "error in post controller")
res.status(500).json({message:"internal server error"});
    }
}

export const deletePost = async (req, res) => {
    try{
        const postId = req.params.id;
        const user = req.user._id

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message:"post not found"});
        }

        if(post.author.toString() !== user){
            return res.status(403).json({message:"Unauthorized to delete this post"});
        }

        if(post.image){
            await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0]);
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json({message:"post deleted successfully"});
}catch(error) {
console.log(error, "error in post controller")    
res.status(500).json({message:"internal server error"});
}
}

export const getPostbyId = async (req, res) => {
    try {
        const postId = req.params.id;
        const post  = await Post.findById(postId).
        populate("author", "name userName profilePic headline").
        populate("comments.user", "name userName profilePic headline");

        res.status(200).json(post);
    } catch (error) {
        console.log(error, "error in post controller");
        res.status(500).json({message:"internal server error"});
    }
}

export const createComment = async (req, res) => {
	try {
		const postId = req.params.id;
		const { content } = req.body;

		const post = await Post.findByIdAndUpdate(
			postId,
			{
				$push: { comments: { user: req.user._id, content } },
			},
			{ new: true }
		).populate("author", "name email username headline profilePicture");

		// create a notification if the comment owner is not the post owner
		if (post.author._id.toString() !== req.user._id.toString()) {
			const newNotification = new Notification({
				recipient: post.author,
				type: "comment",
				relatedUser: req.user._id,
				relatedPost: postId,
			});

			await newNotification.save();

			try {
				const postUrl = process.env.CLIENT_URL + "/post/" + postId;
				await sendCommentNotificationEmail(
					post.author.email,
					post.author.name,
					req.user.name,
					postUrl,
					content
				);
			} catch (error) {
				console.log("Error in sending comment notification email:", error);
			}
		}

		res.status(200).json(post);
	} catch (error) {
		console.error("Error in createComment controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const likePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const post = await Post.findById(postId);
		const userId = req.user._id;
		if (post.likes.includes(userId)) {
			// unlike the post
			post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
		} else {
			// like the post
			post.likes.push(userId);

			// create a notification if the post owner is not the user who liked
			if (post.author._id.toString() !== userId.toString()) {
				const newNotification = new Notification({
					recipient: post.author,
					type: "like",
					relatedUser: userId,
					relatedPost: postId,
				});

				await newNotification.save();
			}
		}

		await post.save();

		res.status(200).json(post);
	} catch (error) {
		console.error("Error in likePost controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};