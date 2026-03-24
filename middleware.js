export default function middleware(request) {
  const basicAuth = request.headers.get('authorization')

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (user === 'sketto' && pwd === 'stg2026') {
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

export const config = {
  matcher: '/:path*',
}
