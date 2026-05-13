import * as commander from 'commander'

import { ensureAPIKey } from 'src/api'
import { asBold } from 'src/utils/format'
import { Sandbox, NotFoundError } from 'grotte'

export const deleteCommand = new commander.Command('delete')
  .description('delete a snapshot')
  .argument(
    '<snapshotID>',
    `delete the snapshot specified by ${asBold('<snapshotID>')}`
  )
  .alias('rm')
  .action(async (snapshotID: string) => {
    try {
      const apiKey = ensureAPIKey()
      await Sandbox.deleteSnapshot(snapshotID, { apiKey })
      console.log(`Snapshot ${asBold(snapshotID)} deleted`)
    } catch (err: unknown) {
      if (err instanceof NotFoundError) {
        console.error(`Snapshot ${asBold(snapshotID)} wasn't found`)
        process.exit(1)
      }
      console.error(err)
      process.exit(1)
    }
  })
