import { Outlet, Link } from "react-router-dom";
import tabIcon from "../assets/tab-icon.svg"

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      
      <nav className="bg-gray-100 shadow-md">
        <ul className="flex justify-center items-center gap-2 bg-gradient-to-br from-purple-500 to-gray-900">          
          <img src={tabIcon} className="w-[60px]"/>
          <li>
            <Link
              to="/"
              className="text-white font-medium hover:text-gray-400 active:text-gray-500 transition-colors"
            >
              Plate Price
            </Link>
          </li>
        </ul>
      </nav>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};
