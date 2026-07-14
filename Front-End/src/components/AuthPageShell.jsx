import { Link } from "react-router-dom";

export default function AuthPageShell({
  title,
  description,
  children,
  footer,
}) {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto grid min-h-[640px] max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        <section className="flex flex-col justify-between bg-slate-950 p-8 text-white sm:p-12">
          <div>
            <Link
              to="/"
              className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100"
            >
              PermisGo Auto
            </Link>

            <h1 className="mt-10 text-4xl font-bold leading-tight">
              Thesis Management System
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
              Secure account access, thesis submission, supervisor review and
              evaluation in one platform.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-6 text-slate-300">
            Verification and password reset links are time-limited and can only
            be used once.
          </div>
        </section>

        <section className="flex items-center p-6 sm:p-12">
          <div className="w-full">
            <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {description}
            </p>

            <div className="mt-8">{children}</div>

            {footer ? (
              <div className="mt-7 text-center text-sm text-slate-600">
                {footer}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
