import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/apiErrors";

const Login = () => {
  const { useLogin } = useAuth();
  const { mutate, isPending, isError, error } = useLogin();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleForm = (event) => {
    event.preventDefault();
    mutate(formData);
  };

  return (
    <div className="flex min-h-[calc(100vh-13rem)] items-center justify-center overflow-hidden bg-[#f7f8f2] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden overflow-hidden bg-[#123c35] p-10 text-white md:flex md:flex-col md:justify-between lg:p-14">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[3rem] border-[#e8c547]/30" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e8c547]">
              Daymark
            </p>
            <h1 className="mt-16 max-w-sm text-5xl font-black leading-[0.95]">
              Small steps. Real momentum.
            </h1>
          </div>
          <p className="relative max-w-xs text-sm leading-6 text-emerald-100">
            Keep the things you care about close, clear, and moving forward.
          </p>
        </div>

        <div className="p-7 sm:p-12 lg:p-16">
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
              Welcome back
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
              Sign in to continue.
            </h2>
            <p className="mt-3 text-slate-500">
              Your next meaningful step is waiting.
            </p>
          </div>

          <form onSubmit={handleForm} className="space-y-5">
            <label className="block text-sm font-bold text-slate-700">
              Username or email
              <input
                required
                autoComplete="username"
                value={formData.username}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    username: event.target.value,
                  }))
                }
                type="text"
                className="input mt-2 h-12 w-full border-slate-300 bg-slate-50 focus:border-emerald-700 focus:outline-emerald-700"
                placeholder="you@example.com"
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              Password
              <input
                required
                autoComplete="current-password"
                value={formData.password}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                type="password"
                className="input mt-2 h-12 w-full border-slate-300 bg-slate-50 focus:border-emerald-700 focus:outline-emerald-700"
                placeholder="Enter your password"
              />
            </label>
            {isError && (
              <p
                className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
                role="alert"
              >
                {getErrorMessage(error)}
              </p>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="btn h-12 w-full border-0 bg-[#123c35] text-white hover:bg-[#1c554a]"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <div className="mt-8 flex justify-between text-sm text-slate-500">
            <Link
              className="font-bold text-emerald-700 hover:underline"
              to="/forgot-password"
            >
              Forgot password?
            </Link>
            <span>
              New here?{" "}
              <Link
                className="font-bold text-emerald-700 hover:underline"
                to="/register"
              >
                Create an account
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
