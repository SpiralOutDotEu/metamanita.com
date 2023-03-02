import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import 'bootstrap/dist/css/bootstrap.css'
import styles from '@/styles/Demo.module.css'

import { SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import axios from 'axios';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] })

interface Result {
    result: string;
}

export default function Mint() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const { value, proof } = router.query;
    const [tokenId, setTokenId] = useState((value as string)?.split(",")[1] || "")
    const [secret, setSecret] = useState((value as string)?.split(",")[0] || "")
    const [address, setAddress] = useState("")
    const [error, setError] = useState<any>(null)
    const [valid, setValid] = useState<boolean>(secret !== '' ? true : false)

    const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<boolean>(false);
    const [ethereumAccount, setEthereumAccount] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false)

    useEffect(() => {
        if ((window as any).ethereum) {
            //check if Metamask wallet is installed
            setIsMetamaskInstalled(true);
        }
        if (getDeviceType() === 'mobile') {
            setIsMobile(true)
        }


    }, []);

    useEffect(() => {
        if (!router.isReady) return;
        setSecret((value as string)?.split(",")[0])
        setTokenId((value as string)?.split(",")[1])
    }, [router.isReady, router.query]);

    const getDeviceType = () => {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
        }
        if (
            /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
                ua
            )
        ) {
            return "mobile";
        }
        return "desktop";
    };

    async function connectExtension(): Promise<void> {
        //to get around type checking
        (window as any).ethereum
            .request({
                method: "eth_requestAccounts",
            })
            .then((accounts: string[]) => {
                setEthereumAccount(accounts[0]);
                setAddress(accounts[0])
            })
            .catch((error: any) => {
                alert(`Something went wrong: ${error}`);
            });
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setValid(false)
        setResult(null);
        event.preventDefault()

        try {
            const response = await axios.get<Result>('/api/demo', {
                params: {
                    value,
                    proof,
                    address,
                },
            });
            setResult(response.data.result);
        } catch (error) {
            setError(error)
            console.error(error);
        }
        setLoading(false);
    };

    function handleChange(event: { target: { value: any; }; }) {
        setAddress(event.target.value)
    }

    return (
        <>
            <Head>
                <title>Claim a free NTF Mint</title>
                <meta name="description" content="Claim a free NTF Mint" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <div className={styles.center}>
                    <div className="card">
                        <div className="card-body">
                            <h1 className="card-title">Δωρεάν NFT!</h1>
                            {/* <h5 className="card-title">Δες αν βρήκες το κλειδί</h5> */}
                            <br></br>
                            <div className="card-body border">

                                <h4 className="card-title">Your Brand NFT</h4>
                                <p className="card-text">Βρές το <u>μαγικό-QR-κωδικό-κλειδί</u> και κέρδισε ένα NFT της: <b>Our Awesome Event Collection 2023!</b></p> Χωρίς κρυπτονομίσματα και μόνο με το πορτοφόλι σου !
                                <br></br>
                                Δες τι μπορεί να γίνει δικό σου στο κορυφαιο NFT Marketplace:
                                <Link className={styles.hyperlink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={'https://testnets.opensea.io/assets/mumbai/0x16c50a6126d7fbbaf8ac7501729a5ad34030869e'}
                                > OpenSea
                                </Link>.
                                <Image
                                    width={225}
                                    height={225}
                                    className="card-img-top"
                                    src="/YourBrand.gif"
                                    alt="Card image cap" />
                            </div>
                            {/* Wallet Connection */}
                            {ethereumAccount === null &&
                                isMetamaskInstalled &&
                                <button
                                    className="btn btn-primary"
                                    onClick={connectExtension}>
                                    Connect with Wallet Extension
                                </button>
                            }
                            {ethereumAccount === null &&
                                !isMetamaskInstalled &&
                                !isMobile &&
                                <Link href={"https://metamask.app.link/dapp/metamanita.com/demo2?value=" + value + "&proof=" + proof} passHref={true}>
                                    <button className="btn btn-primary">
                                        Install Metamask
                                    </button>
                                </Link>
                            }
                            {ethereumAccount === null &&
                                !isMetamaskInstalled &&
                                isMobile &&
                                <Link href={"https://metamask.app.link/dapp/metamanita.com/demo2?value=" + value + "&proof=" + proof} passHref={true}>
                                    <button className="btn btn-primary">
                                        Connect with Mobile Wallet
                                    </button>
                                </Link>
                            }
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <label htmlFor='address'>or enter your Ethereum address</label>
                                    <input
                                        className='form-control'
                                        type="text"
                                        name="address"
                                        id="address"
                                        value={address}
                                        onChange={handleChange}
                                        disabled={ethereumAccount !== null}
                                        required={true}
                                        pattern={'^0x[a-fA-F0-9]{40}$'}
                                        placeholder='0xYourEthereumAddress.....' />
                                    {result !== null &&
                                        <div className='results'>
                                            result {result}
                                        </div>
                                    }
                                    {error !== null &&
                                        <div className={styles.error}>
                                            Ουπς! μάλλον δεν έχεις όλα τα κλειδιά για
                                            error: {error.code}
                                            
                                        </div>
                                    }
                                    <button
                                        className='btn btn-primary'
                                        color="green"
                                        type='submit'>
                                        Claim free NFT
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div> {/* Center */}
            </main>
        </>
    )
}