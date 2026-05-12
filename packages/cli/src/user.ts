import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs'

/**
 * User configuration stored in ~/.grotte/config.json
 */
export interface UserConfig {
  email: string
  accessToken: string
  teamName: string
  teamId: string
  teamApiKey: string
  dockerProxySet?: boolean
}

export const USER_CONFIG_PATH = path.join(
  os.homedir(),
  '.grotte',
  'config.json'
) // TODO: Keep in Keychain

export const DOCS_BASE =
  process.env.GROTTE_DOCS_BASE ||
  `https://${process.env.GROTTE_DOMAIN || 'grotte.parallactic.fr'}/docs`

// The dashboard is hosted on its own subdomain (`app.<domain>`), distinct
// from the marketing/landing site at `<domain>`. Both honour
// GROTTE_DASHBOARD_BASE for full overrides.
export const DASHBOARD_BASE =
  process.env.GROTTE_DASHBOARD_BASE ||
  `https://app.${process.env.GROTTE_DOMAIN || 'grotte.parallactic.fr'}/dashboard`

// The dashboard's sandbox list page surfaces every active sandbox for
// the team — there's no per-sandbox inspect page yet, so we point the
// CLI's "inspect this sandbox" link at the list. The user can spot the
// sandbox by ID in the table.
export const SANDBOX_INSPECT_URL = (_sandboxId: string) =>
  `${DASHBOARD_BASE}/sandboxes`

export function getUserConfig(): UserConfig | null {
  if (!fs.existsSync(USER_CONFIG_PATH)) return null
  return JSON.parse(fs.readFileSync(USER_CONFIG_PATH, 'utf8'))
}
