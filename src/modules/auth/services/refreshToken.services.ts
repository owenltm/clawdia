import { RefreshTokenRepository } from "../repositories/refreshToken.repository";

export class RefreshTokenService {
  async isRefreshTokenValid(tokenId: string): Promise<boolean> {
    const checkTokenIdExists = await RefreshTokenRepository.getByTokenId(tokenId);
    if (!checkTokenIdExists || checkTokenIdExists.isRevoked) {
      return false;
    }
    return true;
  }
}

export const refreshTokenService = new RefreshTokenService();