import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type{ ColumnDef } from "@tanstack/react-table";
import { MdAdd, MdSearch, MdStorefront } from "react-icons/md";
import { getAdminStoresApi } from "../../api/adminApi";
import type{ Store } from "../../types";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import StarRating from "../../components/ui/StarRating";
import Button from "../../components/ui/Button";
import AppModal from "../../components/ui/AppModal";
import EmptyState from "../../components/ui/EmptyState";
import CreateStoreForm from "../../components/forms/CreateStoreForm";
import { useDebounce } from "../../hooks/useDebounce";

const AdminStores = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-stores", page, debouncedSearch, sortBy, sortOrder],
    queryFn: () =>
      getAdminStoresApi({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        sortBy,
        sortOrder,
      }),
  });

  const handleSort = (key: string) => {
    if (sortBy === key) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else { setSortBy(key); setSortOrder("asc"); }
    setPage(1);
  };

  const columns = useMemo<ColumnDef<Store, unknown>[]>(
    () => [
      {
        id: "name",
        header: "Store Name",
        accessorKey: "name",
        meta: { sortable: true, key: "name" },
        cell: ({ row }) => (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <MdStorefront className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="font-semibold text-slate-800 truncate max-w-[160px]">
              {row.original.name}
            </span>
          </div>
        ),
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "email",
        meta: { sortable: true, key: "email" },
        cell: ({ getValue }) => (
          <span className="text-slate-600 text-sm">{getValue() as string}</span>
        ),
      },
      {
        id: "address",
        header: "Address",
        accessorKey: "address",
        cell: ({ getValue }) => (
          <span
            className="text-slate-500 text-sm max-w-[160px] truncate block"
            title={getValue() as string}
          >
            {getValue() as string}
          </span>
        ),
      },
      {
        id: "owner",
        header: "Owner",
        accessorKey: "owner",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-700 truncate">
              {row.original.owner?.name ?? "—"}
            </p>
            <p className="text-xs text-slate-400 truncate">{row.original.owner?.email}</p>
          </div>
        ),
      },
      {
        id: "averageRating",
        header: "Rating",
        accessorKey: "averageRating",
        cell: ({ row }) =>
          row.original.averageRating != null ? (
            <div className="flex items-center gap-2">
              <StarRating value={row.original.averageRating} readonly size="sm" showValue />
              <span className="text-xs text-slate-400">({row.original.totalRatings})</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic">No ratings</span>
          ),
      },
    ],
    []
  );

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-5">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">Stores</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {data?.meta?.total ?? 0} total stores
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            icon={<MdAdd className="w-4 h-4" />}
          >
            Add Store
          </Button>
        </div>

        <div className="card overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="relative max-w-sm">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name, email, address..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all bg-white"
              />
            </div>
          </div>

          <DataTable
            data={data?.data ?? []}
            columns={columns}
            isLoading={isLoading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            emptyComponent={
              <EmptyState
                icon={<MdStorefront className="w-7 h-7 text-slate-400" />}
                title="No stores found"
                description="Create a store or adjust your search"
              />
            }
          />

          {data?.meta && (
            <Pagination
              page={page}
              totalPages={data.meta.totalPages}
              total={data.meta.total}
              limit={data.meta.limit}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      <AppModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Store"
        size="md"
      >
        <CreateStoreForm onSuccess={() => setIsCreateOpen(false)} />
      </AppModal>
    </DashboardLayout>
  );
};

export default AdminStores;