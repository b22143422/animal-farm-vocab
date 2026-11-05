import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 프로젝트 저장소: /저장소명/ 아래에서 자산 경로를 올바르게 처리
// 저장소명이 다르면 아래 base만 변경하면 됩니다.
export default defineConfig({
  plugins: [react()],
  base: '/animal-farm-vocab/',
});
