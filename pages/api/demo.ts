// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { DefenderRelaySigner, DefenderRelayProvider } from 'defender-relay-client/lib/ethers';
const { ethers } = require('ethers');


const token = require('../../utils/MerkleTokenERC1155.json')

const credentials = { apiKey: process.env.DEFENDER_API_KEY || "", apiSecret: process.env.DEFENDER_SECRET || "" };
const provider = new DefenderRelayProvider(credentials);
const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });


const CONTRACT_ADDRESS = '0x67c03af9fdEca678Da66Bb4632E76C262cfD7C9c'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { value, proof, address } = req.query;
    if (typeof value !== 'string' || typeof proof !== 'string' || typeof address !== 'string') {
        res.status(400).json({ error: 'Invalid input parameters' });
        return;
    }

    try {
        const result = await mint(value, proof, address);
        console.log("Result: ", result)
        res.status(200).json({ result: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to complete mint' });
    }
}

async function mint(value: string, proof: string, address: string): Promise<string> {
    const _key = value.split(",")[0]
    const _id = value.split(",")[1]
    const _proof = proof.split(",")

    const MerkleTokenERC1155 = new ethers.Contract(CONTRACT_ADDRESS, token.abi, signer);
    const tx = await MerkleTokenERC1155.proofMint(address, _proof, _key, _id) ;
    console.log("Tx:", tx)
    const receipt = await provider.getTransactionReceipt(tx.hash).then((result: any) => {
        console.log("Receipt Result:" , result)
        
    }).catch((err: any) => {
        console.log("Receipt Error:" , err)
    });
    console.log("Receipt: ", receipt)

    // const mined = await tx.wait()

    // try {
    //     const mined = await tx.wait().then((result: any) => {
    //         console.log("mined", result)
            
    //     }).catch((err: any) => {
    //         console.log("error", err)
    //     });
    // } catch (error) {
        
    // }
    // const transactionReceipt = await tx.wait();
    // if (transactionReceipt.status !== 1) {
    //    alert('error message');
    //    return "Error";
    // }
    return tx.hash
}

