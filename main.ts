import { addIcon, App, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
interface PicBedUploaderSettings {
	uploadEndpoint: string;
	accessKeyId: string;
	secretAccess: string;
	albumId: string;
	imageSizeSuffix: string;
}

const DEFAULT_SETTINGS: PicBedUploaderSettings = {
	uploadEndpoint: "https://example.com/upload",
	accessKeyId: "",
	secretAccess: "",
	albumId: "",
	imageSizeSuffix: "",
}


export default class PicBedUploader extends Plugin {
	settings: PicBedUploaderSettings;

	async onload() {
		await this.loadSettings();

		const uploadImage = () => {
			new ImageUploadModal(this.app, this, (name, description, url) => {
				if (url !== null) {
					new Notice(`Uploading as ${url}`);
					const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
					if (activeView) {
						const editor = activeView.editor;
						editor.replaceSelection(`![${name} - ${description}](${url})`);
					}
				}
			}).open();
		};

		addIcon("upload", `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-up"><path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21"/><path d="m14 19.5 3-3 3 3"/><path d="M17 22v-5.5"/><circle cx="9" cy="9" r="2"/></svg>`);
		const ribbonIconEl = this.addRibbonIcon('upload', 'PicBedUploader', (evt: MouseEvent) => {
			uploadImage();
		});

		this.addCommand({
			id: 'upload-image',
			name: 'Upload Image',
			icon: 'upload',
			callback: () => {
				uploadImage();
			}
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ImageUploadModal extends Modal {
	private result: string | ArrayBuffer | null;
	private uploadEndpoint: string;
	private file: File | null;
	private albumId: string;
	private name: string;
	private description: string;
	private imageSizeSuffix: string;

	constructor(app: App, private plugin: PicBedUploader, private onSubmit: (name: string | null, description: string | null, result: string | ArrayBuffer | null) => void) {
		super(app);
		this.result = null;
		this.file = null;
		this.name = 'Figure'
		this.description = 'This is an image.'

		this.uploadEndpoint = this.plugin.settings.uploadEndpoint;
		this.albumId = this.plugin.settings.albumId;
		this.imageSizeSuffix = this.plugin.settings.imageSizeSuffix;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.style.width = "auto";
		contentEl.style.height = "auto";
		contentEl.style.maxWidth = "80vw";
		contentEl.style.maxHeight = "80vh";
		contentEl.style.overflow = "auto";

		contentEl.createEl("h1", { text: "Upload an Image" });

		const uploadArea = contentEl.createEl("div", { cls: "upload-area" });
		const textSpan = uploadArea.createEl("span", { text: "Click or drag an image here" });
		const imagePreview = uploadArea.createEl("img", { attr: { src: "", alt: "Image Preview" }, cls: "hidden" });

		imagePreview.style.width = "100%";
		imagePreview.style.height = "100%";
		imagePreview.style.display = "none";

		uploadArea.style.width = "100%";
		uploadArea.style.minHeight = "300px";
		uploadArea.style.border = "2px dashed";
		uploadArea.style.borderRadius = "5px";
		uploadArea.style.display = "flex";
		uploadArea.style.justifyContent = "center";
		uploadArea.style.alignItems = "center";
		uploadArea.style.marginTop = "20px";
		uploadArea.style.cursor = "pointer";
		uploadArea.style.position = "relative";

		this.setupUploadArea(uploadArea, imagePreview, textSpan);

		new Setting(contentEl)
			.setName("Name")
			.addText((text) =>
				text.onChange((value) => {
					this.name = value
				}));

		new Setting(contentEl)
			.setName("Description")
			.addText((text) =>
				text.onChange((value) => {
					this.description = value
				}));

		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText("Submit")
					.setCta()
					.onClick(() => {
						this.close();
						this.handleUpload()!.then((result) => {
							this.onSubmit(this.name, this.description, this.result);
						});

					}));

		contentEl.addEventListener('keydown', (event) => {
			if (event.key === 'Enter') {
				const button = contentEl.querySelector('button');
				if (button) {
					(button as HTMLButtonElement).click();
				}
			}
		});

		contentEl.tabIndex = 0;
	}

	private setupUploadArea(uploadArea: HTMLElement, imagePreview: HTMLImageElement, textSpan: HTMLSpanElement) {
		uploadArea.addEventListener('click', () => this.triggerFileInput(imagePreview, textSpan));

		uploadArea.addEventListener('dragover', (event) => {
			event.preventDefault();
			uploadArea.classList.add('hover');
		});

		uploadArea.addEventListener('dragleave', () => {
			uploadArea.classList.remove('hover');
		});

		uploadArea.addEventListener('drop', (event) => {
			event.preventDefault();
			uploadArea.classList.remove('hover');
			if (event.dataTransfer) {
				this.handleFiles(event.dataTransfer.files, imagePreview, textSpan);
			}
		});
	}

	private triggerFileInput(imagePreview: HTMLImageElement, textSpan: HTMLSpanElement) {
		const fileInput = this.createFileInput(imagePreview, textSpan);
		document.body.appendChild(fileInput);
		fileInput.click();
		document.body.removeChild(fileInput);
	}

	private createFileInput(imagePreview: HTMLImageElement, textSpan: HTMLSpanElement): HTMLInputElement {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = 'image/*'; // Only accept images
		fileInput.style.display = 'none';

		fileInput.addEventListener('change', () => {
			this.handleFiles(fileInput.files, imagePreview, textSpan);
		});

		return fileInput
	}

	private handleFiles(files: FileList | null, imagePreview: HTMLImageElement, textSpan: HTMLSpanElement) {
		if (files && files.length > 0) {
			const file = files[0];
			if (file.type.startsWith('image/')) {
				const reader = new FileReader();
				reader.onload = (e) => {
					imagePreview.src = e.target!.result as string;
					imagePreview.style.display = "block";
					textSpan.style.display = "none";
					this.file = file;
				};
				reader.readAsDataURL(file);

			} else {
				alert('Please select an image file');
			}
		}
	}

	private async handleUpload() {
		if (this.file) {
			const formData = new FormData();
			formData.append('image', this.file);
			formData.append('album', this.albumId);
			formData.append("name", this.name);
			formData.append("description", this.description);

			return fetch(this.uploadEndpoint, {
				method: 'POST',
				headers: {
					'X-Auth-ID': this.plugin.settings.accessKeyId,
					'X-Auth-Secret': this.plugin.settings.secretAccess
				},
				body: formData
			}).then(async response => {
				if (!response.ok) {
					new Notice(`Upload failed: ${this.file?.name}`);
					return Promise.reject(new Error(`Upload failed: ${this.file?.name}`));
				}
				// &imageMogr2/thumbnail/640x
				// 根据腾讯云的图片处理接口，添加缩略图后缀
				// 详见：https://cloud.tencent.com/document/product/876/49182
				var suffix = "";
				switch (this.imageSizeSuffix) {
					case "d":
						break;
					case "s":
						suffix = "?imageMogr2/thumbnail/640x";
						break;
					case "m":
						suffix = "?imageMogr2/thumbnail/1280x";
						break;
					case "l":
						suffix = "?imageMogr2/thumbnail/1920x";
						break;
					default:
						break;
				}

				const data = await response.json();
				this.result = data.files[0].fields?.url + suffix;
				new Notice(`Upload successful: ${this.file?.name}`);
				return this.result;
			}).catch(error => {
				new Notice(`Upload error: ${error.message}`);
			});
		} else {
			new Notice('No file selected.');
		}
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: PicBedUploader;

	constructor(app: App, plugin: PicBedUploader) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl('h1', { text: 'PicBedUploader' })
		containerEl.createEl('h2', { text: 'Plugin Settings' });

		new Setting(containerEl)
			.setName('Upload Endpoint')
			.setDesc('The endpoint to upload images to')
			.addText(text => text
				.setPlaceholder('Enter the upload endpoint')
				.setValue(this.plugin.settings.uploadEndpoint)
				.onChange(async (value) => {
					this.plugin.settings.uploadEndpoint = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Album ID')
			.setDesc('The ID of the album to upload images to')
			.addText(text => text
				.setPlaceholder('Enter the album ID')
				.setValue(this.plugin.settings.albumId)
				.onChange(async (value) => {
					this.plugin.settings.albumId = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Upload Image')
			.setDesc('To testing the upload function')
			.addButton(button => button
				.setButtonText('Upload Image')
				.onClick(() => {
					new ImageUploadModal(this.app, this.plugin, (name, description, url) => {
						new Notice(`Upload ${name} as ${url}`);
					}).open();
				}));

		new Setting(containerEl)
			.setName('Access Key ID')
			.setDesc('Enter your Access Key ID. Attention: Access Key ID will be saved as plain text.')
			.addText(text => text
				.setPlaceholder('Enter your Access Key ID')
				.setValue(this.plugin.settings.accessKeyId)
				.onChange(async (value) => {
					this.plugin.settings.accessKeyId = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Secret Access Key')
			.setDesc('Enter your Secret Access Key. Attention: Secret Access Key will be saved as plain text.')
			.addText(text => text
				.setPlaceholder('Enter your Secret Access Key')
				.setValue(this.plugin.settings.secretAccess)
				.onChange(async (value) => {
					this.plugin.settings.secretAccess = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Image Size Suffix')
			.setDesc('The suffix to append to the image URL to get different sizes')
			.addDropdown(dropdown => dropdown
				.addOptions({
					"d": "default",
					"s": "small",
					"m": "medium",
					"l": "large"
				})
				.setValue(this.plugin.settings.imageSizeSuffix)
				.onChange(async (value) => {
					this.plugin.settings.imageSizeSuffix = value;
					await this.plugin.saveSettings();
				}));
	}
}