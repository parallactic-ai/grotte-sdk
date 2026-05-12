import * as tablePrinter from 'console-table-printer'
import * as commander from 'commander'

import { ensureAPIKey } from 'src/api'
import { asBold } from 'src/utils/format'
import { Sandbox } from 'grotte'

const PAGE_LIMIT = 100

export const listCommand = new commander.Command('list')
  .description('list snapshots')
  .alias('ls')
  .option('-s, --sandbox <sandboxID>', 'filter snapshots by source sandbox ID')
  .option('-f, --format <format>', 'output format, eg. json, pretty')
  .action(async (options: { sandbox?: string; format?: string }) => {
    try {
      const apiKey = ensureAPIKey()
      const format = options.format || 'pretty'

      const snapshots: { snapshotId: string }[] = []
      const iterator = Sandbox.listSnapshots({
        apiKey,
        sandboxId: options.sandbox,
        limit: PAGE_LIMIT,
      })

      while (iterator.hasNext) {
        const batch = await iterator.nextItems()
        snapshots.push(...batch)
      }

      if (format === 'json') {
        console.log(JSON.stringify(snapshots, null, 2))
        return
      }

      if (format !== 'pretty') {
        console.error(`Unsupported output format: ${format}`)
        process.exit(1)
      }

      if (snapshots.length === 0) {
        console.log('No snapshots found.')
        console.log(
          `Create one: ${asBold('grotte snapshot create <sandbox-id>')}`
        )
        return
      }

      const table = new tablePrinter.Table({
        title: 'Snapshots',
        columns: [
          { name: 'snapshotId', alignment: 'left', title: 'Snapshot ID' },
        ],
        rows: snapshots,
        style: {
          headerTop: { left: '', right: '', mid: '', other: '' },
          headerBottom: { left: '', right: '', mid: '', other: '' },
          tableBottom: { left: '', right: '', mid: '', other: '' },
          vertical: '',
        },
      })
      table.printTable()
      process.stdout.write('\n')
    } catch (err: unknown) {
      console.error(err)
      process.exit(1)
    }
  })
