import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/apiErrors";

const Register = () => {
  const { useRegister } = useAuth();
  const { mutate, isPending, isError, error } = useRegister();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [usernameEdited, setUsernameEdited] = useState(false);

  const suggestUsername = (name) =>
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 20);

  const handleNameChange = (event) => {
    const name = event.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      username: usernameEdited ? prev.username : suggestUsername(name),
    }));
  };

  const handleForm = (event) => {
    event.preventDefault();
    mutate(formData, {
      onSuccess: () =>
        navigate("/verify-email", { state: { email: formData.email } }),
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-13rem)] items-center justify-center bg-[#f7f8f2] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 md:grid-cols-[1.1fr_0.9fr]">
        <div className="order-2 p-7 sm:p-12 md:order-1 lg:p-16">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
              Start clearly
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
              Build your daymark.
            </h1>
            <p className="mt-3 text-slate-500">
              Create a home for the goals you want to make real.
            </p>
          </div>
          <form onSubmit={handleForm} className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">
              Full name
              <input
                required
                autoComplete="name"
                value={formData.name}
                onChange={handleNameChange}
                type="text"
                className="input mt-2 h-12 w-full border-slate-300 bg-slate-50 focus:border-emerald-700 focus:outline-emerald-700"
                placeholder="Alex Morgan"
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              Username
              <input
                required
                autoComplete="username"
                value={formData.username}
                onChange={(event) => {
                  setUsernameEdited(true);
                  setFormData((prev) => ({
                    ...prev,
                    username: event.target.value,
                  }));
                }}
                type="text"
                className="input mt-2 h-12 w-full border-slate-300 bg-slate-50 focus:border-emerald-700 focus:outline-emerald-700"
                placeholder="Your username"
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              Email
              <input
                required
                autoComplete="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                type="email"
                className="input mt-2 h-12 w-full border-slate-300 bg-slate-50 focus:border-emerald-700 focus:outline-emerald-700"
                placeholder="you@example.com"
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              Password
              <input
                required
                minLength="6"
                autoComplete="new-password"
                value={formData.password}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                type="password"
                className="input mt-2 h-12 w-full border-slate-300 bg-slate-50 focus:border-emerald-700 focus:outline-emerald-700"
                placeholder="At least 6 characters"
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
              className="btn mt-2 h-12 w-full border-0 bg-[#123c35] text-white hover:bg-[#1c554a]"
            >
              {isPending ? "Creating account..." : "Create account"}
            </button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              className="font-bold text-emerald-700 hover:underline"
              to="/login"
            >
              Sign in
            </Link>
          </p>
        </div>
        <div className="relative order-1 overflow-hidden bg-[#e8c547] p-8 md:order-2 md:p-10 lg:p-14">
          <div className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full border-[3rem] border-[#123c35]/15" />
          <p className="relative text-xs font-bold uppercase tracking-[0.3em] text-[#123c35]">
            Daymark
          </p>
          <div className="relative mt-10 max-w-xs md:mt-32">
            <p className="text-5xl font-black leading-[0.95] text-[#123c35]">
              Make room for what matters.
            </p>
            <p className="mt-6 text-sm leading-6 text-[#123c35]/75">
              A quieter way to keep your ambitions visible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
