export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;

    // Remove trailing slash (except root)
    if (path !== '/' && path.endsWith('/')) {
      url.pathname = path.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // Serve via Pages asset
    return env.ASSETS.fetch(request);
  }
}
