import { InternalServerErrorException } from '@nestjs/common';
import { configDotenv } from 'dotenv';

configDotenv();

export const getEvnPath = () => {
  const nodeEnv = process.env.NODE_ENV;

  console.log({ nodeEnv });

  const allowedEnvConst = [
    'local',
    'development',
    'test',
    'production',
    'staging',
  ];

  if (!allowedEnvConst.includes(nodeEnv))
    throw new InternalServerErrorException(
      `${nodeEnv} parameter does not specified in .env file`,
    );

  return `.env.${nodeEnv}`;
};
