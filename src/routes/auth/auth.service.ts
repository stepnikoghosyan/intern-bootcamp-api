import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { ConfigEnum } from '../../shared/interfaces/config-enum.enum';
import { JwtService } from '@nestjs/jwt';
// services
import { BaseService } from '../../shared/base.service';
import { UsersService } from '../users/users.service';
import { TokensService } from '../../modules/tokens/tokens.service';
import { MailService } from '../../shared/modules/mail/mail.service';
// dto
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
// entities
import { User } from '../users/user.entity';

// dto
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResendActivationTokenDto } from './dto/resend-activation-token.dto';

// models
import { UserTokenTypes } from '../../modules/tokens/interfaces/token-types.model';
import { MailActions } from '../../shared/modules/mail/models/mail-actions.model';

// helpers
import { sendAccountVerificationEmail } from '../../shared/helpers/send-account-verification-email.helper';

@Injectable()
export class AuthService extends BaseService<User> {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super(User);
  }

  public async login(
    payload: UserLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.getUserByEmail(payload.email, true);
    if (!user || !(await compare(payload.password, user.password))) {
      throw new BadRequestException('Invalid email or password');
    }

    if (!user.activatedAt) {
      throw new ForbiddenException('Account is not activated');
    }

    return this.generateTokens(user.id);
  }

  public async register(payload: UserRegisterDto): Promise<void> {
    const existingUser = await this.usersService.getUserByEmail(payload.email);
    if (!!existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.usersService.createUser(payload);

    await sendAccountVerificationEmail({
      mailService: this.mailService,
      configService: this.configService,
      jwtService: this.jwtService,
      user: {
        id: user.id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
      },
    });
  }

  public async verifyAccount(query: any): Promise<void> {
    if (!query) {
      throw new BadRequestException('Invalid token');
    }

    const { activationToken }: { activationToken: string } = query;

    let decoded: { id: number };

    // Verify token
    try {
      decoded = this.jwtService.verify(activationToken, {
        secret: this.configService.get(ConfigEnum.JWT_PRIVATE_KEY),
      });
    } catch (ex) {
      throw new BadRequestException('Invalid activation token');
    }

    if (!!decoded && !!decoded.id) {
      // Verify account
      await this.usersService.activateUserAccount(decoded.id);
    } else {
      throw new BadRequestException('Invalid activation token.');
    }
  }

  public async forgotPassword(data: ForgotPasswordDto): Promise<void> {
    const { email } = data;
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!user.activatedAt) {
      throw new ForbiddenException('Account is not verified');
    }

    // TOKEN: userId, tokenId
    const activationToken = await this.tokensService.saveToken(
      UserTokenTypes.RESET_PASSWORD,
      user.id,
      '2h',
    );
    const WEB_DOMAIN = this.configService.get(ConfigEnum.WEB_DOMAIN);

    const resetPasswordUrl = [
      WEB_DOMAIN,
      'reset-password',
      activationToken.token,
    ].join('/');

    const isEmailSent = await this.mailService.sendMail(
      MailActions.FORGOT_PASSWORD,
      {
        to: email,
        templateData: {
          user: {
            fullName: `${user.firstName} ${user.lastName}`,
            email,
          },
          resetPasswordUrl,
        },
      },
    );

    if (!isEmailSent) {
      throw new InternalServerErrorException(
        'Could not send email. Please try again later.',
      );
    }
  }

  public async resetPassword(data: ResetPasswordDto): Promise<void> {
    const decoded = await this.jwtService.verify(data.token, {
      secret: this.configService.get(ConfigEnum.JWT_PRIVATE_KEY),
    });

    if (!decoded || !decoded.userId || !decoded.tokenId) {
      throw new BadRequestException('Invalid token');
    }

    const user = await this.usersService.getByID(decoded.userId);
    if (!user) {
      throw new BadRequestException('User with given id was not found');
    }

    if (!user.activatedAt) {
      throw new ForbiddenException('Account is not activated');
    }

    const userToken = await this.tokensService.findToken(
      decoded.tokenId,
      decoded.userId,
    );
    if (!userToken) {
      throw new BadRequestException('Invalid token.');
    }

    await this.usersService.changeUserPassword(user.id, data.newPassword);

    await this.tokensService.deleteToken(userToken.id);
  }

  public async resendActivationToken(
    data: ResendActivationTokenDto,
  ): Promise<void> {
    const user = await this.usersService.getUserByEmail(data.email);
    if (!!user) {
      throw new ConflictException('User not found');
    }

    if (!!user.activatedAt) {
      throw new BadRequestException('Account is already verified');
    }

    await sendAccountVerificationEmail({
      mailService: this.mailService,
      configService: this.configService,
      jwtService: this.jwtService,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  }

  public async refreshTokens(
    payload: RefreshTokensDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!payload.refreshToken) {
      throw new UnauthorizedException('Unauthorized. refreshToken is required');
    }

    let decoded: { id: number };

    try {
      decoded = await this.jwtService.verify(payload.refreshToken);
    } catch (ex) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!decoded || !decoded.id) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.usersService.getByID(decoded.id);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.generateTokens(decoded.id);
  }

  private async generateTokens(
    userID: number,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      id: userID,
    };

    const privateKey = this.configService.get(ConfigEnum.JWT_PRIVATE_KEY);

    const accessToken = await this.jwtService.signAsync(payload, {
      privateKey,
      expiresIn: this.configService.get(ConfigEnum.JWT_EXPIRE),
      algorithm: this.configService.get(ConfigEnum.JWT_SIGN_ALGORITHM),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      privateKey,
      expiresIn: this.configService.get<string>(ConfigEnum.JWT_REFRESH_EXPIRE),
      algorithm: this.configService.get(ConfigEnum.JWT_SIGN_ALGORITHM),
    });

    return { accessToken, refreshToken };
  }
}
