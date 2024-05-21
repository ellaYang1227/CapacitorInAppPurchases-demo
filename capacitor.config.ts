import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.CapacitorInAppPurchases.app',
  appName: 'CapacitorInAppPurchases-demo',
  webDir: 'dist/CapacitorInAppPurchases-demo',
  server: {
    androidScheme: 'https'
  }
};

export default config;
