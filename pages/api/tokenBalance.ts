import { NextApiRequest, NextApiResponse } from 'next';
const token = require('../../utils/MerkleTokenERC1155.json')
const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_MUMBAI_API_URL)
const network = "mumbai";
const CONTRACT_ADDRESS = '0x16c50A6126d7fbbAF8aC7501729a5ad34030869e'


async function getBalance(address: string, tokenId: number, contract_address: string): Promise<number> {
    // This is a placeholder function that generates a random integer as the balance
    const contract = new ethers.Contract(contract_address, token.abi, provider)
    const tx = await contract.balanceOf(address, tokenId)
    console.log("TX: ", tx)
    return Math.floor(Math.random() * 100);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { address, tokenId, contract } = req.query;

    if (!address || !tokenId || !contract) {
        res.status(400).json({ error: 'Invalid parameters' });
        return;
    }

    const balance = getBalance(address as string, Number(tokenId), contract as string);

    res.status(200).json({ balance });
}