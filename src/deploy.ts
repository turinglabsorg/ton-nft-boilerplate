import * as dotenv from "dotenv";

import { openWallet } from "./utils";
import { updateMetadataFiles, uploadFolderToIPFS } from "./metadata";
import { waitSeqno } from "./delay";
import { NftCollection } from "./contracts/collection";
import { readdirSync } from "fs";
import { toNano } from "@ton/core";
import { NftItem } from "./contracts/nft";

dotenv.config();

async function init() {
    const metadataFolderPath = "./metadata/";
    const imagesFolderPath = "./images/";

    const wallet = await openWallet(process.env.MNEMONIC!.split(" "), true);
    console.log(`Wallet opened: ${wallet.contract.address}`);
    console.log("Started uploading images to IPFS...");
    const imagesIpfsHash = await uploadFolderToIPFS(imagesFolderPath);
    console.log(
        `Successfully uploaded the pictures to ipfs: https://gateway.pinata.cloud/ipfs/${imagesIpfsHash}`
    );

    console.log("Started uploading metadata files to IPFS...");
    await updateMetadataFiles(metadataFolderPath, imagesIpfsHash);
    const metadataIpfsHash = await uploadFolderToIPFS(metadataFolderPath);
    console.log(
        `Successfully uploaded the metadata to ipfs: https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`
    );
    console.log("Start deploy of nft collection...");
    const collectionData = {
        ownerAddress: wallet.contract.address,
        royaltyPercent: 0.05, // 0.05 = 5%
        royaltyAddress: wallet.contract.address,
        nextItemIndex: 0,
        collectionContentUrl: `ipfs://${metadataIpfsHash}/collection.json`,
        commonContentUrl: `ipfs://${metadataIpfsHash}/`,
    };
    const collection = new NftCollection(collectionData);
    console.log("Connection deployed at", collection.address);
}

void init();