import { generateSummary } from './summarization';
import messages from './messages.json';
import { logUsage } from '../../lib/utils';

const main = async () => {
  const result = await generateSummary(messages);
  console.log(result.object);
  logUsage(result.usage);
};

main().catch(console.error);
