import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdPerson, MdEmail, MdLock, MdLocationOn } from "react-icons/md";
import { createUserApi } from "../../api/adminApi";
import Input from "../ui/Input";
import Button from "../ui/Button";

const schema = z.object({
  name: z.string().min(20, "Min 20 characters").max(60, "Max 60 characters"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .max(16, "Max 16 characters")
    .regex(/[A-Z]/, "Need uppercase letter")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Need special character"),
  address: z.string().min(1, "Required").max(400, "Max 400 characters"),
  role: z.enum(["ADMIN", "USER", "STORE_OWNER"]),
});
type FormData = z.infer<typeof schema>;

const CreateUserForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "USER" },
  });

  const mutation = useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      toast.success("User created!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      reset();
      onSuccess();
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || "Failed to create user");
    },
  });

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="Min 20 characters"
        error={errors.name?.message}
        required
        leftIcon={<MdPerson />}
        {...register("name")}
      />
      <Input
        label="Email"
        type="email"
        placeholder="user@example.com"
        error={errors.email?.message}
        required
        leftIcon={<MdEmail />}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        placeholder="8–16 chars, uppercase + special"
        error={errors.password?.message}
        required
        leftIcon={<MdLock />}
        {...register("password")}
      />
      <Input
        label="Address"
        placeholder="Full address"
        error={errors.address?.message}
        required
        leftIcon={<MdLocationOn />}
        {...register("address")}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700">
          Role <span className="text-red-500">*</span>
        </label>
        <select
          {...register("role")}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-slate-700 font-medium"
        >
          <option value="USER">User</option>
          <option value="STORE_OWNER">Store Owner</option>
          <option value="ADMIN">Admin</option>
        </select>
        {errors.role && (
          <p className="text-xs text-red-500">{errors.role.message}</p>
        )}
      </div>
      <Button type="submit" loading={mutation.isPending} className="w-full" size="lg">
        Create User
      </Button>
    </form>
  );
};

export default CreateUserForm;