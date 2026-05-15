import * as commander from 'commander'

import { asBold } from './utils/format'

export const pathOption = new commander.Option(
  '-p, --path <path>',
  `change root directory where command is executed to ${asBold(
    '<path>'
  )} directory`
)

export const configOption = new commander.Option(
  '--config <grotte-toml>',
  `specify path to the GROTTE config toml. By default GROTTE tries to find ${asBold(
    './grotte.toml'
  )} in root directory. We recommend using the new build system (https://app.grotte.dev/docs/template/defining-template) that does not use config files.`
)

export const selectOption = new commander.Option(
  '-s, --select',
  'select multiple sandbox templates from interactive list'
)

export const selectMultipleOption = new commander.Option(
  '-s, --select',
  'select sandbox template from interactive list'
)

export const teamOption = new commander.Option(
  '-t, --team <team-id>',
  'specify the team ID that the operation will be associated with. You can find team ID in the team settings in the GROTTE dashboard (https://app.grotte.dev/dashboard?tab=team).'
)
