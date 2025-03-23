
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

    await triggerZappier(
        `https://3so1tl7kko.ufs.sh/f/${uploadingLinks.key}`,
        title,
    );

    console.log("File uploaded successfully");
    process.exit(0);
}

main();


async function triggerZappier(link, title) {
    const options = {
        method: "POST",
        url: "https://untitled-zap-interface-ea2293.zapier.app/api/trpc/formSubmissions.create",
        headers: {
            "Content-Type": "application/json",
            "origin": "https://untitled-zap-interface-ea2293.zapier.app",
            "referer": "https://untitled-zap-interface-ea2293.zapier.app/tiktok",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            "x-dd-rum-session-id": "fd325ee1-4a63-4f62-b2f5-f7f1196e2a04",
            "x-interfaces-page-id": "cm8lkticc00018uyzov6f2wt7",
            "x-interfaces-session": "3ac08b25-8c41-41d4-8040-1111fd1faa69",
        },
        data: JSON.stringify({
            formId: "cm8lkue3w000j6nxu3m6llo4j",
            values: {
                cm8lku7sw00012v6teybv5bqs: link,
                cm8lkx09u00022v6tprh4hmd6: title,
            }
        })
    };

    await axios.request(options);
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
            slug: "github-action",
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