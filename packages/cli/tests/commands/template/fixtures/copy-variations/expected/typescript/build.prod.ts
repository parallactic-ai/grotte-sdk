import { Template, defaultBuildLogger } from 'grotte'
import { template } from './template'

async function main() {
  await Template.build(template, 'copy-test', {
    onBuildLogs: defaultBuildLogger(),
  });
}

main().catch(console.error);