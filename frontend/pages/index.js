import { Contract, providers, utils, BigNumber } from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  const [ownedIds, setOwnedIds] = useState([]);
  const web3ModalRef = useRef();

  /**
   * publicMint: Mint an NFT
   */
  const publicMint = async () => {
    try {
      const signer = await getProviderOrSigner(true);

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      const tx = await nftContract.mint({
        value: utils.parseEther("0.01"),
      });

      setLoading(true);
      await tx.wait();
      setLoading(false);

      window.alert("You successfully minted a Zyzz NFT braaahhhhh!");
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getTokenIdsMinted = async () => {
    try {
      const provider = await getProviderOrSigner();

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      const _tokenIds = await nftContract.tokenIds();
      console.log("tokenIds", _tokenIds);
      setTokenIdsMinted(_tokenIds.toString());
    } catch (err) {
      console.error(err);
    }
  };

  const getOwnedNfts = async () => {
    try {
      const provider = await getProviderOrSigner(true);

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      const _tokenIds = BigNumber.from(await nftContract.tokenIds());
      const ownedIdsMetadata = [];
      for (let i = 1; i <= _tokenIds.toNumber(); i++) {
        if ((await provider.getAddress()) === (await nftContract.ownerOf(i))) {
          const tokenUri = await nftContract.tokenURI(i);
          const tokenUriMetadata = await fetch(tokenUri);
          const tokenUriMetadataJson = await tokenUriMetadata.json();
          ownedIdsMetadata.push(tokenUriMetadataJson);
        }
      }
      setOwnedIds(ownedIdsMetadata);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Mumbai network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Mumbai");
      throw new Error("Change network to Mumbai");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();

      getTokenIdsMinted();

      getOwnedNfts();

      setInterval(async function () {
        await getTokenIdsMinted();
      }, 5 * 1000);
    }
  }, [walletConnected]);

  /*
    renderButton: Returns a button based on the state of the dapp
  */
  const renderButton = () => {
    // If wallet is not connected, return a button which allows them to connect their wallet
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }

    // If we are currently waiting for something, return a loading button
    if (loading) {
      return <button className={styles.button}>Loading...</button>;
    }

    return (
      <button className={styles.button} onClick={publicMint}>
        Public Mint 🚀
      </button>
    );
  };

  return (
    <div>
      <Head>
        <title>Zyzz NFT Collection</title>
        <meta name="description" content="Zyzz-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Zyzz Collection!</h1>
          <div className={styles.description}>
            <p>This NFT collection is an NFT collection for Zyzz fans</p> who
            loves aesthetics movement.
          </div>
          <div className={styles.description}>
            {tokenIdsMinted}/5 have been minted
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./Zyzz/3.png" />
        </div>
      </div>
      <div>
        {ownedIds.length > 0 ? (
          <>
            <p style={{ textAlign: "center" }}>All your Zyzz NFT's</p>
            {ownedIds.map((id) => {
              return (
                <div key={id.name} style={{ textAlign: "center" }}>
                  <div>
                    <img src={id.image} />
                    <p>{id.name}</p>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div>
            <p style={{ textAlign: "center" }}>
              See this collection in{" "}
              <a
                style={{ textDecoration: "underline" }}
                href="https://testnets.opensea.io/collection/zyzz-god-of-aesthetics"
              >
                Opensea
              </a>
            </p>
          </div>
        )}
      </div>

      <footer className={styles.footer}>Made by Aridaitech</footer>
    </div>
  );
}
