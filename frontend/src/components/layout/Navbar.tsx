import { MdMenu, MdNotifications } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
  onMenuClick: () => void;
  title: string;
}

const Navbar = ({ onMenuClick, title }: NavbarProps) => {
  const { user } = useAuth();

  const initials = user?.name
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors flex-shrink-0"
          aria-label="Open sidebar"
        >
          <MdMenu className="w-6 h-6" />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-slate-800 truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <button
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors relative"
          aria-label="Notifications"
        >
          <MdNotifications className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block min-w-0">
            <p className="text-sm font-semibold text-slate-700 truncate max-w-[140px]">
              {user?.name?.split(" ").slice(0, 2).join(" ")}
            </p>
            <p className="text-xs text-slate-400 truncate max-w-[140px]">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;