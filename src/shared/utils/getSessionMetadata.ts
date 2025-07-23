import * as DeviceDetector from 'device-detector-js';
import type { Request } from 'express';
import { lookup } from 'geoip-lite';
import * as countries from 'i18n-iso-countries';

import type { SessionMetadata } from '@/shared/types/session-meta.types';
import { isDev } from '@/shared/utils/is-dev';

// eslint-disable-next-line @typescript-eslint/no-require-imports
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

export function getSessionMetadata(
  req: Request,
  userAgent: string
): SessionMetadata {
  let ip: string | undefined;

  if (!isDev()) {
    const cfConnectingIp = req.headers['cf-connecting-ip'];
    const xForwardedFor = req.headers['x-forwarded-for'];

    if (Array.isArray(cfConnectingIp)) {
      ip = cfConnectingIp[0];
    } else {
      ip =
        cfConnectingIp ||
        ((typeof xForwardedFor === 'string'
          ? xForwardedFor?.split(',')[0]
          : req.ip) as string);
    }
  } else {
    ip = '173.166.164.121';
  }

  const location = lookup(ip);
  const device = new DeviceDetector().parse(userAgent);

  return {
    location: {
      country: countries.getName(location?.country as string, 'en') || 'N/A',
      city: location?.city || 'N/A',
      latitude: location?.ll[0] || 0,
      longitude: location?.ll[0] || 0
    },
    device: {
      browser: device.client?.name || 'N/A',
      os: device.os?.name || 'N/A',
      type: device.device?.type || 'N/A'
    },
    ip
  };
}
