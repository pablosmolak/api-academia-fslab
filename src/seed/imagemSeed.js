import axios from "axios";
import fs from "fs";
import path from "path";
import { bucketsMinio } from "../utils/enums.js";
import minioFunctions from "../utils/minioFunctions.js";
import { fileURLToPath } from "url";
import dataSeed from "./data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function imagemSeed(quantity) {
    const tempDir = path.join(__dirname, "temp_images");

    // Garante que o diretório temporário exista
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const buckets = [bucketsMinio.Cursos, bucketsMinio.Usuarios]
    const urls = {
        [bucketsMinio.Cursos]: dataSeed.map(data => {
            return {
                url: data.capa,
                nomeImagem: data.id
            }
        }),
        [bucketsMinio.Usuarios]: dataSeed.map(data => {
            return {
                url: data.canal_infos.foto_de_perfil,
                nomeImagem: data.canal_infos.id
            }
        }),
    }

    for (let bucket of buckets) {
        let count = 0
        await minioFunctions.removeAll(bucket)

        for (let i = 0; i < urls[bucket].length; i++) {
            try {
                const response = await axios({
                    method: "get",
                    url: urls[bucket][i].url,
                    responseType: "stream",
                });

                // Salva a imagem temporariamente
                const fileName = `${urls[bucket][i].nomeImagem}.jpg`;
                const filePath = path.join(tempDir, fileName);
                const writer = fs.createWriteStream(filePath);

                await new Promise((resolve, reject) => {
                    response.data.pipe(writer);
                    writer.on("finish", resolve);
                    writer.on("error", reject);
                });

                const file = {
                    path: filePath,
                    originalname: fileName
                }
                // Faz upload ao MinIO
                await minioFunctions.upload(file, bucket)

                count++
                console.log(`imagem ${count} criada`)
            } catch (error) {
                console.error(`Erro ao processar imagem ${i + 1}:`, error);
            }
        }

        console.log(`${count} imagens criadas no bucket ${bucket}.`)
    }
}
