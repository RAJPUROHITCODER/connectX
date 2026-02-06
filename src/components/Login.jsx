import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function loginData(data) {
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const resValue = await res.json();

      if (!res.ok) {
        setError(resValue.message || "Login failed");
        return;
      }

      navigate("/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <h1 className="mt-4 text-2xl font-semibold text-white tracking-tight"> Welcome back  </h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to continue to your chat.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-xl px-6 py-6">
          {error && (
            <p className="mb-4 rounded-lg bg-red-900 border border-red-900 text-red-300 text-sm px-3 py-2">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit(loginData)} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-200">Email</label>
              <input type="email" placeholder="email" {...register("email", { required: "Email is required" })} className="w-full rounded-lg border border-slate-700 bg-slate-900 text-slate-100 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500"/>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-200">Password</label>
              <input type="password" placeholder="password" {...register("password", { required: "Password is required" })} className="w-full rounded-lg border border-slate-700 bg-slate-900 text-slate-100 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500"/>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full mt-2 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition">
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-slate-400">Don't have an account?{" "}
          <Link to="/user/signup" className="font-medium text-blue-400 hover:text-blue-300 hover:underline" >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
