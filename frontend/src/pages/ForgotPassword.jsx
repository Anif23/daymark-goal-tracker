import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/apiErrors";
import { toast } from "react-toastify";
import useCooldown from "../hooks/useCooldown";

const ForgotPassword = () => {
  const { useForgotPassword } = useAuth();
  const mutation = useForgotPassword();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const cooldown = useCooldown(30);

  const submit = (event) => {
    event.preventDefault();
    mutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          cooldown.start();
          navigate("/reset-password", { state: { email } });
        },
      },
    );
  };

  return (
    <main className="flex min-h-[calc(100vh-13rem)] items-center justify-center bg-[#f7f8f2] px-4 py-10">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-xl sm:p-12"
      >
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
          Account recovery
        </p>
        <h1 className="mt-3 text-4xl font-black">Forgot your password?</h1>
        <p className="mt-3 text-slate-500">
          Enter your email and we will send a one-time reset code.
        </p>
        <label className="mt-8 block text-sm font-bold">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input mt-2 h-12 w-full border-slate-300 bg-slate-50"
            placeholder="you@example.com"
          />
        </label>
        {mutation.isError && (
          <p className="mt-4 text-sm text-rose-600" role="alert">
            {getErrorMessage(mutation.error)}
          </p>
        )}
        <button
          disabled={mutation.isPending || cooldown.isCoolingDown}
          className="btn mt-6 h-12 w-full border-0 bg-[#123c35] text-white"
        >
          {mutation.isPending ? "Sending code..." : cooldown.isCoolingDown ? `Sent. Try again in ${cooldown.remaining}s` : "Send reset code"}
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

export default ForgotPassword;
