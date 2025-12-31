import { useState } from "react";
import {
  BookOpen,
  Menu,
  User,
  FolderOpen,
  X,
  LogOut,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="py-4 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex justify-between items-center">
          <Link to="/folders" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-gray-800" />
            <h1 className="text-2xl font-medium text-gray-800">VocabMaster</h1>
          </Link>

          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          )}
        </div>

        {isMenuOpen && isAuthenticated && (
          <nav className="absolute top-[69px] left-0 right-0 bg-white border-b border-gray-100 shadow-sm animate-fadeIn z-50">
            <div className="container mx-auto px-4 max-w-3xl py-2">
              {user && (
                <div className="px-3 py-3 mb-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              )}
              <div className="flex flex-col space-y-1">
                <Link
                  to="/folders"
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FolderOpen className="h-4 w-4" />
                  <span>Folders</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md w-full text-left"
                >
                  {isLoggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
