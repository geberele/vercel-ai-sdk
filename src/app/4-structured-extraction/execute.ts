import fs from 'fs';
import { extractAppointmentDetails } from './extractAppointmentDetails';
import { logUsage } from '../../lib/utils';

// Import appointment
const appointmentFile = fs.readFileSync(
  'src/app/4-structured-extraction/appointment.txt',
  'utf-8'
);

const main = async () => {
  const result = await extractAppointmentDetails(appointmentFile);
  console.log(result.object);
  logUsage(result.usage);
};

main().catch(console.error);
