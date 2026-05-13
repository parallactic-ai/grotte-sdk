import * as grotte from 'grotte'
import * as commander from 'commander'
import * as path from 'path'

import { ensureAPIKey } from 'src/api'
import { spawnConnectedTerminal } from 'src/terminal'
import { asBold, asFormattedSandboxTemplate } from 'src/utils/format'
import { getRoot } from '../../utils/filesystem'
import { getConfigPath, loadConfig } from '../../config'
import fs from 'fs'
import { configOption, pathOption } from '../../options'
import { printDashboardSandboxInspectUrl } from 'src/utils/urls'

export function createCommand(
  name: string,
  alias: string,
  deprecated: boolean
) {
  return new commander.Command(name)
    .description('create sandbox and connect terminal to it')
    .argument(
      '[template]',
      `create and connect to sandbox specified by ${asBold('[template]')}`
    )
    .addOption(pathOption)
    .addOption(configOption)
    .option('-d, --detach', 'create sandbox without connecting terminal to it')
    .option(
      '-j, --json',
      'print sandbox creation result as JSON (implies --detach)'
    )
    .alias(alias)
    .action(
      async (
        template: string | undefined,
        opts: {
          name?: string
          path?: string
          config?: string
          detach?: boolean
          json?: boolean
        }
      ) => {
        if (deprecated) {
          console.warn(
            `Warning: The '${name}' command is deprecated and will be removed in future releases. Please use 'grotte sandbox create' instead.`
          )
        }
        try {
          const apiKey = ensureAPIKey()
          let templateID = template

          const root = getRoot(opts.path)
          const configPath = getConfigPath(root, opts.config)

          const config = fs.existsSync(configPath)
            ? await loadConfig(configPath)
            : undefined
          const relativeConfigPath = path.relative(root, configPath)

          if (!templateID && config) {
            console.log(
              `Found sandbox template ${asFormattedSandboxTemplate(
                {
                  templateID: config.template_id,
                  aliases: config.template_name
                    ? [config.template_name]
                    : undefined,
                },
                relativeConfigPath
              )}`
            )
            templateID = config.template_id
          }

          if (!templateID) {
            templateID = 'base'
          }

          const sandbox = await grotte.Sandbox.create(templateID, { apiKey })

          if (opts.json) {
            // Machine-readable mode — skip terminal attach + dashboard
            // URL banner so the only thing on stdout is the JSON payload.
            // CI/scripts can `grotte sandbox create base --json | jq`.
            process.stdout.write(
              JSON.stringify({
                sandboxId: sandbox.sandboxId,
                templateId: templateID,
                domain: sandbox.sandboxDomain,
              }) + '\n'
            )
            process.exit(0)
          }

          printDashboardSandboxInspectUrl(sandbox.sandboxId)

          if (!opts.detach) {
            await connectSandbox({ sandbox, template: { templateID } })
          } else {
            console.log(
              `Sandbox created with ID ${sandbox.sandboxId} using template ${templateID}`
            )
          }
          process.exit(0)
        } catch (err: any) {
          console.error(err)
          process.exit(1)
        }
      }
    )
}

export async function connectSandbox({
  sandbox,
  template,
}: {
  sandbox: grotte.Sandbox
  template: Pick<grotte.components['schemas']['Template'], 'templateID'>
}) {
  // keep-alive loop — track the in-flight promise so we can await it on shutdown
  let pendingKeepAlive: Promise<void> = Promise.resolve()
  const intervalId = setInterval(() => {
    pendingKeepAlive = sandbox.setTimeout(30_000)
  }, 5_000)

  console.log(
    `Terminal connecting to template ${asFormattedSandboxTemplate(
      template
    )} with sandbox ID ${asBold(`${sandbox.sandboxId}`)}`
  )
  try {
    await spawnConnectedTerminal(sandbox)
  } finally {
    clearInterval(intervalId)
    await pendingKeepAlive.catch(() => {})
    await sandbox.setTimeout(1_000)
    console.log(
      `Closing terminal connection to template ${asFormattedSandboxTemplate(
        template
      )} with sandbox ID ${asBold(`${sandbox.sandboxId}`)}`
    )
  }
}
