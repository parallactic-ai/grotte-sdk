import { Template, defaultBuildLogger } from 'grotte'
import { template } from './template'

async function main() {
  await Template.build(template, 'copy-test-dev', {
    onBuildLogs: defaultBuildLogger(),
  });
}

main().catch(console.error);