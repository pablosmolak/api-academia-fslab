import fs from 'fs';
import { v4 as uuid } from 'uuid';
import path from 'path';
import minioConfig from "../config/minioConfig.js"

export default class minioFunctions {

    static async upload(file, bucket) {
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

    static async find(objectName, bucketName) {
        let dataChunks = []

        const stream = await minioConfig.getObject(bucketName, objectName, (err, stream) => {
            if (err) {
                throw new Error(`Não foi possivel encontrar o arquivo`)
            }
            return (stream);
        });

        for await (const chunk of stream) {
            dataChunks.push(chunk);
        }

        const imageBuffer = Buffer.concat(dataChunks);

        return imageBuffer
    }

    static async remove(nameFile, bucket) {
        await minioConfig.removeObject(bucket, nameFile)
    }
}