const ftp = require("basic-ftp");
const path = require("path");
const fs = require("fs");

async function uploadFile() {
    const client = new ftp.Client();
    client.ftp.verbose = true; // Enable logging for debugging

    console.log(process.env);

    try {
        await client.access({
            host: process.env.FTP_HOST, // FTP server from GitHub Actions variable
            user: process.env.FTP_USER, // FTP username from GitHub Actions variable
            password: process.env.FTP_PASSWORD, // FTP password from GitHub Actions variable
            secure: false // Set to true if using FTPS
        });

        const fileName = "out/TikTok.mp4"; // Get file name from GitHub Actions variable
        const localFilePath = path.join(__dirname, fileName);
        const remoteFilePath = `uploads/TikTok.mp4`; // Adjust remote path as needed

        if (fs.existsSync(localFilePath)) {
            console.log("Uploading file...");
            await client.uploadFrom(localFilePath, remoteFilePath);
            console.log("File uploaded successfully!");
        } else {
            console.error("File does not exist:", localFilePath);
        }
    } catch (error) {
        console.error("Error uploading file:", error);
    }

    client.close();
}

uploadFile();
