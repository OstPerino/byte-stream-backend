import 'express-session';
import { SessionData } from 'express-session';

import type { SessionMetadata } from './session-meta.types.ts';

export interface ExpressSessionData extends SessionData {
  id: string;
}

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    createdAt: Date | string;
    metadata?: SessionMetadata;
  }
}
