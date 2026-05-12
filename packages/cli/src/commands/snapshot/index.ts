import * as commander from 'commander'

import { createCommand } from './create'
import { listCommand } from './list'

export const snapshotCommand = new commander.Command('snapshot')
  .description('manage sandbox snapshots')
  .alias('snap')
  .addCommand(createCommand)
  .addCommand(listCommand)
