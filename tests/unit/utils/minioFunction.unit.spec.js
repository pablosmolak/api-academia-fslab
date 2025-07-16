import { jest } from '@jest/globals';
import { Readable } from 'stream';

const fPutObject = jest.fn();
const unlinkSync = jest.fn();
const uuidv4 = jest.fn();
const extname = jest.fn();
const getObject = jest.fn();
const removeObject = jest.fn();
const listObjectsV2 = jest.fn();
const removeObjects = jest.fn();

jest.unstable_mockModule('fs', () => ({
    unlinkSync,
    default: { unlinkSync }
}));

jest.unstable_mockModule('uuid', () => ({
    v4: uuidv4
}));

jest.unstable_mockModule('path', () => ({
    extname,
    default: { extname }
}));


jest.unstable_mockModule('../../../src/config/minioConfig.js', () => ({
    default: {
        fPutObject,
        getObject,
        removeObject,
        listObjectsV2,
        removeObjects,
    }
}));

const { default: minioFunctions } = await import('../../../src/utils/minioFunctions.js');

describe('Teste de minio Function', () => {
    describe('Testes da função upload', () => {
        beforeEach(() => {
            fPutObject.mockReset();
            unlinkSync.mockReset();
            uuidv4.mockReset();
            extname.mockReset();
        });

        it('Envia o arquivo com nome uuid se nome original não for um uuid', async () => {
            const fakeFile = {
                originalname: 'imagem.png',
                path: '/tmp/teste.png'
            };

            uuidv4.mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
            extname.mockReturnValue('.png');

            const bucket = 'meu-bucket';
            const nomeEsperado = '123e4567-e89b-12d3-a456-426614174000.png';

            const resultado = await minioFunctions.upload(fakeFile, bucket);

            expect(fPutObject).toHaveBeenCalledWith(bucket, nomeEsperado, fakeFile.path);
            expect(unlinkSync).toHaveBeenCalledWith(fakeFile.path);
            expect(resultado).toBe(nomeEsperado);
        });

        it('Usa o nome original se for um uuid válido', async () => {
            const fakeFile = {
                originalname: '123e4567-e89b-12d3-a456-426614174000.png',
                path: '/tmp/uuid.png'
            };

            const bucket = 'bucket';

            const resultado = await minioFunctions.upload(fakeFile, bucket);

            expect(fPutObject).toHaveBeenCalledWith(bucket, fakeFile.originalname, fakeFile.path);
            expect(unlinkSync).toHaveBeenCalledWith(fakeFile.path);
            expect(resultado).toBe(fakeFile.originalname);
        });
    });

    describe('Testes da função find', () => {
        beforeEach(() => {
            getObject.mockReset();
        });

        it('Retorna um buffer com os dados do stream', async () => {
            const bucketName = 'meu-bucket';
            const objectName = 'imagem.png';

            const chunks = [Buffer.from('chunk1'), Buffer.from('chunk2')];
            const fakeStream = Readable.from(chunks);

            getObject.mockImplementation((bucket, object, cb) => {
                cb(null, fakeStream);
                return fakeStream;
            });

            const result = await minioFunctions.find(objectName, bucketName);

            expect(result).toEqual(Buffer.concat(chunks));
            expect(getObject).toHaveBeenCalledWith(bucketName, objectName, expect.any(Function));
        });

        it('Lança erro se getObject retornar erro', async () => {
            const bucketName = 'meu-bucket';
            const objectName = 'imagem.png';

            getObject.mockImplementation((bucket, object, cb) => {
                cb(new Error('falha'), null);
            });

            await expect(minioFunctions.find(objectName, bucketName))
                .rejects
                .toThrow('Não foi possivel encontrar o arquivo');
        });
    });

    describe('Testes da função remove', () => {
        beforeEach(() => {
            removeObject.mockReset();
        });

        it('Remove o arquivo com sucesso', async () => {
            removeObject.mockImplementation((bucket, name, cb) => cb(null));

            await expect(minioFunctions.remove('file.png', 'meu-bucket')).resolves.not.toThrow();
            expect(removeObject).toHaveBeenCalledWith('meu-bucket', 'file.png', expect.any(Function));
        });

        it('Lança erro se não conseguir remover o arquivo', async () => {
            removeObject.mockImplementation((bucket, name, cb) => cb(new Error('Erro')));

            await expect(minioFunctions.remove('file.png', 'meu-bucket'))
                .rejects
                .toThrow('Não foi possivel encontrar o arquivo');
        });
    });

    describe('Testes da função removeAll', () => {
        beforeEach(() => {
            listObjectsV2.mockReset();
            removeObjects.mockReset();
        });

        it('deleta todos os objetos do bucket', async () => {
            const objetos = [
                { name: 'img1.png' },
                { name: 'img2.png' },
                { name: 'img3.png' }
            ];
            const fakeStream = Readable.from(objetos);

            listObjectsV2.mockReturnValue(fakeStream);

            await minioFunctions.removeAll('bucket-test');

            expect(removeObjects).toHaveBeenCalledTimes(1);
            expect(removeObjects).toHaveBeenCalledWith('bucket-test', ['img1.png', 'img2.png', 'img3.png']);
        });

        it('Faz remoções em blocos de até 1000', async () => {
            const objetos = Array.from({ length: 1500 }, (_, i) => ({ name: `file${i}.png` }));
            const fakeStream = Readable.from(objetos);

            listObjectsV2.mockReturnValue(fakeStream);

            await minioFunctions.removeAll('bucket-com-muitos');

            expect(removeObjects).toHaveBeenCalledTimes(2);

            expect(removeObjects.mock.calls[1][0]).toBe('bucket-com-muitos');
            expect(removeObjects.mock.calls[1][1].length).toBe(500);
        });
    });
});