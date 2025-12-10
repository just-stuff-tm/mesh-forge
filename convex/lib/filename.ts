/**
 * Generates the artifact filename base (without extension) matching the download filename format.
 * Format: meshtastic-{version}-{target}-{last4hash}-{jobId}-{artifactType}
 * This is the canonical implementation used by both Convex backend and frontend.
 *
 * @param version - The firmware version
 * @param target - The target board name
 * @param buildHash - The build hash (used to get last 4 characters)
 * @param githubRunId - The GitHub Actions run ID (optional, but required for actual downloads)
 * @param artifactType - Either "source" or "firmware"
 * @returns The filename base without extension (e.g., "meshtastic-v2.7.16-tbeam-a1b2-1234567890-source")
 */
export function getArtifactFilenameBase(
  version: string,
  target: string,
  buildHash: string,
  githubRunId: number | undefined,
  artifactType: "source" | "firmware"
): string {
  const os = "meshtastic"
  const last4Hash = buildHash.slice(-4)

  if (!githubRunId) {
    // If no githubRunId, fallback format (for builds that haven't completed yet)
    return `${os}-${version}-${target}-${last4Hash}-${artifactType}`
  }

  return `${os}-${version}-${target}-${last4Hash}-${githubRunId}-${artifactType}`
}
