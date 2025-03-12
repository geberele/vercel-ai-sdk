import { generateSummary } from './summarization';
import messages from './messages.json';

const main = async () => {
  const summary = await generateSummary(messages);
  console.log(summary);
};

main().catch(console.error);
