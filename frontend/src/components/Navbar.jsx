import React from "react";
import { MessageCircle, User, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <div className="navbar bg-base-100 shadow-md px-8">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          <MessageCircle className="w-6 h-6 mr-2" />
          RealChatApp
        </Link>
      </div>
      <div className="flex-none flex items-center space-x-4">
        {authUser && (
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="btn btn-ghost">
              <User className="w-5 h-5 mr-2" />
              {authUser.fullName}
            </Link>
            <button onClick={logout} className="btn btn-ghost">
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        )}
        <a href="/settings" className="btn btn-ghost">
          <Settings className="w-5 h-5 mr-2" />
          Settings
        </a>
      </div>
    </div>
  );
};

export default Navbar;
