import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-[#123c35]/15 bg-[#123c35] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:grid-cols-[1fr_auto] sm:items-end lg:px-8">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-xl font-black tracking-tight"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e8c547] text-sm text-[#123c35]">
              D
            </span>
            Daymark
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-emerald-100">
            A simple place to turn good intentions into visible progress.
          </p>
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
            Keep moving forward
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-4 text-xs text-emerald-200/70 lg:px-8">
          © 2026 Daymark. Built for the next step.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
