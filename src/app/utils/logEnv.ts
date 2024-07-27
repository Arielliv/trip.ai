// utils/logEnv.ts
export const logEnvVariables = () => {
  console.log('Environment Variables:');
  console.log('----------------------');

  const envVars = [
    'MONGODB_URI',
    'NEXT_PUBLIC_API_URL',
    'NEXTAUTH_SECRET',
    'NEXT_AUTH_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
    'OPENAI_API_KEY',
  ];

  envVars.forEach((varName) => {
    console.log(`${varName}: ${process.env[varName]}`);
  });

  console.log('----------------------');
};
