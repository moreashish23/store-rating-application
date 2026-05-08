import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type{ ColumnDef } from "@tanstack/react-table";
import { MdAdd, MdSearch, MdFilterList, MdPerson } from "react-icons/md";
import { getAdminUsersApi } from "../../api/adminApi";
import type{ User } from "../../types";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import AppModal from "../../components/ui/AppModal";
import EmptyState from "../../components/ui/EmptyState";
import CreateUserForm from "../../components/forms/CreateUserForm";
import { useDebounce } from "../../hooks/useDebounce";

const AdminUsers = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page, debouncedSearch, roleFilter, sortBy, sortOrder],
    queryFn: () =>
      getAdminUsersApi({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        role: roleFilter || undefined,
        sortBy,
        sortOrder,
      }),
  });

  const handleSort = (key: string) => {
    if (sortBy === key) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else { setSortBy(key); setSortOrder("asc"); }
    setPage(1);
  };

  const columns = useMemo<ColumnDef<User, unknown>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        meta: { sortable: true, key: "name" },
        cell: ({ row }) => (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0 text-brand-700 text-xs font-bold">
              {row.original.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-slate-800 truncate max-w-[180px]">
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
            className="text-slate-500 text-sm max-w-[180px] truncate block"
            title={getValue() as string}
          >
            {getValue() as string}
          </span>
        ),
      },
      {
        id: "role",
        header: "Role",
        accessorKey: "role",
        meta: { sortable: true, key: "role" },
        cell: ({ getValue }) => <Badge label={getValue() as string} />,
      },
      {
        id: "store",
        header: "Store",
        accessorKey: "store",
        cell: ({ row }) =>
          row.original.store ? (
            <span className="text-sm font-medium text-emerald-600 truncate block max-w-[140px]">
              {row.original.store.name}
            </span>
          ) : (
            <span className="text-slate-300 text-sm">—</span>
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
            <h2 className="text-xl font-extrabold text-slate-800">Users</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {data?.meta?.total ?? 0} total users
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            icon={<MdAdd className="w-4 h-4" />}
          >
            Add User
          </Button>
        </div>

        <div className="card overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search name, email, address..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all bg-white"
              />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <MdFilterList className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-slate-700 font-medium w-full sm:w-auto"
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
                <option value="STORE_OWNER">Store Owner</option>
              </select>
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
                icon={<MdPerson className="w-7 h-7 text-slate-400" />}
                title="No users found"
                description="Try adjusting your search or role filter"
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
        title="Create New User"
        size="md"
      >
        <CreateUserForm onSuccess={() => setIsCreateOpen(false)} />
      </AppModal>
    </DashboardLayout>
  );
};

export default AdminUsers;