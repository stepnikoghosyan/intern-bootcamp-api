import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../interfaces/config-enum.enum';

export function getProfilePictureUrl(configService: ConfigService, imagePathInStorage?: string): string {
  if (!imagePathInStorage) {
    return null;
  }

  const names = [ConfigEnum.DOMAIN, ConfigEnum.ROOT_PUBLIC_STORAGE_PATH, ConfigEnum.IMAGES_PATH, ConfigEnum.PROFILE_PICTURES_IMAGES_PATH];
  return names.map(item => configService.get(item)).join('/') + `/${imagePathInStorage}`;
}
