import pinataSDK from '@pinata/sdk';
const pinata = pinataSDK('4fd785a2625da46ca6dd', '2c1fae7c6cbf648cfe13c31cfe8752444803dfd6bb7d3091ecc677b2f5e6a42d');

import streamifier from 'streamifier';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { basePicture } = req.body;
  
    var buffer = Buffer.from(basePicture, 'base64');
  
    var stream = streamifier.createReadStream(buffer);
    
    const r = await pinata.pinFileToIPFS(stream);
  
    console.log('response', JSON.stringify(r));
    
    res.status(200).json(r);
  } catch (error) {
    res.status(400).json({ error });
    console.error(error);
  }
}
