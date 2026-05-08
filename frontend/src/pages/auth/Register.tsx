import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MdEmail, MdLock, MdPerson, MdLocationOn, MdStar } from "react-icons/md";
import { registerApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const schema = z.object({
  name: z.string().min(20, "Minimum 20 characters").max(60, "Maximum 60 characters"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Minimum 8 characters")
    .max(16, "Maximum 16 characters")
    .regex(/[A-Z]/, "Need at least one uppercase letter")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Need at least one special character"),
  address: z.string().min(1, "Address is required").max(400, "Maximum 400 characters"),
});
type FormData = z.infer<typeof schema>;

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (res) => {
      if (res.data) {
        login(res.data.user, res.data.token);
        toast.success("Account created!");
        navigate("/user");
      }
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || "Registration failed");
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-brand-900/50">
            <MdStar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Create Account</h1>
          <p className="text-slate-400 text-sm mt-1">Join RateStore today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-white/10">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Your full name (min 20 characters)"
                error={errors.name?.message}
                helperText="Must be between 20–60 characters"
                required
                leftIcon={<MdPerson />}
                {...register("name")}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
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
                helperText="8–16 characters with uppercase & special character"
                required
                leftIcon={<MdLock />}
                {...register("password")}
              />
              <Input
                label="Address"
                placeholder="Your full address"
                error={errors.address?.message}
                required
                leftIcon={<MdLocationOn />}
                {...register("address")}
              />
              <Button
                type="submit"
                loading={mutation.isPending}
                className="w-full mt-2"
                size="lg"
              >
                Create Account
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-5">
              Already have an account?{" "}
              <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;