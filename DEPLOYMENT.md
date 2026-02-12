# Deployment Guide for Hostinger

This guide explains how to deploy your Node.js application (Dee Arr Construction) to Hostinger shared hosting.

## 1. Preparation (Done for you)
I have already restructured your project so that the server and frontend files are in the same root directory.
-   `server.js`, `package.json`, and database files are now in the root folder.
-   `server.js` has been updated to serve the website correctly.

## 2. Create the Archive
1.  On your computer, go to the project folder: `D:\Work Sprietzen\Dee Arr`
2.  Select **ALL** files and folders **EXCEPT**:
    -   `node_modules` (Do NOT upload this folder)
    -   `.git` (Do not upload)
    -   `admin_panel` (Check if anything important is left, otherwise ignore)
3.  Right-click and select **Compress to ZIP file**. Name it something like `website_deploy.zip`.

## 3. Upload to Hostinger
1.  Log in to your Hostinger hPanel.
2.  Go to **Websites** -> **Manage** -> **Files** -> **File Manager**.
3.  Navigate into the `public_html` folder.
    -   *Note: If there are default files (like default.php), you can delete them.*
4.  Click the **Upload** icon (top right) and select your `website_deploy.zip` file.
5.  Right-click the uploaded zip file and select **Extract**.
    -   Extract to `.` (current directory) or ensure files end up directly in `public_html`, not a subfolder.

## 4. Configure Node.js Application
1.  Go back to the hPanel dashboard.
2.  Search for or scroll to **Advanced** -> **Node.js App**.
3.  Click **Create Application** (or Setup):
    -   **Node.js Version**: Select **18** or **20** (Recommended).
    -   **Application Mode**: **Production**.
    -   **Application Root**: `public_html`
    -   **Main Startup File**: `server.js`
4.  Click **Create**.

## 5. Install Dependencies
1.  Once created, click the **NPM Install** button on the Node.js App page.
    -   This will read `package.json` and install libraries (express, sqlite3, etc.) on the server.
    -   *Important*: This ensures the database driver works on Linux.

## 6. Start the App
1.  Click **Restart** (or Start) on the Node.js App page.
2.  Visit your website URL. Since we moved everything to the root, your site should load perfectly!

## Troubleshooting
-   **Database Access**: The `database.sqlite` file is in the root. If data isn't saving, check file permissions in File Manager (should be 644 or 666).
-   **Images**: Uploaded images go to the `uploads/` folder. Ensure this folder exists and is writable.

## 7. If you see a "Build Configuration" Screen (like in your screenshot)
If you are using Hostinger's **Cloud/VPS** or **App Platform** interface that asks for Build Settings, use these settings:

1.  **Framework preset**: Express
2.  **Node version**: 18.x (or 20.x)
3.  **Root directory**: Leave this **EMPTY** (or set to `.`)
    -   *Why?* Because I moved `server.js` to the main folder. do NOT set it to `admin_panel`.
4.  **Entry file**: `server.js`
    -   *Change from* `admin_panel/server.js` to just `server.js`.
5.  **Build command**: `npm install` (if asked)
6.  **Start command**: `node server.js` (or `npm start`)

## 8. If Build Fails (Vulnerability/Deprecated Errors)
If Hostinger says build failed due to `rimraf`, `tar`, or `high severity vulnerabilities`:
1.  Delete the `package-lock.json` file from your project folder before zipping (if it exists).
2.  Open `package.json` and change:
    ```json
    "dependencies": {
        "cors": "^2.8.5",
        "express": "^4.18.2",
        "multer": "^1.4.5-lts.1",
        "sqlite3": "^5.1.7"
    }
    ```
    (Downgrading to stable Express 4 and specific Multer might help compatibility).
3.  **Re-zip** and Upload.
4.  In Hostinger, verify Node Version is 18+.
