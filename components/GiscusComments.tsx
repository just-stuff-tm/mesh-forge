import type { Doc } from "@/convex/_generated/dataModel"
import { getBuildIdentifier } from "@/convex/lib/filename"
import { useEffect, useRef } from "react"

interface GiscusCommentsProps {
  build: Doc<"builds">
}

export function GiscusComments({ build }: GiscusCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Compute the data-term using build identifier
    const term = getBuildIdentifier(
      build.config.version,
      build.config.target,
      build.buildHash,
      build.config.pluginsEnabled
    )

    // Clear any existing script
    containerRef.current.innerHTML = ""

    // Create script element
    const script = document.createElement("script")
    script.src = "https://giscus.app/client.js"
    script.setAttribute("data-repo", "MeshEnvy/mesh-forge")
    script.setAttribute("data-repo-id", "R_kgDOQa32VQ")
    script.setAttribute("data-category", "Builds")
    script.setAttribute("data-category-id", "DIC_kwDOQa32Vc4CznuV")
    script.setAttribute("data-mapping", "specific")
    script.setAttribute("data-term", term)
    script.setAttribute("data-strict", "1")
    script.setAttribute("data-reactions-enabled", "1")
    script.setAttribute("data-emit-metadata", "0")
    script.setAttribute("data-input-position", "bottom")
    script.setAttribute("data-theme", "dark_tritanopia")
    script.setAttribute("data-lang", "en")
    script.crossOrigin = "anonymous"
    script.async = true

    containerRef.current.appendChild(script)

    // Cleanup function
    return () => {
      if (containerRef.current && containerRef.current.contains(script)) {
        containerRef.current.removeChild(script)
      }
    }
  }, [build])

  return <div ref={containerRef} className="mt-6" />
}
