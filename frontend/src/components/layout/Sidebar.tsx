import { NavLink, useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import {
  MdDashboard,
  MdPeople,
  MdStorefront,
  MdLogout,
  MdKey,
  MdClose,
  MdStar,
} from "react-icons/md";
import { FiShoppingBag } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: MdDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: MdPeople },
  { to: "/admin/stores", label: "Stores", icon: MdStorefront },
  { to: "/change-password", label: "Change Password", icon: MdKey },
];

const userLinks = [
  { to: "/user", label: "Browse Stores", icon: FiShoppingBag, end: true },
  { to: "/change-password", label: "Change Password", icon: MdKey },
];

const ownerLinks = [
  { to: "/store-owner", label: "My Store", icon: MdStar, end: true },
  { to: "/change-password", label: "Change Password", icon: MdKey },
];

const roleLabels = {
  ADMIN: "Administrator",
  USER: "Member",
  STORE_OWNER: "Store Owner",
};

const SidebarContent = ({ onClose }: { onClose: () => void }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links =
    user?.role === "ADMIN"
      ? adminLinks
      : user?.role === "STORE_OWNER"
      ? ownerLinks
      : userLinks;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const initials = user?.name
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg">
            <MdStar className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">RateStore</p>
            <p className="text-slate-400 text-xs mt-0.5">
              {user?.role && roleLabels[user.role]}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <MdClose className="w-5 h-5" />
        </button>
      </div>

      {/* User profile */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate leading-none">
              {user?.name?.split(" ").slice(0, 2).join(" ")}
            </p>
            <p className="text-slate-400 text-xs truncate mt-0.5">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="nav-link w-full text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          <MdLogout className="w-5 h-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => (
  <>
    {/* Mobile drawer */}
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40 lg:hidden" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </TransitionChild>
        <div className="fixed inset-0 flex">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-250"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <DialogPanel className="relative w-64 flex flex-col shadow-2xl">
              <SidebarContent onClose={onClose} />
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>

    {/* Desktop fixed sidebar */}
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-30 shadow-xl">
      <SidebarContent onClose={onClose} />
    </div>
  </>
);

export default Sidebar;