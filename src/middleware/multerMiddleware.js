import multer from 'multer'
import { sendError } from '../utils/mensagens.js';

export async function uploadMulter(req, res, next) {
    const upload = multer({ dest: 'uploads/' }).single('file');

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.message === "Unexpected field") {
                return sendError(res, 422, "O arquivo deve ser enviado no campo file!")
            }
        }

        if (!req.file) {
            return sendError(res, 422, "Nenhum arquivo foi enviado!")
        }

        next();
    });
}