import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/apiErrors";
import useCooldown from "../hooks/useCooldown";

const VerifyEmail = () => {
  const { useVerifyEmail, useResendVerification } = useAuth();
  const verify = useVerifyEmail();
  const resend = useResendVerification();
  const cooldown = useCooldown(30);
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: location.state?.email || "",
    otp: "",
  });

  const submit = (event) => {
    event.preventDefault();
    verify.mutate(form, { onSuccess: () => navigate("/") });
  };

  return (
    <main className="flex min-h-[calc(100vh-13rem)] items-center justify-center bg-[#f7f8f2] px-4 py-10">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-xl sm:p-12"
      >
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
          Verify your email
        </p>
        <h1 className="mt-3 text-4xl font-black">One last step.</h1>
        <p className="mt-3 text-slate-500">
          Enter the 6-digit code sent to your email.
        </p>
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
          <input
            required
            inputMode="numeric"
            pattern="[0-9]{6}"
            placeholder="6-digit code"
            value={form.otp}
            onChange={(event) => setForm({ ...form, otp: event.target.value })}
            className="input h-12 w-full border-slate-300 bg-slate-50"
          />
        </div>
        {verify.isError && (
          <p className="mt-4 text-sm text-rose-600" role="alert">
            {getErrorMessage(verify.error)}
          </p>
        )}
        <button
          disabled={verify.isPending}
          className="btn mt-6 h-12 w-full border-0 bg-[#123c35] text-white"
        >
          {verify.isPending ? "Verifying..." : "Verify email"}
        </button>
        <button
          type="button"
          disabled={resend.isPending || cooldown.isCoolingDown || !form.email}
          onClick={() => resend.mutate({ email: form.email }, { onSuccess: cooldown.start })}
          className="btn btn-ghost mt-3 h-10 w-full text-emerald-700"
        >
          {resend.isPending ? "Sending..." : cooldown.isCoolingDown ? `Send again in ${cooldown.remaining}s` : "Send a new code"}
        </button>
        <Link
          to="/login"
          className="mt-5 block text-center text-sm font-bold text-emerald-700"
        >
          Back to sign in
        </Link>
      </form>
    </main>
  );
};

export default VerifyEmail;
