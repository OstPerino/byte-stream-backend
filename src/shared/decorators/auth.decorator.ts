import { applyDecorators, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/shared/guards/auth.guard';

export function Authorization() {
  return applyDecorators(UseGuards(AuthGuard));
}
