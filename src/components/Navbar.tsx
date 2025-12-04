import { useAuthActions } from '@convex-dev/auth/react'
import { Authenticated, useQuery } from 'convex/react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { DiscordButton } from '@/components/DiscordButton'
import { api } from '../../convex/_generated/api'

export default function Navbar() {
  const { signOut } = useAuthActions()
  const isAdmin = useQuery(api.admin.isAdmin)

  return (
    <nav className="border-b border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
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
            <div className="flex items-center gap-4">
              <Authenticated>
                <Link
                  to="/dashboard"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Admin
                  </Link>
                )}
              </Authenticated>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DiscordButton
              variant="default"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-500/50"
            />
            <Authenticated>
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            </Authenticated>
          </div>
        </div>
      </div>
    </nav>
  )
}
