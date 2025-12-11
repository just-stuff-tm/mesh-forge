import type { Doc } from "../_generated/dataModel"

/**
 * Computes flags string from build config.
 * Only excludes modules explicitly marked as excluded (config[id] === true).
 * Also includes plugin config options (e.g., diagnostics).
 *
 * @param config - Build configuration with modulesExcluded and pluginConfigs
 * @param registryData - Optional registry data for custom config options (not needed for diagnostics)
 */
export function computeFlagsFromConfig(
  config: Doc<"builds">["config"],
  registryData?: Record<string, { configOptions?: Record<string, { define: string }> }>
): string {
  const flags: string[] = []

  // Sort modules to ensure consistent order
  const moduleFlags = Object.keys(config.modulesExcluded)
    .sort()
    .filter(module => config.modulesExcluded[module])
    .map((moduleExcludedName: string) => `-D${moduleExcludedName}=1`)
  flags.push(...moduleFlags)

  // Add plugin config options (diagnostics is available for all plugins)
  if (config.pluginConfigs) {
    for (const [pluginSlug, pluginOptions] of Object.entries(config.pluginConfigs)) {
      // Handle diagnostics option (available for all plugins)
      if (pluginOptions.diagnostics) {
        // Convert plugin slug to uppercase define name (e.g., "lofs" -> "LOFS_PLUGIN_DIAGNOSTICS")
        const defineName = `${pluginSlug.toUpperCase().replace(/-/g, "_")}_PLUGIN_DIAGNOSTICS`
        flags.push(`-D${defineName}`)
      }

      // Handle other custom config options from registry (if any)
      if (registryData) {
        const plugin = registryData[pluginSlug]
        if (plugin?.configOptions) {
          for (const [optionKey, enabled] of Object.entries(pluginOptions)) {
            if (optionKey !== "diagnostics" && enabled) {
              const option = plugin.configOptions[optionKey]
              if (option?.define) {
                flags.push(`-D${option.define}`)
              }
            }
          }
        }
      }
    }
  }

  return flags.join(" ")
}
