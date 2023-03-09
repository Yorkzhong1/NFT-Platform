//0x41360cB835d7E4803C175c475ad6912c74f76262

const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

const METADATA_URL = "https://nft-collection-sneh1999.vercel.app/api/";
const ADD="0x6D66f0DA700dEaf6CaBbD68206185d46AAdB48b0"

async function main() {
  
  
  const contract = await hre.ethers.getContractAt("AlphaPunk",ADD);
  tx=await contract.tokenURI(1)
  console.log(tx)

  
  // print the address of the deployed contract
 
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });