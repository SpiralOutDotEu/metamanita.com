import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'

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

  async function connectMetamaskWallet(): Promise<void> {
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
      <main >
        <div className={styles.center}>
          <div className={styles.form}>
            <div>
              <h1>Maybe you found a secret... </h1>
              <br></br>
              <div className={styles.description}>
                <p>Give it a try and see if you are lucky to claim one of the<b> 4 Cyborgs NFTs!</b>
                </p>

              </div>
              <div className={styles.collection}>
                <Image src='/FourCyborgs.gif' alt='4 Cyborgs gif'
                  width={225}
                  height={225}
                  unoptimized={true}
                >
                </Image>
                See the collection on
                <Link className={styles.hyperlink}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={'https://testnets.opensea.io/assets/mumbai/0x16c50a6126d7fbbaf8ac7501729a5ad34030869e'}
                > OpenSea
                </Link>.
              </div>

              <br></br>
              <div>
                {ethereumAccount === null &&
                  <div className={styles.claim}>
                    <button
                      disabled={!isMetamaskInstalled}
                      onClick={connectMetamaskWallet}
                    >Connect your Wallet
                    </button>
                  </div>
                }
              </div>
              <div>
                {isMobile === true &&
                  isMetamaskInstalled !== true &&
                  <div className={styles.claim}>
                    <Link href={"https://metamask.app.link/dapp/metamanita.com/demo?value=" + value + "&proof=" + proof} passHref={true}>
                      <button>Connect with mobile wallet</button>
                    </Link>
                  </div>
                }
              </div>
              <h3 hidden={ethereumAccount !== null}>or Enter your Ethereum address to try: </h3>
              {/*  
              // Form
              */}
              <form onSubmit={handleSubmit}>

                <div>
                  <input type="text"
                    name="address"
                    id="address"
                    value={address}
                    onChange={handleChange}
                    disabled={ethereumAccount !== null}
                    required={true}
                    pattern={'^0x[a-fA-F0-9]{40}$'}

                    placeholder='0x.........' />
                </div>
                <div className={styles.claim} >
                  <br></br>
                  <button type="submit" disabled={loading || result !== null}>
                    {loading ? 'Loading...' : 'Claim Free NFT'}
                  </button>
                </div>
                <div className={styles.results}>
                  <div className={styles.error}>
                    {error !== null && <a>Oooops! it seems you don't know enough secrets! </a>}
                  </div>
                  {result !== null &&
                    <div> Submitted for minting!
                      <br></br>View the progress in
                      <Link className={styles.hyperlink}
                        rel="noopener noreferrer" target="_blank"
                        href={'https://mumbai.polygonscan.com/tx/' + result}
                        passHref> PolygonScan
                      </Link>.
                      <br></br> or Check your NFT on
                      <Link className={styles.hyperlink}
                        rel="noopener noreferrer" target="_blank"
                        href={'https://testnets.opensea.io/assets/mumbai/0x16c50a6126d7fbbaf8ac7501729a5ad34030869e/' + tokenId}
                      > OpenSea
                      </Link>.
                    </div>
                  }
                </div>
              </form>

            </div>
          </div>
        </div>

        <div className='hidden'>
          <div className={styles.grid}>
            {secret !== null && <>You know a secret {secret}</>}
            {tokenId !== null && <>...for token Id {tokenId}</>}
            {address !== null && <> ...and you want to send it to {address}...</>}
            {address?.length !== 42 && <> ...you are missing an ethereum address...</>}
            {/* placeholder for cards */}
          </div>
        </div>
      </main>
    </>
  )
}
