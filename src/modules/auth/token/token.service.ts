import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/modules/user/entities';
import { ConfigService } from '@nestjs/config';

interface ITokenPayload {
  user: number;
  iat: number;
  exp: number;
  iss: string;
}

@Injectable()
export class TokenService {
  constructor(private jwt: JwtService, private config: ConfigService) {}
  issuer = this.config.get<string>('JWT_SECRET_OPTIONS_ISSUER');
  public async signAccessToken(user: UserEntity): Promise<string> {
    return await this.jwt.signAsync({ user: user.clm_id });
  }
  public async verifyAccessToken(
    token: string,
  ): Promise<ITokenPayload | undefined> {
    const payload: ITokenPayload = await this.jwt.verifyAsync(token);
    if (payload.iss !== this.issuer) {
      return undefined;
    }
    return payload;
  }
}
