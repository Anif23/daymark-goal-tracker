import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/apiErrors";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const {
    useGetMe,
    useUpdateProfile,
    useChangePassword,
    useRequestVerification,
  } = useAuth();
  const { data } = useGetMe();
  const mutation = useUpdateProfile();
  const passwordMutation = useChangePassword();
  const verificationMutation = useRequestVerification();
  const navigate = useNavigate();
  const user = data?.user || {};
  const verificationEmail = user.pendingEmail || user.email || "";
  const [form, setForm] = useState({
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
  });
  const [initialForm, setInitialForm] = useState({
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (data?.user) {
      const profile = {
        name: data.user.name || "",
        username: data.user.username || "",
        email: data.user.email || "",
      };
      setForm(profile);
      setInitialForm(profile);
    }
  }, [data]);

  const isProfileChanged =
    form.name !== initialForm.name ||
    form.username !== initialForm.username ||
    form.email !== initialForm.email;

  const submit = (event) => {
    event.preventDefault();
    mutation.mutate(form, {
      onSuccess: (result) => {
        toast.success(result.message || "Profile updated");
        if (result.requiresVerification)
          navigate("/verify-email", { state: { email: result.email } });
      },
    });
  };

  const submitPassword = (event) => {
    event.preventDefault();
    passwordMutation.mutate(passwordForm, {
      onSuccess: () =>
        setPasswordForm({ currentPassword: "", newPassword: "" }),
    });
  };

  const requestVerification = () => {
    verificationMutation.mutate(undefined, {
      onSuccess: (result) =>
        navigate("/verify-email", {
          state: { email: result.email || verificationEmail },
        }),
    });
  };

  return (
    <main className="flex min-h-[calc(100vh-13rem)] items-center justify-center bg-[#f7f8f2] px-4 py-10">
      <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
        <form
          onSubmit={submit}
          className="rounded-[2rem] bg-white p-8 shadow-xl sm:p-12"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
            Your profile
          </p>
          <h1 className="mt-3 text-4xl font-black">Make it yours.</h1>
          <p className="mt-3 text-slate-500">
            Keep your account details current.
          </p>
          <div className="mt-8 space-y-4">
            <label className="block text-sm font-bold">
              Full name
              <input
                required
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                className="input mt-2 h-12 w-full border-slate-300 bg-slate-50"
              />
            </label>
            <label className="block text-sm font-bold">
              Username
              <input
                required
                value={form.username}
                onChange={(event) =>
                  setForm({ ...form, username: event.target.value })
                }
                className="input mt-2 h-12 w-full border-slate-300 bg-slate-50"
              />
            </label>
            <label className="block text-sm font-bold">
              Email
              <div className="mt-2 flex gap-2">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  className="input h-12 min-w-0 flex-1 border-slate-300 bg-slate-50"
                />
                {!user.emailVerified && (
                  <button
                    type="button"
                    onClick={requestVerification}
                    disabled={verificationMutation.isPending}
                    className="btn h-12 bg-[#e8c547] text-slate-950"
                  >
                    {verificationMutation.isPending ? "Sending..." : "Verify"}
                  </button>
                )}
              </div>
              {!user.emailVerified && (
                <p className="mt-2 text-xs font-semibold text-amber-700">
                  Verify your email to use goals.
                </p>
              )}
            </label>
          </div>
          {mutation.isError && (
            <p className="mt-4 text-sm text-rose-600" role="alert">
              {getErrorMessage(mutation.error)}
            </p>
          )}
          <button
            type="submit"
            disabled={mutation.isPending || !isProfileChanged}
            className="btn mt-6 h-12 w-full border-0 bg-[#123c35] text-white"
          >
            {mutation.isPending ? "Saving..." : "Save profile"}
          </button>
        </form>
        <form
          onSubmit={submitPassword}
          className="rounded-[2rem] bg-[#123c35] p-8 text-white shadow-xl sm:p-12"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e8c547]">
            Security
          </p>
          <h2 className="mt-3 text-3xl font-black">Change password.</h2>
          <p className="mt-3 text-emerald-100">
            Use your current password to choose a new one.
          </p>
          <div className="mt-8 space-y-4">
            <label className="block text-sm font-bold text-emerald-50">
              Current password
              <input
                required
                type="password"
                autoComplete="current-password"
                value={passwordForm.currentPassword}
                onChange={(event) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: event.target.value,
                  })
                }
                className="input mt-2 h-12 w-full border-0 bg-white text-slate-900"
              />
            </label>
            <label className="block text-sm font-bold text-emerald-50">
              New password
              <input
                required
                minLength="6"
                type="password"
                autoComplete="new-password"
                value={passwordForm.newPassword}
                onChange={(event) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: event.target.value,
                  })
                }
                className="input mt-2 h-12 w-full border-0 bg-white text-slate-900"
              />
            </label>
          </div>
          {passwordMutation.isError && (
            <p className="mt-4 text-sm text-rose-200" role="alert">
              {getErrorMessage(passwordMutation.error)}
            </p>
          )}
          <button
            disabled={passwordMutation.isPending}
            className="btn mt-6 h-12 w-full border-0 bg-[#e8c547] text-slate-950"
          >
            {passwordMutation.isPending ? "Changing..." : "Change password"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Profile;
