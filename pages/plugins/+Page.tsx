import { PluginCard } from "@/components/PluginCard"
import { api } from "@/convex/_generated/api"
import registryData from "@/public/registry.json"
import { PluginDisplay } from "@/types"
import { useQuery } from "convex/react"
import { useEffect, useState } from "react"

function getGitHubOwnerRepo(repoUrl?: string): { owner: string; repo: string } | null {
  if (!repoUrl) return null
  try {
    const url = new URL(repoUrl)
    if (url.hostname === "github.com" || url.hostname === "www.github.com") {
      const pathParts = url.pathname.split("/").filter(Boolean)
      if (pathParts.length >= 2) {
        return { owner: pathParts[0], repo: pathParts[1] }
      }
    }
  } catch {
    // Invalid URL
  }
  return null
}

export default function PluginsPage() {
  const flashCounts = useQuery(api.plugins.getAll)
  const [githubStars, setGithubStars] = useState<Record<string, number>>({})

  const plugins = Object.entries(registryData).sort(([, pluginA], [, pluginB]) => {
    // Featured plugins first
    const featuredA = pluginA.featured ?? false
    const featuredB = pluginB.featured ?? false
    if (featuredA !== featuredB) {
      return featuredA ? -1 : 1
    }
    // Then alphabetical by name
    return pluginA.name.localeCompare(pluginB.name)
  })

  useEffect(() => {
    // Fetch GitHub stars for all plugins
    const fetchStars = async () => {
      const stars: Record<string, number> = {}
      const promises = plugins.map(async ([slug, plugin]) => {
        const ownerRepo = getGitHubOwnerRepo(plugin.repo)
        if (!ownerRepo) return

        try {
          const res = await fetch(`https://api.github.com/repos/${ownerRepo.owner}/${ownerRepo.repo}`)
          const data = await res.json()
          if (data.stargazers_count !== undefined) {
            stars[slug] = data.stargazers_count
          }
        } catch {
          // Silently fail if GitHub API is unavailable
        }
      })

      await Promise.all(promises)
      setGithubStars(stars)
    }

    fetchStars()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Plugin Registry</h1>
          <p className="text-slate-400 max-w-2xl">
            Browse community-developed plugins that extend Meshtastic firmware functionality. Featured plugins are shown
            first.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {plugins.map(([slug, plugin]) => {
            const pluginDisplay = plugin as PluginDisplay
            return (
              <PluginCard
                key={slug}
                variant="link"
                id={slug}
                name={pluginDisplay.name}
                description={pluginDisplay.description}
                imageUrl={pluginDisplay.imageUrl}
                featured={pluginDisplay.featured ?? false}
                repo={pluginDisplay.repo}
                homepage={pluginDisplay.homepage}
                version={pluginDisplay.version}
                downloads={flashCounts?.[slug]}
                stars={githubStars[slug]}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
