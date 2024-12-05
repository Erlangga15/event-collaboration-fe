/* eslint-disable no-console */
import { showLogger } from '@/constant/env';

export const logger = (data: unknown, comment?: string): void => {
  if (!showLogger) return;

  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '';
  const timestamp = new Date().toISOString();

  console.log(
    '%c ============== INFO LOG \n',
    'color: #22D3EE',
    `[${timestamp}] ${pathname}\n`,
    `=== ${comment ?? ''}\n`,
    data
  );
};

export default logger;
