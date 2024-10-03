import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();

  return (
    <header className="fixed top-0 left-0 w-full bg-black bg-opcaity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <Link
            to="/"
            className="text-xl font-bold mb-2 sm:mb-0 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"
          >
            ♔ Queen
          </Link>
          <nav className="flex flex-wrap items-center gap-4">
            <Link to={"/"} className="mr-2">
              Home
            </Link>
            {user && (
              <Link to={"/cart"} className="relative group">
                <ShoppingCart className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Cart</span>
                <span className="absolute -top-2 -left-2">{cart.length}</span>
              </Link>
            )}
            {isAdmin && (
              <Link to={"/secret-dashboard"} className="">
                <Lock className="inline-block mr-1" size={18} />
                <span>Dashboard</span>
              </Link>
            )}
            {user ? (
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
						rounded-md flex items-center transition duration-300 ease-in-out"
                onClick={logout}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
