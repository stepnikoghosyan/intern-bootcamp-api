import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// services
import { TokensService } from './tokens.service';

// entities
import { Token } from './tokens.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../../shared/interfaces/config-enum.enum';

@Module({
  imports: [
    SequelizeModule.forFeature([Token]),
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
  ],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {
}
