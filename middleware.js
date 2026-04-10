export default function middleware(request) {
  const host = request.headers.get('host') || ''

  // stg.sketto.io のみBasic認証
  if (host.includes('stg.sketto.io') || host.includes('stg-')) {
    const basicAuth = request.headers.get('authorization')

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      const [user, pwd] = atob(authValue).split(':')

      if (user === 'sketto' && pwd === 'sketto') {
        return new Response(null, { status: 200, headers: { 'x-middleware-next': '1' } })
      }
    }

    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
        'Content-Type': 'text/plain',
      },
    })
  }

  // それ以外はそのまま通す
  return new Response(null, { status: 200, headers: { 'x-middleware-next': '1' } })
}

export const config = {
  matcher: '/:path*',
}