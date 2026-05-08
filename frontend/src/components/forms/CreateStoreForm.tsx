import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdStorefront, MdEmail, MdLocationOn, MdPerson } from "react-icons/md";
import { createStoreApi, getAdminUsersApi } from "../../api/adminApi";
import Input from "../ui/Input";
import Button from "../ui/Button";

const schema = z.object({
  name: z.string().min(20, "Min 20 characters").max(60, "Max 60 characters"),
  email: z.string().email("Invalid email"),
  address: z.string().min(1, "Required").max(400, "Max 400 characters"),
  ownerId: z.string().uuid("Select a valid store owner"),
});
type FormData = z.infer<typeof schema>;

const CreateStoreForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { data: ownersData, isLoading: ownersLoading } = useQuery({
    queryKey: ["store-owners"],
    queryFn: () => getAdminUsersApi({ role: "STORE_OWNER", limit: 100 }),
  });

  const availableOwners = (ownersData?.data ?? []).filter((u) => !u.store);

  const mutation = useMutation({
    mutationFn: createStoreApi,
    onSuccess: () => {
      toast.success("Store created!");
      queryClient.invalidateQueries({ queryKey: ["admin-stores"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["store-owners"] });
      reset();
      onSuccess();
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || "Failed to create store");
    },
  });

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      <Input
        label="Store Name"
        placeholder="Min 20 characters"
        error={errors.name?.message}
        required
        leftIcon={<MdStorefront />}
        {...register("name")}
      />
      <Input
        label="Store Email"
        type="email"
        placeholder="store@example.com"
        error={errors.email?.message}
        required
        leftIcon={<MdEmail />}
        {...register("email")}
      />
      <Input
        label="Store Address"
        placeholder="Full store address"
        error={errors.address?.message}
        required
        leftIcon={<MdLocationOn />}
        {...register("address")}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700">
          Store Owner <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
          <select
            {...register("ownerId")}
            disabled={ownersLoading}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-slate-700 font-medium disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">
              {ownersLoading ? "Loading owners..." : "Select a store owner"}
            </option>
            {availableOwners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} — {o.email}
              </option>
            ))}
          </select>
        </div>
        {errors.ownerId && (
          <p className="text-xs text-red-500">{errors.ownerId.message}</p>
        )}
        {!ownersLoading && availableOwners.length === 0 && (
          <p className="text-xs text-amber-600 font-medium">
            No available store owners. Create a STORE_OWNER user first.
          </p>
        )}
      </div>
      <Button type="submit" loading={mutation.isPending} className="w-full" size="lg">
        Create Store
      </Button>
    </form>
  );
};

export default CreateStoreForm;