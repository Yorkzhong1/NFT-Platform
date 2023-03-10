
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";

import styles from "../styles/Home.module.css";
import axios from "axios"

//contract related imports
import { Contract, providers, utils,ethers } from "ethers";
import { getProviderOrSigner } from "./utils";
import "./index"

import {
  CONTRACT_abi,
  NFT_CONTRACT_ADDRESS,
  CONTRACT_code,
  serverUrl,
} from "../constants";

const Pinata_api_key =  "dc5bf98b2fd4875f0913"
const Pinata_secret_api_key =  "479ec86c28bdf05eb13a13c86ea6029281f204b3ed3d6e55d372d5eff2b70044"
const serverUrl1 = 'https://nft-server.onrender.com:10000';

// const sleep = (ms) => {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }


export const FolderUpload = () => {
  
  const selectedFiles=useRef()
  const [loading,setLoading] = useState(false);
  
  //states on NFT
  const [numberOfPic, setNumberOfPic] = useState(0);
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [fileNames, setFileNames] = useState([]);
  
//States on IPFS CID
  const [CID, setCID] = useState("");
  const [MetaDataCID, setMetaDataCID] = useState("");


//contract deploy states

const symble = useRef('Punk');


  const changeHandler = (event) => {
    
    selectedFiles.current=event.target.files
  };

  const dropZone = document.getElementById("drop-zone");

  const upLoadMeta = async function() {
    console.log('sending request to server')
    // console.log(JSON.stringify(fileNames))
    // const res1 = await axios.post(`${serverUrl1}/fileNames`,{fileNames:JSON.stringify(fileNames)})
    const res2 = await axios.post(`${serverUrl1}/meta`,{name:name,description:description,number:numberOfPic,CID:CID,fileNames:JSON.stringify(fileNames)})
    console.log(res2.data)
    setMetaDataCID(res2.data)
    document.getElementById('uploadMeta').className="btn btn-info w-100 mt-3 text-white"
    document.getElementById('deployContract').className="btn btn-danger w-100 mt-3 text-white"
    window.alert(`MetaData已经上传至IPFS; 地址为:${res2.data}`);
  }

  async function handleSubmission() {
    let names=[]

    
    setNumberOfPic(Array.from(selectedFiles.current).length)

    const formData = new FormData();
    Array.from(selectedFiles.current).forEach((file) => {
      formData.append("file", file);
      names.push(file.name)
    });
    setFileNames(names)
    var relativePath = selectedFiles.current[0].webkitRelativePath;
    var folderName = relativePath.split("/")[0];
    const metadata1 = JSON.stringify({
      name: folderName
    });

    formData.append('pinataMetadata', metadata1);
    const options = JSON.stringify({
      cidVersion: 0
    });
    formData.append('pinataOptions', options);
    let metaCID
    try{
      await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key:Pinata_api_key,
          pinata_secret_api_key:Pinata_secret_api_key
        }
      }).then((res)=>{
        metaCID=res.data.IpfsHash
        setCID(res.data.IpfsHash)});
    } catch (error) {
      console.log(error);
    }

    console.log('Picture are uploaded')
    window.alert(`${Array.from(selectedFiles.current).length}个图片已经上传IPFS; 地址为:${metaCID}`);
    
    document.getElementById('uploadPic').className="btn btn-info w-100 mt-3 text-white"
    document.getElementById('uploadMeta').className="btn btn-danger w-100 mt-3 text-white"
   
  }


  const deploytContract = async (name,maxTokenId,symble,URI) => {
    console.log('deploy contract prop',name,maxTokenId,symble,URI)
    try {
      const signer = await getProviderOrSigner(true);
      const myAddress=await signer.getAddress();
      const Contract = new ethers.ContractFactory(CONTRACT_abi,CONTRACT_code,signer);
      const contract = await Contract.deploy(name,maxTokenId,symble,URI);
      // wait for the transaction to get mined
      await contract.deployed();
      console.log(contract.address)
      window.alert(`合约已部署，地址为${contract.address}`);
      document.getElementById('deployContract').className="btn btn-info w-100 mt-3 text-white"
      //upadte contract address
      console.log(name,myAddress,contract.address)
      const res = await axios.post(`${serverUrl1}/contracts`,{name:name,pic:`${CID}/${fileNames[0]}`, contractAdd:contract.address,myAddress:myAddress})
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div >
      <div className="m-5, p-3 border border-dark border-1">
          <h4 className="text-center">合约部署</h4>
          <div className="text-left">
              <div className="text-info">合约部署共需要三个步骤，请逐次点击按钮:</div>
              <div>第一步：将所有图片放在一个文件夹内，并将次文件夹上传</div>
              <div>第二步：制作并上传metaData</div>
              <div>第三步：部署合约</div>
          </div>
          <div className="input-group mb-3 mt-2">
              <div className="input-group-prepend">
                  
              </div>
              <input type="file" directory="" webkitdirectory="" className="form-control" onChange={changeHandler}/>
              
          </div>

          <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1" >NFT名字</span>
              </div>
              <input type="text" className="form-control" required = {true} placeholder="CryptoPunk" aria-label="Username" aria-describedby="basic-addon1"
              onChange={(e)=>{
                setName(e.target.value)
              }}
              />
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1" >NFT符号</span>
              </div>
              <input type="text" className="form-control" required = {true} placeholder="PK" aria-label="Username" aria-describedby="basic-addon1"
              onChange={(e)=>{
                symble.current=e.target.value
              }}
              />
        </div>


        <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">NFT描述</span>
              </div>
              <input type="text" className="form-control" placeholder="CryptoPunk是一种数字生成艺术NFT" aria-label="Username" aria-describedby="basic-addon1"
              onChange={(e)=>{
                setDescription(e.target.value)
              }}
              />
        </div>
        <button id="uploadPic" className="btn btn-danger w-100" onClick={handleSubmission}>1. 上传图片至IPFS</button>
        <button id="uploadMeta" className="btn btn-white w-100 mt-3 text-white" onClick={upLoadMeta}>2. 制作并上传MetaData</button> 
        <button id="deployContract" className="btn btn-white w-100 mt-3 text-white" onClick={()=>{deploytContract(name,numberOfPic,symble,`ipfs://${MetaDataCID}`)}}>3.部署合约 🚀</button> 
      </div>

      <div className="m-5"></div>
      <div id="output" className="output"></div>
      
    </div>
  )
}


export const getContracts = async (setContractData) => {
  const res = await axios.get(`${serverUrl1}/contracts`)
  setContractData(JSON.parse(res.data))
};