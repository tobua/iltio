const configuration = {
  async rewrites() {
    return [
      {
        source: '/v/:path',
        destination: '/verify?token=:path',
      },
    ]
  },
}

export default configuration
