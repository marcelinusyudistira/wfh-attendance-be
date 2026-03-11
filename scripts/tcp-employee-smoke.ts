import 'dotenv/config';

import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

async function main() {
  const host = process.env.EMPLOYEE_MS_HOST ?? '127.0.0.1';
  const port = Number(process.env.EMPLOYEE_MS_PORT ?? 4001);

  const email =
    getArgValue('--email') ??
    process.env.SMOKE_EMPLOYEE_EMAIL ??
    'hr.senior.ta01@local.test';

  const password =
    getArgValue('--password') ??
    process.env.SMOKE_EMPLOYEE_PASSWORD ??
    '19900101';

  const client = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: { host, port },
  });

  const send = async <TResponse, TPayload>(
    pattern: string,
    payload: TPayload,
  ) => {
    return firstValueFrom(
      client.send<TResponse, TPayload>(pattern, payload).pipe(timeout(5000)),
    );
  };

  // eslint-disable-next-line no-console
  console.log(`Connecting to employee-service TCP at ${host}:${port}`);

  const auth = await send<
    { sub: string; email: string; role: string },
    { email: string; password: string }
  >('employees.validateCredentials', { email, password });

  // eslint-disable-next-line no-console
  console.log('validateCredentials OK:', auth);

  const employee = await send<any, string>('employees.findOne', auth.sub);
  // eslint-disable-next-line no-console
  console.log('findOne OK:', employee);

  const roles = await send<any, Record<string, never>>('roles.findAll', {});
  // eslint-disable-next-line no-console
  console.log('roles.findAll OK:', roles);

  const departments = await send<any, Record<string, never>>(
    'departments.findAll',
    {},
  );
  // eslint-disable-next-line no-console
  console.log('departments.findAll OK:', departments);

  client.close();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('TCP smoke test failed:', err);
  process.exit(1);
});
