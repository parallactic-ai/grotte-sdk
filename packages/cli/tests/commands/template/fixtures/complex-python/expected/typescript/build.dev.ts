import { Template, defaultBuildLogger } from 'grotte'
import { template } from './template'

async function main() {
  await Template.build(template, 'complex-python-app-dev', {
    onBuildLogs: defaultBuildLogger(),
  });
}

main().catch(console.error);