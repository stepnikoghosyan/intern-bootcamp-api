import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

// services
import { UsersService } from '../../users/users.service';
import { ConfigEnum } from '../../../shared/interfaces/config-enum.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      secretOrKey: configService.get(ConfigEnum.JWT_PRIVATE_KEY),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }, async (payload: any, done: VerifiedCallback) => {
      try {
        const user = await this.usersService.getByID(payload.id);
        if (user) {
          return done(null, user.toJSON());
        }

        return done(null, false);
      } catch (ex) {
        return done(ex, false);
      }
    });
  }
}
