Here's a revised `README.md` file for your SitecorePal Visual Studio Code extension:

```markdown
# SitecorePal README

SitecorePal is a Visual Studio Code extension designed to assist with rapid component development in Sitecore. It leverages large language models to generate code, making the process more efficient and streamlined.

## Features

- Code snippets for Sitecore components and templates.
- Integration with large language models for code generation.
- Integration with embeded language models for code generation with grounding data.
- Generating storybook files for component preview.

## Requirements

- Visual Studio Code

## Installation

1. Open Visual Studio Code.
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS) to open the Command Palette.
3. Type "Extensions: Install from VSIX" and press Enter.
4. Locate the `sitecorepal-x.x.x.vsix` file (replace `x.x.x` with the actual version number) and select it.
5. Restart Visual Studio Code.

## Extension Settings

API Url: The API endpoint URL to AI Service which is usde for code generation.
API Key: The API key for authentication with the API.
Component File Path: The file path where components are stored.
Template Path: The path in Sitecore where data-source templates are created.
Template Parent Id: The ID in Sitecore where data-source templates are created.
Component Yml Path: The file path for YAML files.
Rendering Item Parent Path: The parent path for rendering items in Sitecore.
Rendering Item Parent Id: "The parent ID for rendering items in Sitecore.
Rendering Yml Path: The file path for rendering YAML files.

## Known Issues

- The extension may not work correctly if the credentials are incorrect.
- The extension may not generate highly complext code.

## Release Notes

### 1.0.0

- Initial release of SitecorePal.
- Support for code snippets for Sitecore components and templates including storybook files.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request on the [GitHub repository](https://github.com/yourusername/sitecorepal).

## License

SitecorePal is licensed under the MIT License. See the [LICENSE](https://github.com/yourusername/sitecorepal/blob/main/LICENSE) file for more information.

**Enjoy using SitecorePal!**
```

This `README.md` file provides an overview of the extension, its features, requirements, installation instructions, extension settings, known issues, release notes, contributing guidelines, and license information. It is a good starting point for users and developers interested in using SitecorePal.
