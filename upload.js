
import axios from "axios";
import fs from "fs/promises";


// file

const file = await fs.readFile("out/video.mp4");


async function main() {
    const title = process.env.VIDEO_TITLE;
    const uploadingLinks = await initiateUpload({
        name: title + ".mp4",
        size: file.byteLength,
        type: "video/mp4",
    })

    console.log(uploadingLinks)

    await uploadFile(file, uploadingLinks);
    console.log("File uploaded successfully");
    console.log("going to trigger zapier")

    if (process.env.NO_PUBLISH !== "true") {
        await triggerZappier(
            `https://3so1tl7kko.ufs.sh/f/${uploadingLinks.key}`,
            title,
        );
    }

    process.exit(0);
}

main();


async function triggerZappier(link, title) {
    const abortController = new AbortController();


    const url = "https://voca.zapier.app/api/proxy/interfaces/api/interfaces/v0/blocks/form/cm8lkue3w000j6nxu3m6llo4j/submissions";
    await axios.post(url, {
        values: {
            "cm8lku7sw00012v6teybv5bqs": link,
            "cm8lkx09u00022v6tprh4hmd6": title,
        },
    }, {
        headers: {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'origin': 'https://voca.zapier.app',
            'referer': 'https://voca.zapier.app/tiktok',
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
            'x-dd-rum-session-id': '83df35ba-1d2e-48cc-9748-3300c55cc111',
            'x-interfaces-page-id': 'cm8lkticc00018uyzov6f2wt7',
            'x-interfaces-session': '22f3929e-97bf-4b6f-bb9e-397c75b42311'
        },
        signal: abortController.signal,
    });

    return;
}

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
            fileType: 'video/mp4',
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