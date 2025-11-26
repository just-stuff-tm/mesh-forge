import { useQuery } from 'convex/react'
import { useNavigate } from 'react-router-dom'
import {
  ProfileCardContent,
  profileCardClasses,
} from '@/components/ProfileCard'
import { api } from '../../convex/_generated/api'

export default function Browse() {
  const navigate = useNavigate()
  const profiles = useQuery(api.profiles.listPublic)

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Public Profiles</h1>
          <p className="text-slate-400">
            Discover and explore firmware profiles shared by the community
          </p>
        </header>

        <main>
          {profiles === undefined ? (
            <div className="text-center text-slate-400 py-12">
              Loading profiles...
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              No public profiles available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <button
                  key={profile._id}
                  type="button"
                  onClick={() => navigate(`/profiles/${profile._id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigate(`/profiles/${profile._id}`)
                    }
                  }}
                  className={`${profileCardClasses} hover:bg-slate-900 cursor-pointer transition-colors text-left`}
                >
                  <ProfileCardContent profile={profile} />
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
