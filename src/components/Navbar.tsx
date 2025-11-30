import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img
              src="/favicon-96x96.png"
              alt="Mesh Forge logo"
              className="h-10 w-10 rounded-lg"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Mesh Forge
            </span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
