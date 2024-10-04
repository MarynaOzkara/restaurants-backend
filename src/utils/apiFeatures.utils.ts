
const nodeGeocoder= require('node-geocoder');


import { JwtService } from '@nestjs/jwt';
import { Location } from '../restaurants/schemas/restaurant.schema';

import { S3 } from 'aws-sdk';

export default class APIFeatures {
  static async getRestaurantLocation(address) {
    try {
      const options = {
        provider: process.env.GEOCODER_PROVIDER,
        httpAdapter: 'https',
        apiKey: process.env.GEOCODER_API_KEY,
        formatter: null,
      };
      const geoCoder = nodeGeocoder(options);

      const loc = geoCoder.geocode(address);
      const location: Location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        city: loc[0].city,
        streetName: loc[0].streetName,
        streetNumber: loc[0].streetNumber,
        country: loc[0].country,
      };
      return location;
    } catch (error) {
      console.log(error.message);
    }
  }
  static async upload(files) {
    return new Promise((resolve, reject) => {
      const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      const images = [];
      files.forEach(async (file) => {
        const splitFile = file.originalname.split('.');
        const random = Date.now();
        const fileName = `${splitFile[0]}_${random}.${splitFile[1]}`;
        const params = {
          Bucket: `${process.env.AWS_S3_BUCKET_NAME}/restaurants`,
          Key: fileName,
          Body: file.buffer,
        };
        const uploadResponse = await s3.upload(params).promise();
        images.push(uploadResponse);
        if (images.length === files.length) {
          resolve(images);
        }
      });
    });
  }

  static async assingJwtToken(
    userId: string,
    jwtService: JwtService
  ): Promise<string>{
    const payload = {id: userId}
    const token = await jwtService.sign(payload)
    return token
  }
}
