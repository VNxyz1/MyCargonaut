import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const fileInterceptor = () => {
  return FileInterceptor('cargoImg', {
    storage: diskStorage({
      destination: './uploads/cargo-images',
      filename: (req: any, file, callback) => {
        const uniquSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const prefix = req.session.userData.id;
        const ext = extname(file.originalname);
        const filename = `ci-${prefix}-${uniquSuffix}${ext}`;
        callback(null, filename);
      },
    }),
  });
};
