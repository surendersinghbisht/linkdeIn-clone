import User from "../models/user.model.js"
import bcrypt from "bcrypt";
import  jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    try {
      const { name, userName, email, password } = req.body;
  
      // Check if all fields are provided
      if (!name || !userName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Check if email already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      // Password validation
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create the user
      const user = new User({
        name,
        userName,
        email,
        password: hashedPassword
      });
  
      // Save the user to the database
      await user.save();
  
      // Generate JWT token after the user is saved
      const token = jwt.sign(
        { user_id: user._id },
        process.env.SECRET_KEY,
        { expiresIn: "3d" }
      );
  
      // Set JWT token in cookies
      res.cookie("jwt-linkdein", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
  
      // Send success response
      res.status(201).json({ message: "User created successfully" });
  
    } catch (error) {
      console.log(error, "error in signup");
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

export const login = async (req, res)=>{
    try{
       const { userName, password} = req.body;
      const user = await User.findOne({userName});
      if(!user){
        return res.status(404).json({message: "User not found"});
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
        res.status(401).json({message: "Invalid credentials"});
      }

      const token = jwt.sign({user_id: user.id}, process.env.SECRET_KEY, {expiresIn:"3d"});
      res.cookie("jwt-linkdein",token, {
        httpOnly: true,
        maxage: 3 * 24 * 60 * 60 * 1000,
        samesite: "strict",
        secure: process.env.NODE_ENV === "production",  
      })
res.json({message: "User logged in successfully"});

    }catch(error){
        console.error(error,"error in login");
        res.status(500).json({message:"something went wrong"});
    }
   
    }

    export const logout = (req, res)=>{
        res.clearCookie("jwt-linkdein");
        res.status(200).json({message: "User logged out successfully"});
        }


        export const getCurrentUser = async(req, res)=>{ 
            try {
res.json(req.user)
            }catch(error){
console.log(error,"error in get current user");
res.status(500).json({message:"something went wrong"});
            }
        }