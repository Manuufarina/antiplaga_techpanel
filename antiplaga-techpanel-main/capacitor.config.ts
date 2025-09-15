import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.antiplaga.norte',
  appName: 'Antiplaga Norte',
  webDir: 'dist',
  android: {
    buildOptions: {
      keystorePath: 'antiplaga.jks',
      keystoreAlias: 'key0',
      keystorePassword: 'antiplaga',
      keyPassword: 'antiplaga'
    }
  }
};

export default config;
