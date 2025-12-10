import { BuildProgress } from "@/components/BuildProgress"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { navigate } from "vike/client/router"

type FilterType = "all" | "failed"

const FILTER_STORAGE_KEY = "admin-build-filter"

export default function Admin() {
  const [filter, setFilter] = useState<FilterType>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(FILTER_STORAGE_KEY)
      if (saved === "all" || saved === "failed") {
        return saved
      }
    }
    return "failed"
  })

  useEffect(() => {
    localStorage.setItem(FILTER_STORAGE_KEY, filter)
  }, [filter])
  const isAdmin = useQuery(api.admin.isAdmin)
  const failedBuilds = useQuery(api.admin.listFailedBuilds)
  const allBuilds = useQuery(api.admin.listAllBuilds)
  const retryBuild = useMutation(api.admin.retryBuild)

  const builds = filter === "failed" ? failedBuilds : allBuilds

  // Show loading state
  if (isAdmin === undefined) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    )
  }

  // Redirect if not admin
  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-slate-400 mb-4">You must be an admin to access this page.</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    )
  }

  const handleRetry = async (buildId: Id<"builds">) => {
    try {
      await retryBuild({ buildId })
      toast.success("Build retry initiated", {
        description: "The build has been queued with the latest YAML.",
      })
    } catch (error) {
      toast.error("Failed to retry build", {
        description: String(error),
      })
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin - Builds</h1>
        <p className="text-slate-400 mb-4">
          View and manage builds. Retry failed builds with the latest GitHub Actions workflow YAML.
        </p>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-cyan-600 hover:bg-cyan-700" : ""}
          >
            All Builds
          </Button>
          <Button
            variant={filter === "failed" ? "default" : "outline"}
            onClick={() => setFilter("failed")}
            className={filter === "failed" ? "bg-cyan-600 hover:bg-cyan-700" : ""}
          >
            Failed Builds
          </Button>
        </div>
      </header>

      <main>
        {builds === undefined ? (
          <div className="text-center text-slate-400 py-12">Loading builds...</div>
        ) : builds.length === 0 ? (
          <div className="text-center text-slate-400 py-12">No {filter === "failed" ? "failed " : ""}builds found.</div>
        ) : (
          <div className="space-y-4">
            {builds.map(build => (
              <div key={build._id} className="space-y-4">
                <BuildProgress build={build} isAdmin={true} onRetry={handleRetry} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
