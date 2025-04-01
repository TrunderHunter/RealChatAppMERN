import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check-auth");
      set({ authUser: response.data, isCheckingAuth: false });
    } catch (error) {
      console.error("Error checking authentication:", error);
      set({ authUser: null, isCheckingAuth: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      console.log("Sign-up response:", response.data);
      set({ authUser: response.data });
      toast.success("Sign-up successful!");
    } catch (error) {
      console.error(
        "Error signing up:",
        error.response?.data?.message || error.message
      );
      if (error.response?.status === 400) {
        toast.error("Invalid input. Please check your data.");
      } else if (error.response?.status === 409) {
        toast.error("Email already exists. Please use a different email.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      toast.error("Sign-up failed. Please try again.");
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
