import { Contract, providers, utils } from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";

import styles from "../styles/Home.module.css";
import {publicMint,getTokenIdsMinted,deploytContract} from "./contractInteract";
// import FolderUpload from "./Upload"
import {getContracts, FolderUpload} from "./Upload"
import {getProviderOrSigne} from "./utils";



export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();
  const [buttonFunction, setButtonFunction] = useState(1);
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  const [metadataURL, setMetadataURL] = useState("");
  const [contractData,setContractData]=  useState([])
  /**
   * publicMint: Mint an NFT
   */


  /*
        connectWallet: Connects the MetaMask wallet
      */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * getTokenIdsMinted: gets the number of tokenIds that have been minted
   */
  

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
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Mumbai network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 1337) {
      window.alert("Change the network to Mumbai");
      throw new Error("Change network to Mumbai");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getTokenIdsMinted({setTokenIdsMinted});
      // set an interval to get the number of token Ids minted every 5 seconds
      setInterval(async function () {
        await getTokenIdsMinted({setTokenIdsMinted});
      }, 5 * 1000);
        getContracts(setContractData)   
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


    if (buttonFunction==1){
      return(
          <div> 
              <FolderUpload/>
          </div>
          
      )
    }

    if (buttonFunction==2){
      return(
        <div className="text-center">
          <h4>请选择NFT项目</h4>
          {contractData}

          <div className={styles.description}>已经mint了{tokenIdsMinted}/10个NFT</div>
          <button className={styles.button} onClick={()=>{publicMint({setLoading})}}>Public Mint 🚀</button>
        </div>
      )
    }

    if (buttonFunction==3){
      return(<div className="text-center">
           <div className="m-5"><a href="https://testnets.opensea.io/collection/mumbai-creatures-v2"  target="_blank" role="button" aria-pressed="true"><h4>OpenSea</h4></a></div> 
           <div className="m-5"><a href="https://blur.io/collections"  target="_blank"  role="button" aria-pressed="true"><h4>Blur</h4></a></div> 
      </div>)
    }

    if (buttonFunction==4){
      return(<div>使用说明</div>)
    }

   
  };

  return (
    <div>
      <Head>
        <title>AlphaPunks</title>
        <meta name="description" content="LW3Punks-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
           <div className="row mt-5">
              
              <div className="col-1 bg-dark m-1">
              <div className="d-grid gap-2">
                  <div className='mt-3 text-left'></div>
                  <button type="button" className="btn btn-dark mt-5" onClick={()=>{setButtonFunction(1)}}>部署合约</button>
                  <button type="button" className="btn btn-dark mt-5" onClick={()=>{setButtonFunction(2)}}>Mint NFT</button>
                  <button type="button" className="btn btn-dark mt-5" onClick={()=>{setButtonFunction(3)}}>NFT市场</button>
                  <button type="button" className="btn btn-dark mt-5" onClick={()=>{setButtonFunction(4)}}>使用说明</button>
                </div>
              </div>
              <div className="col-10 bg-light m-1">
                  <div className="text-center">
                      <h1 className={styles.title}>欢迎来到NFT世界!</h1>
                  </div>
                  {renderButton()}
                  
              </div>
             
              
          </div>
        </div>
      <footer className={styles.footer}>由Alpha &#10084;制作</footer>
    </div>
  );
}