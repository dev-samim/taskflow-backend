import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from './schemas/refresh-token.schema';
import { Model } from 'mongoose';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
  ) {}

  async createNewRefresh(id: string, rawRefreshToken: string) {
    const token = new this.refreshTokenModel({
      user: id,
      token: rawRefreshToken,
      isRevoked: false,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    await token.save();
    return token;
  }
  
  async revokeToken(id :string, tokenId : string){
    const token = await this.refreshTokenModel.updateOne({_id : tokenId, user : id},{$set : {isRevoked : true}})
    return
  }
}
