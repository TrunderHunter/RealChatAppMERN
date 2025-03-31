import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import { Readable } from "stream";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (buffer) => {
  try {
    const readableBuffer = new Readable();
    readableBuffer.push(buffer);
    readableBuffer.push(null); // Kết thúc luồng

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(new Error("Image upload failed"));
          } else {
            resolve(result); // Trả về URL an toàn của hình ảnh
          }
        }
      );

      readableBuffer.pipe(stream);
    });
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Image upload failed");
  }
};

export const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error("Image deletion failed");
  }
};

export const getImageUrl = (publicId) => {
  return cloudinary.url(publicId, {
    width: 500,
    height: 500,
    crop: "fill",
    secure: true,
  });
};
