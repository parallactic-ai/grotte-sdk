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

export const USER_CONFIG_PATH = path.join(os.homedir(), '.grotte', 'config.json') // TODO: Keep in Keychain

export const DOCS_BASE =
  process.env.GROTTE_DOCS_BASE ||
  `https://${process.env.GROTTE_DOMAIN || 'grotte.parallactic.fr'}/docs`

export const DASHBOARD_BASE =
  process.env.GROTTE_DASHBOARD_BASE ||
  `https://${process.env.GROTTE_DOMAIN || 'grotte.parallactic.fr'}/dashboard`

export const SANDBOX_INSPECT_URL = (sandboxId: string) =>
  `${DASHBOARD_BASE}/inspect/sandbox/${sandboxId}`

export function getUserConfig(): UserConfig | null {
  if (!fs.existsSync(USER_CONFIG_PATH)) return null
  return JSON.parse(fs.readFileSync(USER_CONFIG_PATH, 'utf8'))
}
