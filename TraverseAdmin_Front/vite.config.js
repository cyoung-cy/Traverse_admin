import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "child_process"; // 추가

// 8082번 포트 강제 종료
try {
  execSync("npx kill-port 8082", { stdio: "ignore" });
  console.log("✅ Port 8082 cleared.");
} catch (error) {
  console.log("⚠️ Port 8082 was not in use.");
}

// Vite 설정
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true, // 8082번 포트가 사용 중이면 실행 중단
    proxy: {
      "/api": {
        target: "http://localhost:8081", // 여기의 target은 필요에 따라 변경
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});