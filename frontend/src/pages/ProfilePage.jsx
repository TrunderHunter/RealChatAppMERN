import React, { useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";
import { uploadToCloudinary } from "../utils/cloudinary";

const ProfilePage = () => {
  const { authUser, updateProfile, isUpatingProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
    profilePic: authUser?.profilePic || "",
  });
  const [selectedFile, setSelectedFile] = useState(null); // Lưu file tạm thời

  const fileInputRef = useRef(null);

  const isChanged =
    formData.fullName !== authUser?.fullName ||
    formData.email !== authUser?.email ||
    selectedFile !== null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Lưu file tạm thời
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let profilePicUrl = formData.profilePic;

      // Upload ảnh lên Cloudinary nếu có file được chọn
      if (selectedFile) {
        toast.loading("Uploading image...");
        profilePicUrl = await uploadToCloudinary(selectedFile);
        toast.dismiss();
      }

      // Gửi dữ liệu cập nhật đến backend
      await updateProfile({ ...formData, profilePic: profilePicUrl });
      // Cập nhật lại URL ảnh trong formData
      setFormData((prev) => ({ ...prev, profilePic: profilePicUrl }));
      setSelectedFile(null); // Reset file sau khi upload thành công
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-6 rounded-lg">
        {/* Avatar upload section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={
                selectedFile
                  ? URL.createObjectURL(selectedFile) // Hiển thị ảnh tạm thời nếu có
                  : formData.profilePic ||
                    "https://res.cloudinary.com/dnta8sd9z/image/upload/v1743567469/samples/gengar-pokemon-4k-wallpaper-uhdpaper.com-256_5_d_xtzupt.jpg"
              }
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-2 border-primary"
            />
            <label
              htmlFor="file-upload"
              className="absolute bottom-0 right-0 
              bg-primary text-white 
              p-2 rounded-full cursor-pointer 
              shadow-md hover:bg-primary-focus"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
            </label>
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-4 text-primary">
          Update Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="form-control floating-label">
            <span>Full Name</span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Your full name"
              required
            />
          </label>
          <label className="form-control floating-label">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Your email"
              required
            />
          </label>
          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={!isChanged || isUpatingProfile}
            >
              {isUpatingProfile ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
