import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast from "react-hot-toast";
import { MdSearch, MdLocationOn, MdEmail, MdCheckCircle } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { getUserStoresApi, submitRatingApi, updateRatingApi } from "../../api/userApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StarRating from "../../components/ui/StarRating";
import Pagination from "../../components/ui/Pagination";
import { useDebounce } from "../../hooks/useDebounce";
import type{ Store } from "../../types";

const StoreCard = ({
  store,
  onRate,
  isLoading,
}: {
  store: Store;
  onRate: (storeId: string, value: number, isUpdate: boolean) => void;
  isLoading: boolean;
}) => {
  const [selected, setSelected] = useState<number>(store.userRating ?? 0);
  const hasRated = store.userRating != null;

  const handleSubmit = () => {
    if (!selected) { toast.error("Please select a star rating"); return; }
    onRate(store.id, selected, hasRated);
  };

  return (
    <div className="card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight line-clamp-2">
            {store.name}
          </h3>
        </div>
        {hasRated && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex-shrink-0">
            <MdCheckCircle className="w-3.5 h-3.5" />
            Rated
          </span>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-500">
          <MdLocationOn className="w-4 h-4 flex-shrink-0 text-slate-400 mt-0.5" />
          <span className="line-clamp-2">{store.address}</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <MdEmail className="w-4 h-4 flex-shrink-0 text-slate-400" />
          <span className="truncate">{store.email}</span>
        </div>
      </div>

      {/* Overall rating */}
      <div className="flex items-center justify-between py-3 border-y border-slate-100">
        <div>
          <p className="text-xs text-slate-400 font-medium mb-1">Overall Rating</p>
          {store.averageRating != null ? (
            <StarRating value={store.averageRating} readonly size="sm" showValue />
          ) : (
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <FaStar className="text-slate-200" />
              <span>No ratings yet</span>
            </div>
          )}
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {store.totalRatings ?? 0} {(store.totalRatings ?? 0) === 1 ? "review" : "reviews"}
        </span>
      </div>

      {/* Rating input */}
      <div>
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
          {hasRated ? "Update your rating" : "Rate this store"}
        </p>
        <StarRating value={selected} onChange={setSelected} size="lg" showValue={false} />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !selected}
          className={`mt-3 w-full py-2.5 rounded-xl text-sm font-bold transition-all
            ${hasRated
              ? "bg-brand-50 hover:bg-brand-100 text-brand-700"
              : "bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
            }
            disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]`}
        >
          {isLoading ? "Saving..." : hasRated ? "Update Rating" : "Submit Rating"}
        </button>
      </div>
    </div>
  );
};

const StoreCardSkeleton = () => (
  <div className="card p-5 space-y-3">
    <Skeleton height={20} width="70%" borderRadius={8} />
    <Skeleton height={14} borderRadius={6} />
    <Skeleton height={14} width="60%" borderRadius={6} />
    <Skeleton height={1} />
    <Skeleton height={24} width="50%" borderRadius={8} />
    <Skeleton height={40} borderRadius={12} />
  </div>
);

const UserDashboard = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loadingStore, setLoadingStore] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 400);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["user-stores", page, debouncedSearch],
    queryFn: () =>
      getUserStoresApi({ page, limit: 9, search: debouncedSearch || undefined }),
  });

  const submitMutation = useMutation({
    mutationFn: (vars: { storeId: string; value: number }) =>
      submitRatingApi(vars),
    onSuccess: () => {
      toast.success("Rating submitted!");
      queryClient.invalidateQueries({ queryKey: ["user-stores"] });
      setLoadingStore(null);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || "Failed to submit rating");
      setLoadingStore(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { storeId: string; value: number }) =>
      updateRatingApi(vars.storeId, { value: vars.value }),
    onSuccess: () => {
      toast.success("Rating updated!");
      queryClient.invalidateQueries({ queryKey: ["user-stores"] });
      setLoadingStore(null);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || "Failed to update rating");
      setLoadingStore(null);
    },
  });

  const handleRate = (storeId: string, value: number, isUpdate: boolean) => {
    setLoadingStore(storeId);
    if (isUpdate) updateMutation.mutate({ storeId, value });
    else submitMutation.mutate({ storeId, value });
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">Browse Stores</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {data?.meta?.total ?? 0} stores · Rate & review
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search stores by name or address..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-sm transition-all"
          />
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {Array.from({ length: 6 }).map((_, i) => <StoreCardSkeleton key={i} />)}
          </div>
        ) : !data?.data?.length ? (
          <div className="card flex flex-col items-center justify-center py-20 text-center">
            <MdSearch className="w-12 h-12 text-slate-200 mb-3" />
            <p className="font-bold text-slate-600 mb-1">No stores found</p>
            <p className="text-sm text-slate-400">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {data.data.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onRate={handleRate}
                isLoading={loadingStore === store.id}
              />
            ))}
          </div>
        )}

        {data?.meta && (
          <div className="flex justify-center pt-2">
            <Pagination
              page={page}
              totalPages={data.meta.totalPages}
              total={data.meta.total}
              limit={data.meta.limit}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;