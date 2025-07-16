import fs from 'fs';
import { v4 as uuid } from 'uuid';
import path from 'path';
import minioConfig from "../config/minioConfig.js"

export default class minioFunctions {

    static async upload(file, bucket) {

        let nomeArquivo = file.originalname

        const nomeSemExtensao = nomeArquivo.split('.').slice(0, -1).join('.');
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (!uuidRegex.test(nomeSemExtensao)) {
            const novoNomeArquivo = uuid();
            const extencaoDoArquivo = path.extname(file.originalname);

            nomeArquivo = `${novoNomeArquivo}${extencaoDoArquivo}`
        }

        await minioConfig.fPutObject(bucket, nomeArquivo, file.path);

        fs.unlinkSync(file.path);

        return nomeArquivo
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
        await minioConfig.removeObject(bucket, nameFile, (err) => {
            if (err) {
                throw new Error(`Não foi possivel encontrar o arquivo`)
            }
        })
    }

    static async removeAll(bucketName) {
        const objectsStream = minioConfig.listObjectsV2(bucketName, "", true);

        const objectsToDelete = [];
        for await (const obj of objectsStream) {
            objectsToDelete.push(obj.name);

            if (objectsToDelete.length >= 1000) {
                await minioConfig.removeObjects(bucketName, objectsToDelete);

                console.log(`${objectsToDelete.length} imagens deletadas do bucket ${bucketName}.`);
                objectsToDelete.length = 0; // Limpa o array
            }
        }

        if (objectsToDelete.length > 0) {
            await minioConfig.removeObjects(bucketName, objectsToDelete);
            console.log(`${objectsToDelete.length} imagens deletadas do bucket ${bucketName}.`);
        }
    }
}