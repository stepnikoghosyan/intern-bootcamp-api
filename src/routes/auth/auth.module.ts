import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// modules
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../../modules/tokens/tokens.module';
import { MailModule } from '../../shared/modules/mail/mail.module';

// services
import { AuthService } from './auth.service';

// controllers
import { AuthController } from './auth.controller';

// models
import { ConfigEnum } from '../../shared/interfaces/config-enum.enum';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(ConfigEnum.JWT_PRIVATE_KEY),
        signOptions: {
          algorithm: configService.get<any>(ConfigEnum.JWT_SIGN_ALGORITHM),
          expiresIn: configService.get<string | number>(ConfigEnum.JWT_EXPIRE),
        },
      }),
    }),
    TokensModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
