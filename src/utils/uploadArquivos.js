import fs from 'fs';
import { v4 as uuid } from 'uuid';
import path from 'path';
import minioConfig from "../config/minioConfig.js"
import { sendError, sendResponse } from './mensagens.js';

export async function upload(file,bucket) {
        const extencaoDoArquivo = path.extname(file.originalname);
        const novoNomeArquivo = uuid();
        const objectName = `${novoNomeArquivo}${extencaoDoArquivo}`;

        await minioConfig.fPutObject(bucket, objectName, file.path);


        /*const tags = {
            'tag1': 'value1',
            'tag2': 'value2',
        };*/

        //await minioConfig.setObjectTagging(bucket, objectName, tags);

        fs.unlinkSync(file.path);

        return objectName
}

export async function find() {
    try {
        const objectName = req.params.nome;

        const stream = await minioConfig.getObject('imagens', objectName);

        stream.on('data', (chunk) => {
            res.write(chunk);
        })

        stream.on('end', () => {
            res.end();
        })

        stream.on('error', (err) => {
            return sendError(res, 500, err.message)
        })

    } catch (err) {
        return sendError(res, 500, err.message)
    }
}

export async function remove(nameFile,bucket) {  
        await minioConfig.removeObject(bucket, nameFile)
}