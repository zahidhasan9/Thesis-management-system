import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center"><section><Compass className="mx-auto text-blue-600" size={46}/><p className="mt-5 text-7xl font-bold text-slate-900">404</p><h1 className="mt-3 text-2xl font-semibold">Page not found</h1><p className="mt-2 text-slate-600">The page you requested does not exist or has moved.</p><Link to="/" className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white">Back to home</Link></section></main>;
}
