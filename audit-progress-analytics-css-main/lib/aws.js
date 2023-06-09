import AWS from 'aws-sdk'

export function getS3Client(){
  return new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })
}


export function uploadFile(fileObj,fileName){
  const s3=getS3Client()
  return new Promise((resolve,reject) => {
    s3.upload({
        Bucket:process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body:fileObj,
        ACL: 'public-read',
      },
      (err,data)=>{
        if(err){
          console.log("🚀 ~ file: aws.js:21 ~ returnnewPromise ~ err", err)
          reject(err)
        }else{
          console.log("Successfully created. ", data);
          resolve(data.Location)
        }
      })
  })
}

export function deleteFile(fileName){
  const s3=getS3Client()
  return new Promise((resolve,reject) => {
    s3.deleteObject({
        Bucket:process.env.AWS_BUCKET_NAME,
        Key: fileName,
      },
      (err,data)=>{
        if(err){
          console.log("🚀 ~ file: aws.js:40 ~ returnnewPromise ~ err", err)
          reject(err)
        }else{
          console.log("Success. Object deleted.", data);
          resolve(data)
        }
      })
  })
}