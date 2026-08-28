import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/apiErrors";
import { toast } from "react-toastify";
import useCooldown from "../hooks/useCooldown";

const ResetPassword = () => {
  const { useResetPassword } = useAuth();
  const mutation = useResetPassword();
  const { useResendResetPassword } = useAuth();
  const resend = useResendResetPassword();
  const cooldown = useCooldown(30);
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: location.state?.email || "",
    otp: "",
    password: "",
  });
  const submit = (event) => {
    event.preventDefault();
    mutation.mutate(form, {
      onSuccess: (data) => {
        toast.success(data.message);
        navigate("/login");
      },
    });
  };
  const resendCode = () =>
    resend.mutate({ email: form.email }, { onSuccess: cooldown.start });
  return (
    <main className="flex min-h-[calc(100vh-13rem)] items-center justify-center bg-[#f7f8f2] px-4 py-10">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-xl sm:p-12"
      >
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
          Reset password
        </p>
        <h1 className="mt-3 text-4xl font-black">Choose a new password.</h1>
        <div className="mt-8 space-y-4">
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            className="input h-12 w-full border-slate-300 bg-slate-50"
          />
          <button
            type="button"
            onClick={resendCode}
            disabled={resend.isPending || cooldown.isCoolingDown || !form.email}
            className="btn btn-ghost w-full text-emerald-700"
          >
            {resend.isPending
              ? "Sending..."
              : cooldown.isCoolingDown
                ? `Send again in ${cooldown.remaining}s`
                : "Send a new code"}
          </button>
          <input
            required
            inputMode="numeric"
            pattern="[0-9]{6}"
            placeholder="6-digit OTP"
            value={form.otp}
            onChange={(event) => setForm({ ...form, otp: event.target.value })}
            className="input h-12 w-full border-slate-300 bg-slate-50"
          />
          <input
            required
            minLength="6"
            type="password"
            placeholder="New password"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
            className="input h-12 w-full border-slate-300 bg-slate-50"
          />
        </div>
        {mutation.isError && (
          <p className="mt-4 text-sm text-rose-600" role="alert">
            {getErrorMessage(mutation.error)}
          </p>
        )}
        <button
          disabled={mutation.isPending}
          className="btn mt-6 h-12 w-full border-0 bg-[#123c35] text-white"
        >
          {mutation.isPending ? "Updating..." : "Update password"}
        </button>
        <Link
          to="/login"
          className="mt-6 block text-center text-sm font-bold text-emerald-700"
        >
          Back to sign in
        </Link>
      </form>
    </main>
  );
};

export default ResetPassword;
