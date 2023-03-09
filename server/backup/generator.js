require('dotenv').config();
const Jimp = require('jimp');
const fs = require('fs');
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK('dc5bf98b2fd4875f0913', "479ec86c28bdf05eb13a13c86ea6029281f204b3ed3d6e55d372d5eff2b70044");
const Traits = require('./traits');
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const build = async(index, onComplete) => {
    const _path = '/Users/apple/Documents/github/projects/NFT/server';
    var _traits = [];
    
    //Compose the img, starting with background
    const background = Traits.getBackground();
    const backgroundJimp = await Jimp.read(_path+'/Traits/Background/Background_'+background+'.png');
    _traits.push({
        'trait_type': 'Background',
        'value': background
    });
    var _composedImage = backgroundJimp;
    console.log('background')

    const bodyAndHead = Traits.getBodyAndHead();
    const bodyJimp = await Jimp.read(_path+'/Traits/Body/Body_'+bodyAndHead+'.png');
    _traits.push({
        'trait_type': 'Body',
        'value': bodyAndHead
    });

    _composedImage.blit(bodyJimp, 0, 0);

    console.log('body')
    
    const outfit = Traits.getOutfit();
    const outfitJimp = await Jimp.read(_path+'/Traits/Outfit/Outfit_'+outfit+'.png');
    _traits.push({
        'trait_type': 'Outfit',
        'value': outfit
    });
    
    console.log('outfit')
    _composedImage.blit(outfitJimp, 0, 0);
    
    const headJimp = await Jimp.read(_path+'/Traits/Head/Head_'+bodyAndHead+'.png');
    _traits.push({
        'trait_type': 'Head',
        'value': bodyAndHead
    });
    _composedImage.blit(headJimp, 0, 0);


    console.log('head')

    const nose = Traits.getNose();
    const noseJimp = await Jimp.read(_path+'/Traits/Nose/Nose_'+nose+'.png');
    _traits.push({
        'trait_type': 'Nose',
        'value': nose
    });
    _composedImage.blit(noseJimp, 0, 0);
    
    console.log('nose')
    
    const mouth = Traits.getMouth();
    const mouthJimp = await Jimp.read(_path+'/Traits/Mouth/Mouth_'+mouth+'.png');
    _traits.push({
        'trait_type': 'Mouth',
        'value': mouth
    });
    _composedImage.blit(mouthJimp, 0, 0);
    
    console.log('mouth')

    const eyes = Traits.getEyes();
    const eyesJimp = await Jimp.read(_path+'/Traits/Eyes/Eyes_'+eyes+'.png');
    _traits.push({
        'trait_type': 'Eyes',
        'value': eyes
    });
    _composedImage.blit(eyesJimp, 0, 0);

    console.log('eye')
    
    const sunglasses = Traits.getSunglasses();
    const sunglassesJimp = await Jimp.read(_path+'/Traits/Sunglasses/Sunglasses_'+sunglasses+'.png');
    _traits.push({
        'trait_type': 'Sunglasses',
        'value': sunglasses
    });
    _composedImage.blit(sunglassesJimp, 0, 0);

    console.log('Sunglasses')
    
    const headwear = Traits.getHeadwear();
    const headwearJimp = await Jimp.read(_path+'/Traits/Headwear/Headwear_'+headwear+'.png');
    _traits.push({
        'trait_type': 'Headwear',
        'value': headwear
    });
    _composedImage.blit(headwearJimp, 0, 0);

    console.log('headwear')

    //save file
    await _composedImage.write('Output/images/'+index+'.png');
    await sleep(20); //We give some time for the image to be actually saved in our files
    
    console.log('IMG created')

    const _readableStream = await fs.createReadStream(_path + '/Output/images/'+index+'.png');

    const options = {
        pinataMetadata: {
            name: `${index}.png`,
        },
        pinataOptions: {
            cidVersion: 0
        }
    };
    const _ipfs = await pinata.pinFileToIPFS(_readableStream,options);

    console.log('img uploaded')
    
    await fs.writeFileSync('Output/JSON/'+index, JSON.stringify({
        "name": "My NFT #"+index,
        "traits": _traits,
        "image": "https://ipfs.io/ipfs/"+_ipfs.IpfsHash
    }))
    
    console.log('metadat created')
    onComplete();
} 

module.exports = {
    build
}
