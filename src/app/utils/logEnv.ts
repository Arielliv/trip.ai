// utils/logEnv.ts
export const logEnvVariables = () => {
  console.log('Environment Variables:');
  console.log('----------------------');

  const envVars = [
    'MONGODB_URI',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
    'NEXT_PUBLIC_GOOGLE_CLIENT_SECRET',
    'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
    'NEXT_PUBLIC_OPENAI_API_KEY',
  ];

  envVars.forEach((varName) => {
    console.log(`${varName}: ${process.env[varName]}`);
  });

  console.log('----------------------');
};
