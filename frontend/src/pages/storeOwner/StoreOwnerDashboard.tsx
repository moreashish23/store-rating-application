import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type{ ColumnDef } from "@tanstack/react-table";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  MdStorefront,
  MdStar,
  MdPeople,
  MdTrendingUp,
  MdEmail,
  MdLocationOn,
} from "react-icons/md";
import { getStoreOwnerDashboardApi } from "../../api/storeOwnerApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StarRating from "../../components/ui/StarRating";
import DataTable from "../../components/ui/DataTable";
import EmptyState from "../../components/ui/EmptyState";

interface Rater {
  userId: string;
  name: string;
  email: string;
  rating: number;
  ratedAt: string;
}

const StoreOwnerDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["store-owner-dashboard"],
    queryFn: getStoreOwnerDashboardApi,
  });

  const dashboard = data?.data;

  const columns = useMemo<ColumnDef<Rater, unknown>[]>(
    () => [
      {
        id: "name",
        header: "User",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0 text-brand-700 text-xs font-bold">
              {row.original.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-sm truncate max-w-[160px]">
                {row.original.name}
              </p>
              <p className="text-xs text-slate-400 truncate max-w-[160px]">
                {row.original.email}
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "rating",
        header: "Rating",
        accessorKey: "rating",
        cell: ({ row }) => (
          <StarRating value={row.original.rating} readonly size="sm" showValue />
        ),
      },
      {
        id: "ratedAt",
        header: "Rated On",
        accessorKey: "ratedAt",
        cell: ({ getValue }) => (
          <span className="text-sm text-slate-500">
            {new Date(getValue() as string).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Store Dashboard</h2>
          <p className="text-sm text-slate-400 mt-0.5">Monitor your store performance</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {/* Store Info */}
          <div className="card p-5 sm:col-span-1">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton height={44} width={44} borderRadius={12} />
                <Skeleton height={20} width="80%" />
                <Skeleton height={14} />
                <Skeleton height={14} width="60%" />
              </div>
            ) : (
              <>
                <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <MdStorefront className="w-6 h-6 text-brand-600" />
                </div>
                <p className="font-extrabold text-slate-800 text-base leading-tight mb-2 line-clamp-2">
                  {dashboard?.store.name}
                </p>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                    <MdEmail className="w-3.5 h-3.5 flex-shrink-0" />
                    {dashboard?.store.email}
                  </p>
                  <p className="text-xs text-slate-500 flex items-start gap-1.5">
                    <MdLocationOn className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{dashboard?.store.address}</span>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Average Rating */}
          <div className="card p-5">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton height={44} width={44} borderRadius={12} />
                <Skeleton height={40} width="50%" />
                <Skeleton height={20} />
              </div>
            ) : (
              <>
                <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                  <MdStar className="w-6 h-6 text-amber-500" />
                </div>
                <p className="text-sm font-semibold text-slate-500 mb-2">Average Rating</p>
                {dashboard?.averageRating != null ? (
                  <>
                    <p className="text-4xl font-extrabold text-slate-800 tabular-nums">
                      {dashboard.averageRating.toFixed(2)}
                    </p>
                    <div className="mt-2">
                      <StarRating value={dashboard.averageRating} readonly size="sm" showValue={false} />
                    </div>
                  </>
                ) : (
                  <p className="text-slate-400 text-sm italic">No ratings yet</p>
                )}
              </>
            )}
          </div>

          {/* Total Ratings */}
          <div className="card p-5">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton height={44} width={44} borderRadius={12} />
                <Skeleton height={40} width="50%" />
                <Skeleton height={16} />
              </div>
            ) : (
              <>
                <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <MdTrendingUp className="w-6 h-6 text-brand-600" />
                </div>
                <p className="text-sm font-semibold text-slate-500 mb-1">Total Ratings</p>
                <p className="text-4xl font-extrabold text-slate-800 tabular-nums">
                  {dashboard?.totalRatings ?? 0}
                </p>
                <p className="text-xs text-slate-400 mt-1">from unique users</p>
              </>
            )}
          </div>
        </div>

        {/* Raters table */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
              <MdPeople className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">Users Who Rated</p>
              <p className="text-xs text-slate-400">
                {dashboard?.totalRatings ?? 0} total ratings
              </p>
            </div>
          </div>

          <DataTable
            data={dashboard?.raters ?? []}
            columns={columns}
            isLoading={isLoading}
            emptyComponent={
              <EmptyState
                icon={<MdStar className="w-7 h-7 text-slate-400" />}
                title="No ratings yet"
                description="Users who rate your store will appear here"
              />
            }
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StoreOwnerDashboard;