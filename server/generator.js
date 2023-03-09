require('dotenv').config();
const Jimp = require('jimp');
const fs = require('fs');
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK('dc5bf98b2fd4875f0913', "479ec86c28bdf05eb13a13c86ea6029281f204b3ed3d6e55d372d5eff2b70044");

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const generator=async (name,description,number, CID,files,setCDI)=>{
    console.log('data from client',name,description,number,CID,files)
    console.log('check if the folder exist')
        var dir = `./Output/JSON/${name}`;
        if (fs.existsSync(dir)){
            console.log('folder exist delete the folder')
            fs.rmSync(dir, { recursive: true, force: true });
        }
        console.log('creating the folder')
        fs.mkdirSync(dir, { recursive: true });
        console.log(`folder created`)

    console.log('console.log from generator',name,description,number,CID)
    for(let i=0;i<number;i++){
        console.log("filenames",files[i])
        await fs.writeFileSync(dir+"/"+(i+1).toString(), JSON.stringify({
            "name": name+(i+1).toString(),
            "description":description,
            "image": "https://ipfs.io/ipfs/"+CID+"/"+files[i]
        }))
        console.log('meta is generated',i)
// upload metadata to ipfs and response the CID to client
        
        const sourcePath = dir
        const options = {
            pinataMetadata: {
                name: name,
            },
            pinataOptions: {
                cidVersion: 0
            }
        };
        console.log('sending metaData to IPFS')
        pinata.pinFromFS(sourcePath, options).then((result) => {
            //handle results here
            console.log('metadata result',result.IpfsHash);
            setCDI(result.IpfsHash)
        }).catch((err) => {
            //handle error here
            console.log(err);
        });

        
    
    }


}




module.exports = {
    generator
}