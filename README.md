# Obsidian PicBedUploader Plugin

## Overview

The **PicBedUploader** plugin for Obsidian allows users to upload images to a specified server and embed them in their notes. It features an easy-to-use modal for uploading images, configurable settings for endpoints and credentials, and integration with Obsidian's UI components.

## Features

- **Image Upload Modal**: Provides a user-friendly interface to upload images via drag-and-drop or click.
- **Settings Configuration**: Configure upload endpoints, authentication details, and image processing options.
- **Ribbon Icon**: Quickly access the upload modal from the Obsidian ribbon.
- **Command Palette Integration**: Use a command to open the image upload modal.
- **Customizable Image Size**: Choose from different image size options for the uploaded images.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/picbed-uploader-plugin.git
   cd picbed-uploader-plugin
   ```

2. **Install Dependencies**:
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Build the Plugin**:
   ```bash
   npm run dev
   ```

4. **Copy Files to Obsidian**:
   - Copy `main.js`, `styles.css`, and `manifest.json` to your Obsidian vault's `.obsidian/plugins/your-plugin-id/` directory.

## Usage

1. **Open the Upload Modal**:
   - Click on the ribbon icon labeled "PicBedUploader" to open the image upload modal.
   - Alternatively, use the command palette and search for "Upload Image".

2. **Configure Settings**:
   - Navigate to the plugin settings via `Settings > Plugins > PicBedUploader`.
   - Set your upload endpoint, album ID, and authentication details.

3. **Upload an Image**:
   - Drag and drop an image into the upload area or click to select a file.
   - Enter a name and description for the image.
   - Click "Submit" to upload the image and get a URL to insert into your note.

## Plugin Settings

- **Upload Endpoint**: URL where images will be uploaded.
- **Album ID**: ID of the album to which images will be uploaded.
- **Username & Password**: Credentials for authentication (saved as plain text).
- **Access Key ID & Secret Access Key**: Credentials for accessing the upload service.
- **Cookie**: Cookie for authentication if required.
- **Image Size Suffix**: Suffix to apply to the image URL for resizing (default, small, medium, large).

## Development

To contribute or modify the plugin:

1. **Make Changes**:
   - Edit `main.ts` or create new `.ts` files as needed.

2. **Compile Changes**:
   ```bash
   npm run dev
   ```

3. **Reload Obsidian**:
   - Enable the plugin in Obsidian's settings.

## Releasing

1. **Update Version**:
   - Modify `manifest.json` with the new version number.
   - Use `npm version patch` to bump the version automatically.

2. **Create a Release**:
   - Tag the new version on GitHub.
   - Upload `manifest.json`, `main.js`, and `styles.css` as assets.

3. **Submit to Community**:
   - Follow [plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines) to add your plugin to the community list.

## Funding

Support the development of this plugin by contributing via [Buy Me a Coffee](https://buymeacoffee.com) or [GitHub Sponsors](https://github.com/sponsors).

## API Documentation

For details on the Obsidian API, visit [Obsidian API Documentation](https://github.com/obsidianmd/obsidian-api).