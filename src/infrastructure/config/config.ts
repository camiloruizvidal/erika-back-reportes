import * as dotenv from 'dotenv';

dotenv.config();

export class Config {
  static readonly puerto = Number(process.env.PORT);
  static readonly jwtKey = process.env.JWT_KEY;
}

const errors: string[] = [];
Object.keys(Config).forEach((key) => {
  if (
    Config[key] === null ||
    Config[key] === undefined ||
    `${Config[key]}`.trim() === ''
  ) {
    errors.push(`La variable de entorno ${key} es requerida`);
  }
});
if (errors.length > 0) {
  throw new Error(errors.join('\n'));
}
