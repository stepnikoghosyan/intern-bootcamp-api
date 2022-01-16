import { ObjectSchema, object, string, number } from '@hapi/joi';

// interfaces
import { ConfigEnum, IConfig } from '../interfaces/config-enum.enum';

export function validateEnvVariables(envVarsValues: IConfig): void {
  const envVarsSchema: ObjectSchema = object({
    [ConfigEnum.HOST]: string().hostname().required(),
    [ConfigEnum.PORT]: number().required(),
    [ConfigEnum.DOMAIN]: string().required(),
    [ConfigEnum.WEB_DOMAIN]: string().required(),

    [ConfigEnum.DATABASE_HOST]: string().required(),
    [ConfigEnum.DATABASE_PORT]: number().required(),
    [ConfigEnum.DATABASE_USERNAME]: string().required(),
    [ConfigEnum.DATABASE_PASSWORD]: string().required(),
    [ConfigEnum.DATABASE_NAME]: string().required(),
    [ConfigEnum.DATABASE_CONNECTION_LIMIT]: number().required(),

    [ConfigEnum.JWT_SIGN_ALGORITHM]: string().required().valid('RS256', 'HS256'),
    [ConfigEnum.JWT_EXPIRE]: string().required(),
    [ConfigEnum.JWT_REFRESH_EXPIRE]: string().required(),
    [ConfigEnum.JWT_PRIVATE_KEY]: string().required(),

    [ConfigEnum.HASH_SALT_ROUNDS]: number().required(),

    [ConfigEnum.ROOT_STORAGE_PATH]: string().required(),
    [ConfigEnum.ROOT_PUBLIC_STORAGE_PATH]: string().required(),
    [ConfigEnum.IMAGES_PATH]: string().required(),
    [ConfigEnum.PROFILE_PICTURES_IMAGES_PATH]: string().required(),
    [ConfigEnum.POSTS_IMAGES_PATH]: string().required(),

    [ConfigEnum.SENDGRID_API_KEY]: string().required(),
    [ConfigEnum.MAIL_FROM]: string().required(),
  });

  const { error } = envVarsSchema.validate(envVarsValues);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
}
