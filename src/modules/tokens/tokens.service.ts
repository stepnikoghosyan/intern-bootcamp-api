import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

// services
import { BaseService } from '../../shared/base.service';

// entities
import { Token } from './tokens.entity';
import { UserTokenTypes } from './interfaces/token-types.model';
import { ConfigEnum, IConfig } from '../../shared/interfaces/config-enum.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IToken } from './interfaces/token.model';

@Injectable()
export class TokensService extends BaseService<Token> {
  constructor(
    @InjectModel(Token) private readonly model: typeof Token,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super(model);
  }

  public findToken(tokenID: number, userID: number): Promise<Token> {
    return this.model.findOne({
      where: {
        id: tokenID,
        userId: userID,
      },
    });
  }

  public async saveToken(type: UserTokenTypes, userID: number, expiresIn?: IConfig[ConfigEnum.JWT_EXPIRE]): Promise<IToken> {
    // const accessToken = await this.jwtService.signAsync(payload, {
    //   privateKey,
    //   expiresIn: this.configService.get(ConfigEnum.JWT_EXPIRE),
    //   algorithm: this.configService.get(ConfigEnum.JWT_SIGN_ALGORITHM),
    // });

    // Generate token and save to db and get id of user_token from db
    const prevToken = await this.jwtService.signAsync({ userID }, {
      privateKey: this.configService.get(ConfigEnum.JWT_PRIVATE_KEY),
      expiresIn,
      algorithm: this.configService.get(ConfigEnum.JWT_SIGN_ALGORITHM),
    });
    const result = await this.model.create({
      token: prevToken,
      userId: userID,
      type,
    });

    // Update token with tokenID so that we find it with tokenID, not with token
    const newToken = await this.jwtService.signAsync({ userId: userID, tokenId: result.id }, {
      privateKey: this.configService.get(ConfigEnum.JWT_PRIVATE_KEY),
      expiresIn,
      algorithm: this.configService.get(ConfigEnum.JWT_SIGN_ALGORITHM),
    });

    // Update token in db
    await result.update({
      token: newToken,
    }, { where: { id: result.id } });

    return {
      id: result.id,
      userID: result.userId,
      token: newToken,
      type,
    };
  }

  public deleteToken(id: number): Promise<number> {
    return this.model.destroy({ where: { id } });
  }
}
