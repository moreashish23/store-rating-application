import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  MdPeople,
  MdStorefront,
  MdStar,
  MdTrendingUp,
  MdArrowForward,
} from "react-icons/md";
import { getAdminStatsApi } from "../../api/adminApi";
import DashboardLayout from "../../components/layout/DashboardLayout";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  trend: string;
  loading: boolean;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  loading,
}: StatCardProps) => (
  <div className="card p-5 sm:p-6 hover:shadow-md transition-shadow">
    {loading ? (
      <div className="space-y-3">
        <Skeleton height={44} width={44} borderRadius={12} />
        <Skeleton height={36} width="50%" borderRadius={8} />
        <Skeleton height={16} borderRadius={6} />
      </div>
    ) : (
      <>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold">
            <MdTrendingUp className="w-3.5 h-3.5" />
            {trend}
          </div>
        </div>
        <p className="text-3xl sm:text-4xl font-extrabold text-slate-800 tabular-nums">
          {value.toLocaleString()}
        </p>
        <p className="text-sm font-semibold text-slate-500 mt-1">{title}</p>
      </>
    )}
  </div>
);

const AdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStatsApi,
  });
  const stats = data?.data;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            Platform Overview
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time statistics for your platform
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers ?? 0}
            icon={MdPeople}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            trend="Live"
            loading={isLoading}
          />
          <StatCard
            title="Total Stores"
            value={stats?.totalStores ?? 0}
            icon={MdStorefront}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            trend="Live"
            loading={isLoading}
          />
          <StatCard
            title="Total Ratings"
            value={stats?.totalRatings ?? 0}
            icon={MdStar}
            iconBg="bg-amber-50"
            iconColor="text-amber-500"
            trend="Live"
            loading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/users"
            className="card p-5 flex items-center gap-4 hover:shadow-md hover:border-brand-200 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors flex-shrink-0">
              <MdPeople className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-700">Manage Users</p>
              <p className="text-sm text-slate-400">View, create & filter users</p>
            </div>
            <MdArrowForward className="w-5 h-5 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </Link>

          <Link
            to="/admin/stores"
            className="card p-5 flex items-center gap-4 hover:shadow-md hover:border-brand-200 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors flex-shrink-0">
              <MdStorefront className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-700">Manage Stores</p>
              <p className="text-sm text-slate-400">View and create stores</p>
            </div>
            <MdArrowForward className="w-5 h-5 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;