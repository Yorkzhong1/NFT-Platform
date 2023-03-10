const Generator = require('./generator')
require('dotenv').config()
let bodyParser=require('body-parser')
const {useEffect, useState}=require("react")

let express = require('express');
let app = express();
let contracts=[]

// const [fileNames, setFileNames] = useState();

// app.use("/public",express.static(__dirname +"/public"))
app.use(bodyParser.json())
app.use((req,res,next)=>{
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
})

// app.post('/fileNames',(req,res)=>{
//     const {fileNames}= req.body;
//     console.log('fileNames first',fileNames)
//     res.send('fileNames recevied')

// })

app.post('/meta',(req,res)=>{
    // const [metaDataCDI,setMetaDataCDI] =useState("")
    const {name,description,number,CID,fileNames}= req.body;
    let files = JSON.parse(fileNames)
    console.log('Start generating metadata...')
    console.log(files)
//execute generator which generate metaData and upload to IPFS, then return the CDI of metadata
    let metaDataCDI
    Generator.generator(name,description,number,CID,files,(CDI)=>{
        console.log('CDI is',CDI)
        res.send(CDI) 
    })
})


app.post('/contracts',(req,res)=>{
    // const [metaDataCDI,setMetaDataCDI] =useState("")
    const {name,pic,contractAdd,myAddress}= req.body;
    // console.log(name,contractAdd,myAddress)
    contracts.push({name,pic,contractAdd,myAddress})
})

app.get('/contracts',(req,res)=>{
    res.json(JSON.stringify(contracts))
})

app.get('/test',(req,res)=>{
    res.send("Hello")
})


 module.exports = app;
