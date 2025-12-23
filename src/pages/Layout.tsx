import { Outlet, Link } from "react-router-dom";
import tabIcon from "../assets/tab-icon.svg"

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      
      <nav className="bg-grape-50 shadow-md">
        <ul className="flex justify-center items-center gap-2 bg-gradient-to-br from-grape-500 to-ink">          
          <img src={tabIcon} className="w-[60px]"/>
          <li>
            <Link
              to="/"
              className="text-white font-medium hover:text-grape-100 active:text-grape-200 transition-colors"
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
