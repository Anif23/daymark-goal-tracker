import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { useLogout, useGetMe } = useAuth();
  const { data: authData } = useGetMe();
  const logout = useLogout();

  return (
    <header className="border-b border-slate-200 bg-[#f7f8f2]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-700">
            Daymark
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight">
            Your goals, in motion.
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {authData?.user && (
            <>
              <Link
                to="/goals/completed"
                className="hidden text-sm font-semibold text-slate-600 hover:text-emerald-700 sm:block"
              >
                Completed
              </Link>
              <Link
                to="/goals/favorites"
                className="hidden text-sm font-semibold text-slate-600 hover:text-emerald-700 sm:block"
              >
                Favorites
              </Link>
              <Link
                to="/profile"
                aria-label="Open profile"
                title="Open profile"
                className="grid h-10 w-10 place-items-center rounded-full bg-[#e8c547] font-black text-[#123c35] hover:bg-[#f1d45e]"
              >
                {(authData.user.name || "M").trim().charAt(0).toUpperCase()}
              </Link>
            </>
          )}
          {authData?.user && (
            <button
              className="btn btn-sm btn-outline border-slate-300"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              {logout.isPending ? "Signing out..." : "Sign out"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
