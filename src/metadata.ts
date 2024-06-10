import pinataSDK from "@pinata/sdk";
import { readdirSync } from "fs";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

export async function uploadFolderToIPFS(folderPath: string): Promise<string> {
    const pinata = new pinataSDK({
        pinataApiKey: process.env.PINATA_API_KEY,
        pinataSecretApiKey: process.env.PINATA_API_SECRET,
    });
    const stream = fs.createReadStream(folderPath);
    try {
        const response = await pinata.pinFromFS(folderPath);
        return response.IpfsHash;
    } catch (e) {
        console.log(e)
        return "false";
    }
}

export async function updateMetadataFiles(metadataFolderPath: string, imagesIpfsHash: string): Promise<void> {
    const files = readdirSync(metadataFolderPath);

    files.forEach(async (filename, index) => {
        const filePath = path.join(metadataFolderPath, filename)
        const file = await readFile(filePath);
        
        const metadata = JSON.parse(file.toString());
        metadata.image =
            index != files.length - 1
                ? `ipfs://${imagesIpfsHash}/${index}.jpg`
                : `ipfs://${imagesIpfsHash}/logo.jpg`;

        await writeFile(filePath, JSON.stringify(metadata));
    });
}