import fs from 'fs';
import { v4 as uuid } from 'uuid';
import path from 'path';
import minioConfig from "../config/minioConfig.js"
import { sendError, sendResponse } from './mensagens.js';

export async function upload(file, bucket) {
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

export async function findk(nameFile, bucket) {
    let dataChunks = [];

    const stream = await minioConfig.getObject(bucket, nameFile, async function (err, dataStream) {
        if (err) {
            return reject(err);
        }

        dataStream.on('data', function (chunk) {
            dataChunks.push(chunk); // Acumula os chunks da imagem
        });

        dataStream.on('end', function () {
            const imageBuffer = Buffer.concat(dataChunks); // Junta os chunks em um único buffer
            return (imageBuffer); // Retorna o buffer da imagem
        });

        dataStream.on('error', function (err) {
            reject(err);
        });
    });


    stream.on('data', (chunk) => {
        res.write(chunk);
    })

    stream.on('end', () => {
        res.end();
    })

    stream.on('error', (err) => {
        return sendError(res, 500, err.message)
    })
}

export async function finda(objectName, bucketName) {
    return new Promise((resolve, reject) => {
        let dataChunks = [];

        minioConfig.getObject(bucketName, objectName, function (err, dataStream) {
            if (err) {
                return reject(err);
            }

            dataStream.on('data', function (chunk) {
                dataChunks.push(chunk); // Acumula os chunks da imagem
            });

            dataStream.on('end', function () {
                const imageBuffer = Buffer.concat(dataChunks); // Junta os chunks em um único buffer
                resolve(imageBuffer); // Retorna o buffer da imagem
            });

            dataStream.on('error', function (err) {
                reject(err);
            });
        });
    });
}

export async function find5(objectName, bucketName) {
    return new Promise((resolve, reject) => {
        let dataChunks = [];

        minioConfig.getObject(bucketName, objectName, function (err, dataStream) {
            if (err) {
                return reject(err);
            }

            dataStream.on('data', function (chunk) {
                dataChunks.push(chunk); // Acumula os chunks da imagem
            });

            dataStream.on('end', function () {
                const imageBuffer = Buffer.concat(dataChunks); // Junta os chunks em um único buffer
                resolve(imageBuffer); // Retorna o buffer da imagem
            });

            dataStream.on('error', function (err) {
                reject(err);
            });
        });
    });
}

export async function find(objectName, bucketName) {
    let dataChunks = []

    const stream = await minioConfig.getObject(bucketName, objectName, (err,stream) =>{
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


export async function remove(nameFile, bucket) {
    await minioConfig.removeObject(bucket, nameFile)
}