// tsconfig.node.json 파일이 vite.config.ts를 위해 존재함
// vite.config.ts는 브라우저가 아니라 Node.js가 읽어서 실행하는 빌드 설정 파일

import path from 'path';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  server: {
    host: true,
    // 서버 CORS가 localhost:5175만 허용한다 (HOUME-SERVER PR #697).
    // 포트가 사용 중일 때 다른 번호로 밀리면 CORS에 막히므로, 밀리지 않고 실패하게 한다
    port: 5175,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@apis': path.resolve(__dirname, 'src/shared/apis'),
      '@assets': path.resolve(__dirname, 'src/shared/assets'),
      '@components': path.resolve(__dirname, 'src/shared/components'),
      '@constants': path.resolve(__dirname, 'src/shared/constants'),
      '@hooks': path.resolve(__dirname, 'src/shared/hooks'),
      '@styles': path.resolve(__dirname, 'src/shared/styles'),
      // @types는 npm @types 스코프와 충돌하므로 사용 불가 → @shared/types/ 사용
      '@utils': path.resolve(__dirname, 'src/shared/utils'),
      '@store': path.resolve(__dirname, 'src/store'),
    },
  },
});
