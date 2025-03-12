import fs from 'fs';
import { extractAppointmentDetails } from './extractAppointmentDetails';

// Import appointment
const appointmentFile = fs.readFileSync(
  'src/app/4-structured-extraction/appointment.txt',
  'utf-8'
);

const main = async () => {
  const appointment = await extractAppointmentDetails(appointmentFile);
  console.log(appointment);
};

main().catch(console.error);
