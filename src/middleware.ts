import createMiddleware from 'next-intl/middleware';
import { routing } from '@/shared/i18n';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(pt-BR|en-US|es-ES)/:path*'],
};
