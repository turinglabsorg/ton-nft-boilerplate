# TON NFTs Boilerplate

This is a boilerplate for creating NFTs on the TON blockchain. It's based on this guide: https://docs.ton.org/develop/dapps/tutorials/collection-minting

If you need some testnet coins just ask in the Telegram bot: https://t.me/@testgiver_ton_bot

## How to use

1. Clone this repository
2. Install dependencies: `yarn`
3. Fix your `.env` file
4. Deploy the contract with `yarn deploy`
5. Write `METADATA_IPFS_HASH` and `CONTRACT_ADDRESS` to `.env`
6. Mint NFTs with `yarn mint`

## Change metadata and NFTs

1. Change metadata of the contract from `collection.json`
2. Change images from `images` folder
3. Change metadata of the NFTs from `nfts.json`
4. All the pairs will be automatically created by the script

## Example collection

You can find an example of the collection here: https://testnet.getgems.io/collection/EQBxO4VdU6XR4WrTJ6CW0quurFaClqn9UlRy4ZZEhphUo_8k