
import axios from "axios";
import fs from "fs/promises";


// file

const file = await fs.readFile("./public/improve.mp3");


async function main() {
    const uploadingLinks = await initiateUpload({
        name: "improve.mp3",
        size: file.byteLength,
        type: "audio/mp3",
    })

    console.log(uploadingLinks)

    await uploadFile(file, uploadingLinks);

    console.log("File uploaded successfully");
    process.exit(0);
}

main();

async function initiateUpload(file) {

    const options = {
        method: "POST",
        url: "https://api.uploadthing.com/v7/prepareUpload",
        headers: {
            "Content-Type": "application/json",
            "X-Uploadthing-Api-Key": process.env.UPLOADTHING,
        },
        data: JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
            fileType: 'audio/mp3',
            contentDisposition: 'inline',
            acl: 'public-read',
            expiresIn: 3600
        })
    };

    const { data } = await axios.request(options);
    return data
}



async function uploadFile(file, uploadData) {
    const formData = new FormData();

    formData.append("file", new Blob([file.buffer]));

    const abortController = new AbortController();

    await axios.put(uploadData.url, formData, {
        signal: abortController.signal,
    });

    return;
}