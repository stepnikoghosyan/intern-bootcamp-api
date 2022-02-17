import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SendGridModule } from '@anchan828/nest-sendgrid';

// modules
import { UsersModule } from './routes/users/users.module';
import { AuthModule } from './routes/auth/auth.module';
import { PostsModule } from './routes/posts/posts.module';

// interfaces
import { ConfigEnum, IConfig } from './shared/interfaces/config-enum.enum';

// helpers
import { getEntitiesList } from './entities-list.helper';

// passport strategies
import { JwtStrategy } from './routes/auth/passport-strategies/jwt.strategy';

// guards
import { JwtAuthGuard } from './shared/guards/jwt-auth-guard.service';
import { CommentsModule } from './routes/comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get<IConfig[ConfigEnum.DATABASE_HOST]>(
          ConfigEnum.DATABASE_HOST,
        ),
        port: +configService.get<IConfig[ConfigEnum.DATABASE_PORT]>(
          ConfigEnum.DATABASE_PORT,
        ),
        username: configService.get<IConfig[ConfigEnum.DATABASE_USERNAME]>(
          ConfigEnum.DATABASE_USERNAME,
        ),
        password: configService.get<IConfig[ConfigEnum.DATABASE_PASSWORD]>(
          ConfigEnum.DATABASE_PASSWORD,
        ),
        database: configService.get<IConfig[ConfigEnum.DATABASE_NAME]>(
          ConfigEnum.DATABASE_NAME,
        ),
        retryAttempts: +configService.get<
          IConfig[ConfigEnum.DATABASE_CONNECTION_LIMIT]
        >(ConfigEnum.DATABASE_CONNECTION_LIMIT),
        models: getEntitiesList(),
        synchronize: true,
      }),
    }),
    SendGridModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apikey: configService.get(ConfigEnum.SENDGRID_API_KEY),
      }),
    }),

    UsersModule,
    AuthModule,
    PostsModule,
    CommentsModule,
  ],

  providers: [
    JwtStrategy,
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
