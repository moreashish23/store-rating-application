import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdLock, MdKey, MdShield } from "react-icons/md";
import { changePasswordApi } from "../api/authApi";
import DashboardLayout from "../components/layout/DashboardLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: z
      .string()
      .min(8, "Min 8 characters")
      .max(16, "Max 16 characters")
      .regex(/[A-Z]/, "Need uppercase letter")
      .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Need special character"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (d: FormData) =>
      changePasswordApi({ currentPassword: d.currentPassword, newPassword: d.newPassword }),
    onSuccess: () => {
      toast.success("Password updated successfully!");
      reset();
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || "Failed to update password");
    },
  });

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto">
        <div className="card overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center">
              <MdKey className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Change Password</h2>
              <p className="text-sm text-slate-400">Update your account security</p>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter your current password"
                error={errors.currentPassword?.message}
                required
                leftIcon={<MdLock />}
                {...register("currentPassword")}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="8–16 chars, uppercase + special"
                error={errors.newPassword?.message}
                helperText="8–16 characters with at least one uppercase & special character"
                required
                leftIcon={<MdShield />}
                {...register("newPassword")}
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter new password"
                error={errors.confirmPassword?.message}
                required
                leftIcon={<MdLock />}
                {...register("confirmPassword")}
              />
              <Button
                type="submit"
                loading={mutation.isPending}
                className="w-full mt-2"
                size="lg"
              >
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChangePassword;