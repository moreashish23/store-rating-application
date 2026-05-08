import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MdEmail, MdLock, MdStar } from "react-icons/md";
import { loginApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

const demoAccounts = [
  { label: "Admin", color: "text-red-600 bg-red-50", email: "admin@storerating.com", password: "Admin@12345secure" },
  { label: "User", color: "text-blue-600 bg-blue-50", email: "rahul.kumar@example.com", password: "User1@12345secure" },
  { label: "Owner", color: "text-emerald-600 bg-emerald-50", email: "suresh.reddy@techmart.com", password: "Owner1@12345secure" },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      if (res.data) {
        login(res.data.user, res.data.token);
        toast.success(`Welcome, ${res.data.user.name.split(" ")[0]}!`);
        const { role } = res.data.user;
        navigate(role === "ADMIN" ? "/admin" : role === "STORE_OWNER" ? "/store-owner" : "/user");
      }
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || "Invalid credentials");
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header card */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-brand-900/50">
            <MdStar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">RateStore</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-white/10">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
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
                placeholder="Enter your password"
                error={errors.password?.message}
                required
                leftIcon={<MdLock />}
                {...register("password")}
              />
              <Button
                type="submit"
                loading={mutation.isPending}
                className="w-full mt-2"
                size="lg"
              >
                Sign In
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-5">
              No account?{" "}
              <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700">
                Create one
              </Link>
            </p>

            {/* Demo credentials */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
                Demo Accounts
              </p>
              <div className="space-y-2">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.label}
                    type="button"
                    onClick={() => {
                      setValue("email", acc.email);
                      setValue("password", acc.password);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs border border-transparent hover:border-slate-200 transition-all ${acc.color}`}
                  >
                    <span className="font-bold">{acc.label}:</span>{" "}
                    <span className="opacity-80">{acc.email}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;