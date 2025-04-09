import Message from "../models/message.model.js";
import User from "../models/user.model.js"; // Assuming you have a function to upload images to Cloudinary

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesForUser = async (req, res) => {
  try {
    const myId = req.user._id;
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userId },
        { senderId: userId, receiverId: myId },
      ],
    })
      .populate("senderId", "-password")
      .populate("receiverId", "-password");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text, image } = req.body;
    const senderId = req.user._id;

    let imageUrl = null;
    if (image) {
      // Upload base64 image to Cloudinary
      const base64Image = image.split(";base64,").pop();
      const buffer = Buffer.from(base64Image, "base64");
      const cloudinaryResponse = await uploadImage(buffer); // Assuming uploadImage is a function that uploads the image to Cloudinary
      imageUrl = cloudinaryResponse.secure_url; // Get the URL of the uploaded image
    }

    const message = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await message.save();
    const populatedMessage = await message
      .populate("senderId", "-password")
      .populate("receiverId", "-password");
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
