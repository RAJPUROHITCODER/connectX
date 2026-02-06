import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    async function signupData(data) {
        setError(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/user/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });

            const resValue = await res.json();

            if (!res.ok) {
                setError(resValue.message || "Signup failed");
                return;
            }

            navigate("/user/login");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 px-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <h1 className="mt-4 text-2xl font-semibold text-white tracking-tight">Create Account</h1>
                    <p className="mt-1 text-sm text-slate-400">Join the conversation today</p>
                </div>

                <div className="bg-gray-800/90 border border-gray-700 backdrop-blur-xl rounded-2xl shadow-2xl px-6 py-8">
                    {error && (
                        <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 text-sm px-3 py-2">
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleSubmit(signupData)} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-200">Full Name </label>
                            <input type="text" placeholder="your name" {...register("fullName", { required: "Full name is required" })} className="w-full rounded-lg border border-gray-700 bg-gray-900/80 text-slate-100 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500" />
                            {errors.fullName && (
                                <p className="text-xs text-red-400 mt-1">
                                    {errors.fullName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-200">Email</label>
                            <input type="email" placeholder="Email" {...register("email", { required: "Email is required" })} className="w-full rounded-lg border border-gray-700 bg-gray-900/80 text-slate-100 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500" />
                            {errors.email && (
                                <p className="text-xs text-red-400 mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-200">Password</label>
                            <input type="password" placeholder="password" {...register("password", { required: "Password is required" })} className="w-full rounded-lg border border-gray-700 bg-gray-900/80 text-slate-100 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500" />
                            {errors.password && (
                                <p className="text-xs text-red-400 mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <button type="submit" disabled={isSubmitting} className="w-full mt-2 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200">{isSubmitting ? "Creating Account..." : "Sign Up"}</button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-slate-400">Already have an account?{" "}
                    <Link to="/user/login" className="font-medium text-blue-400 hover:text-blue-300 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
