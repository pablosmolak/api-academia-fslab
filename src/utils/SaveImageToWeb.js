import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function SaveImageToWeb(imageUrl) {
    const tempDir = path.join(__dirname);

    // Garante que o diretório temporário exista
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    try {
        const response = await axios({
            method: "get",
            url: imageUrl,
            responseType: "stream",
        });

        const fileName = `image_${Date.now()}.jpg`;
        const filePath = path.join(tempDir, fileName);
        const writer = fs.createWriteStream(filePath);

        await new Promise((resolve, reject) => {
            response.data.pipe(writer);
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        return {
            path: filePath,
            originalname: fileName,
        };
    } catch (error) {
        console.error("Erro ao baixar a imagem:", error);
        throw error;
    }
}

export default SaveImageToWeb;
