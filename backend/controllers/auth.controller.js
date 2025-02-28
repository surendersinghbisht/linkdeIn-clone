import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
	try {
		const { name, userName, email, password } = req.body;

		if (!name || !userName || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ message: "Email already exists" });
		}

		const existingUsername = await User.findOne({ userName });
		if (existingUsername) {
			return res.status(400).json({ message: "Username already exists" });
		}

		if (password.length < 6) {
			return res.status(400).json({ message: "Password must be at least 6 characters" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = new User({
			name,
			email,
			password: hashedPassword,
			userName,
		});

		await user.save();

		const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "3d" });

		res.cookie("jwt-linkedin", token, {
			httpOnly: true, // prevent XSS attack
			maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
			sameSite: "strict", // prevent CSRF attacks
			secure: process.env.NODE_ENV === "production", // prevents MITM attacks
		});

		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		console.log("Error in signup: ", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const login = async (req, res) => {
	try {
		const { userName, password } = req.body;
		console.log(userName, password);
		const user = await User.findOne({ userName });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: "3d" });

		// ✅ Fix cookie name and `maxAge`
		res.cookie("jwt-linkedin", token, {
			httpOnly: true,
			maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
			sameSite: "strict",
			secure: process.env.NODE_ENV === "production",
		});

		res.json({ message: "User logged in successfully" });
	} catch (error) {
		console.error("Error in login: ", error.message);
		res.status(500).json({ message: "Something went wrong" });
	}
};

export const logout = (req, res) => {
	res.clearCookie("jwt-linkedin");
	res.status(200).json({ message: "User logged out successfully" });
};

export const getCurrentUser = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		res.json(req.user);
	} catch (error) {
		console.log("Error in getCurrentUser: ", error.message);
		res.status(500).json({ message: "Something went wrong" });
	}
};
