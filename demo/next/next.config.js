module.exports = {
  async rewrites() {
    return [
      {
        source: '/v/:path',
        destination: '/verify?token=:path',
      },
    ]
  },
}
