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

    const collectionAddress = process.env.COLLECTION_ADDRESS
    const metadataIpfsHash = process.env.METADATA_IPFS_HASH
    if (!collectionAddress || !metadataIpfsHash) {
        console.error("Please provide COLLECTION_ADDRESS and METADATA_IPFS_HASH in .env file");
        return;
    }
    const collectionData = {
        ownerAddress: wallet.contract.address,
        royaltyPercent: 0.05, // 0.05 = 5%
        royaltyAddress: wallet.contract.address,
        nextItemIndex: 0,
        collectionContentUrl: `ipfs://${metadataIpfsHash}/collection.json`,
        commonContentUrl: `ipfs://${metadataIpfsHash}/`,
    };
    const collection = new NftCollection(collectionData, collectionAddress);
    let seqno = await collection.deploy(wallet);
    console.log(`Collection deployed: ${collection.address}`);
    await waitSeqno(seqno, wallet);

    const files = await readdirSync(metadataFolderPath);
    console.log(`Start deploy of ${files.length} NFTs`);
    console.table(files);
    files.pop();
    let index = 0;
    console.log(`Start top-up balance...`)
    seqno = await collection.topUpBalance(wallet, files.length);
    await waitSeqno(seqno, wallet);
    console.log(`Balance top-upped`);
    for (const file of files) {
        console.log(`Start deploy of ${index + 1} NFT`);
        const mintParams = {
            queryId: 0,
            itemOwnerAddress: wallet.contract.address,
            itemIndex: index,
            amount: toNano("0.05"),
            commonContentUrl: file,
        };

        const nftItem = new NftItem(collection);
        seqno = await nftItem.deploy(wallet, mintParams);
        console.log(`Successfully deployed ${index + 1} NFT`);
        await waitSeqno(seqno, wallet);
        index++;
    }
}

void init();