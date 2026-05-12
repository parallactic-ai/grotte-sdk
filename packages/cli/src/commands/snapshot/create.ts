import * as commander from 'commander'

import { ensureAPIKey } from 'src/api'
import { asBold } from 'src/utils/format'
import { Sandbox, NotFoundError } from 'grotte'

export const createCommand = new commander.Command('create')
  .description('create a snapshot of a sandbox')
  .argument(
    '<sandboxID>',
    `create a snapshot of the sandbox specified by ${asBold('<sandboxID>')}`
  )
  .alias('cr')
  .action(async (sandboxID: string) => {
    try {
      const apiKey = ensureAPIKey()
      const snapshot = await Sandbox.createSnapshot(sandboxID, { apiKey })
      console.log('Snapshot created')
      console.log(`ID:      ${asBold(snapshot.snapshotId)}`)
      console.log(`Sandbox: ${asBold(sandboxID)}`)
    } catch (err: unknown) {
      if (err instanceof NotFoundError) {
        console.error(`Sandbox ${asBold(sandboxID)} wasn't found`)
        process.exit(1)
      }
      console.error(err)
      process.exit(1)
    }
  })
