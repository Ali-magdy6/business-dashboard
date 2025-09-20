const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/pages': path.resolve(__dirname, 'src/pages'),
      '@/store': path.resolve(__dirname, 'src/store'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
    },
  },
};

