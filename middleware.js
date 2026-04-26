export default function middleware(request) {
  const host = request.headers.get('host') || ''
  const url = request.url

  // www.sketto.io → sketto.io にリダイレクト
  if (host.startsWith('www.')) {
    const newUrl = url.replace('://www.', '://')
    return Response.redirect(newUrl, 308)
  }

  // stg.sketto.io のみBasic認証
  if (host.includes('stg.sketto.io') || host.includes('stg-')) {
    const basicAuth = request.headers.get('authorization')

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      const [user, pwd] = atob(authValue).split(':')

      if (user === 'sketto' && pwd === 'a%gngeWuF2BY%#t6r@Lb') {
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
