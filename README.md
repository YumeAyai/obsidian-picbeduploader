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

### From Obsidian Community Plugins

Either copy the link `obsidian://show-plugin?id=auto-image-uploader` into your browser or follow the instructions below:

1. Open Obsidian.
2. Go to `Settings` > `Community Plugins` > `Browse`.
3. Search for **PicBedUploader**.
4. Click `Install`, then `Enable`.


### Manual Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YumeAyai/obsidian-picbeduploader.git
   cd obsidian-picbeduploader
   ```

2. **Install Dependencies**:
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Build the Plugin**:
   ```bash
   npm run build
   ```

4. **Copy Files to Obsidian**:
   - Copy `main.js`, and `manifest.json` to your Obsidian vault's `.obsidian/plugins/auto-image-uploader/` directory.

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
- **Access Key ID & Secret Access Key**: Credentials for accessing the upload service.
- **Image Size Suffix**: Suffix to apply to the image URL for resizing (default, small, medium, large).

## Contribution

Feel free to open an issue or submit a pull request if you encounter any bugs or have suggestions for improvement!

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for more details.

## Donations

I would be grateful for any donation to support the development of this plugin.

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >](https://www.buymeacoffee.com/yumeayai)

## Author
- **Author:** YumeAyai
- **GitHub Profile:** [YumeAyai](https://github.com/YumeAyai)
- **Donations:** [![Buy Me a Coffee](https://img.shields.io/badge/Donate-Buy%20Me%20a%20Coffee-orange)](https://buymeacoffee.com/yumeayai)

Feel free to contribute to the development of this plugin or report any issues in the [GitHub repository](https://github.com/YumeAyai/obsidian-picbeduploader/issues).