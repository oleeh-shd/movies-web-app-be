import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { getEvnPath } from './utils/get-env-path.util';
import { CustomConfigService } from './custom-config.service';
import { AwsS3ConfigService } from './aws/aws-s3-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEvnPath(),
    }),
  ],
  providers: [CustomConfigService, AwsS3ConfigService],
  exports: [CustomConfigService, AwsS3ConfigService],
})
export class CustomConfigModule {}
