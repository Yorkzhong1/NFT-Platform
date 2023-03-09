//使用{}可以将父模块的方法传递给子模块

import { Contract, providers, utils,ethers } from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";

import styles from "../styles/Home.module.css";
import { getProviderOrSigner } from "./utils";
import "./index"

import {
  CONTRACT_abi,
  NFT_CONTRACT_ADDRESS,
  CONTRACT_code,
} from "../constants";


export const publicMint = async (prop) => {
    try {
      console.log("Public mint");
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, CONTRACT_abi, signer);
      // call the mint from the contract to mint the LW3Punks
      const tx = await nftContract.mint({
        // value signifies the cost of one LW3Punks which is "0.01" eth.
        // We are parsing `0.01` string to ether using the utils library from ethers.js
        value: utils.parseEther("0.001"),
      });
      prop.setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      prop.setLoading(false);
      window.alert("你成功的mint了一个AlphaPunk!");
    } catch (err) {
      console.error(err);
    }
  };


  export const getTokenIdsMinted = async (prop) => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, CONTRACT_abi, provider);
      // call the tokenIds from the contract
      const _tokenIds = await nftContract.tokenIds();
      // console.log("tokenIds", _tokenIds);
      //_tokenIds is a `Big Number`. We need to convert the Big Number to a string
      prop.setTokenIdsMinted(_tokenIds.toString());
    } catch (err) {
      console.error(err);
    }
  };

  
