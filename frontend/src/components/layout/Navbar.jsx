import { Link } from 'react-router-dom';
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-[#334155] px-6 py-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-white text-xl">SplitSmart<span className="text-indigo-400">Pro</span></Link>
    </nav>
  );
}
