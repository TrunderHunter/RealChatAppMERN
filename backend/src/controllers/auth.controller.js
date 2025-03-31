import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { uploadImage } from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }
    if (password.includes(" ")) {
      return res
        .status(400)
        .json({ message: "Password must not contain spaces" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ fullName, email, password: hashedPassword });
    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        token: generateToken(newUser._id, res),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  if (password.includes(" ")) {
    return res
      .status(400)
      .json({ message: "Password must not contain spaces" });
  }
  User.findOne({ email })
    .then(async (user) => {
      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      generateToken(user._id, res);
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        token: generateToken(user._id, res),
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    });
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  const { fullName, email, profilePic } = req.body;
  const userId = req.user._id; // Assuming you're using middleware to set req.user

  try {
    if (!fullName || !email) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    if (profilePic && !profilePic.startsWith("http")) {
      const uploadedImage = await uploadImage(profilePic);
      req.body.profilePic = uploadedImage;
    }
    if (email && !email.includes("@")) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }
    if (profilePic && profilePic.includes(" ")) {
      return res
        .status(400)
        .json({ message: "Profile picture URL must not contain spaces" });
    }
    if (profilePic && !profilePic.startsWith("http")) {
      return res.status(400).json({ message: "Invalid profile picture URL" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, email, profilePic },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
