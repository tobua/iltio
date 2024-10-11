export default {
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['test/*.test.*'],
    alias: {
      // Not yet testing React Native code, would require use of Jest.
      'react-native': 'react-dom',
    },
    retry: 3,
  },
}
