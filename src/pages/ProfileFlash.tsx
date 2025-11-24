import { useQuery } from 'convex/react'
import {
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Loader2,
  XCircle,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { humanizeStatus } from '@/lib/utils'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

export default function ProfileFlash() {
  const { id, target } = useParams<{
    id: string
    target: string
  }>()

  const data = useQuery(
    api.profiles.getProfileTarget,
    id && target ? { profileId: id as Id<'profiles'>, target } : 'skip'
  )

  if (data === undefined) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  if (data === null || !data.build) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to={`/profiles/${id}`}
            className="inline-flex items-center text-slate-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
          </Link>
          <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6">
            <p className="text-slate-400">Build not found</p>
          </div>
        </div>
      </div>
    )
  }

  const build = data.build

  const getStatusColor = (status: string) => {
    if (status === 'success') return 'text-green-400'
    if (status === 'failure') return 'text-red-400'
    return 'text-blue-400'
  }

  const getStatusIcon = (status: string) => {
    if (status === 'success') {
      return <CheckCircle className="w-6 h-6 text-green-500" />
    }
    if (status === 'failure') {
      return <XCircle className="w-6 h-6 text-red-500" />
    }
    return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
  }

  const githubActionUrl =
    build.githubRunId > 0
      ? `https://github.com/MeshEnvy/configurable-web-flasher/actions/runs/${build.githubRunId}`
      : null

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to={`/profiles/${id}`}
          className="inline-flex items-center text-slate-400 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
        </Link>

        <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {getStatusIcon(build.status)}
              <div>
                <h1 className="text-3xl font-bold">{target}</h1>
                <div className="flex items-center gap-2 text-slate-400 mt-1">
                  <span className={getStatusColor(build.status)}>
                    {humanizeStatus(build.status)}
                  </span>
                  <span>•</span>
                  <span>{new Date(build.startedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {githubActionUrl && (
            <div className="mt-4">
              <a
                href={githubActionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-cyan-400 hover:text-cyan-300"
              >
                View on GitHub Actions
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          )}

          {build.status === 'success' && build.artifactUrl && (
            <div className="mt-4">
              <a
                href={build.artifactUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  Download Firmware
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
