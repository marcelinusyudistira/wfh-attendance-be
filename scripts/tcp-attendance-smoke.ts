import 'dotenv/config';

import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

async function main() {
  const host = process.env.ATTENDANCE_MS_HOST ?? '127.0.0.1';
  const port = Number(process.env.ATTENDANCE_MS_PORT ?? 4002);

  const client = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: { host, port },
  });

  await client.connect();

  const employeeId = `smoke-${Date.now()}`;

  const checkInRes = await firstValueFrom(
    client
      .send('attendance.checkIn', {
        employeeId,
        photo: 'checkin.jpg',
        latitude: -6.2,
        longitude: 106.8,
      })
      .pipe(timeout(5000)),
  );

  // eslint-disable-next-line no-console
  console.log('checkIn:', checkInRes);

  const checkOutRes = await firstValueFrom(
    client
      .send('attendance.checkOut', {
        employeeId,
        photo: 'checkout.jpg',
        latitude: -6.2,
        longitude: 106.8,
      })
      .pipe(timeout(5000)),
  );

  // eslint-disable-next-line no-console
  console.log('checkOut:', checkOutRes);

  await client.close();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
