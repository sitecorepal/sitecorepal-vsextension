// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "sitecorpal" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const helloWorld = vscode.commands.registerCommand(
    "sitecorepal.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from sitecorepal!");
    }
  );

  let createComponent = vscode.commands.registerCommand(
    "sitecorepal.createComponent",
    async () => {
      const componentName = await vscode.window.showInputBox({
        prompt: "Enter the component name",
        placeHolder: "e.g., Hero",
      });

      const componentFields = await vscode.window.showInputBox({
        prompt: "Enter the component fields (comma-separated)",
        placeHolder: "Title, Description, Link, Image",
      });

      const componentDescription = await vscode.window.showInputBox({
        prompt: "Enter the component description",
        placeHolder:
          "e.g., Use an image as the background of the Hero section. Title, Description, and Link fields should be allowing for the alignment options: Left, Center, Right. Ensure the alignment for the Title, Description, and Link is controlled via a prop, allowing flexibility in placement.",
      });

      const config = vscode.workspace.getConfiguration("extension");
      const componentPath = config.get<string>("componentPath");
      const templatePath = config.get<string>("templatePath");
      const templateParentId = config.get<string>("templateParentId");
      const ymlPath = config.get<string>("componentYmlPath");

      if (
        !componentName ||
        !componentFields ||
        !componentPath ||
        !templatePath ||
        !templateParentId ||
        !ymlPath
      ) {
        vscode.window.showErrorMessage("Missing input values");
        return;
      }

      // Remove whitespaces from the component name
      const sanitizedComponentName = componentName.replace(/\s+/g, "");

      const fieldsArray = componentFields.split(",").map((f) => f.trim());

      const generatedCode = await generateCodeUsingAI(
        `Generate a Sitecore JSS Component with the following details: Component Name: ${sanitizedComponentName}. Fields: ${fieldsArray.join(
          ", "
        )}. ${componentDescription}. Use NextJS, Typescript, and JSX.Element for all components. Use helper fields from the sitecore-jss SDK for field rendering. Use the latest Bootstrap 5.0 classes for styling and ensure no deprecated classes are used. Ensure the component is fully responsive, utilizing Bootstrap 5.0 grid and flex utilities for efficient and modern layout. Ensure the generated code does not include any language identifiers (e.g., typescript, yaml) or filenames (e.g., // src/components/${componentName}.tsx) at the beginning or anywhere in the code. Do not use FC (Functional Component) from the React library. Ensure the response contains only the code, with no explanation or comments.`
      );

      // console.log(generatedCode);

      if (generatedCode) {
        saveFile(componentPath, `${sanitizedComponentName}.tsx`, generatedCode);
        vscode.window.showInformationMessage(
          `Component ${sanitizedComponentName} created successfully!`
        );

        const storybookPrompt = `Generate a Storybook file for a Sitecore JSS component called ${sanitizedComponentName}. The component fields include: ${fieldsArray.join(
          ", "
        )}. Here is the code of the ${componentName} component for which I want to generate Storybook files: ${generatedCode}. The output should be structured as a Storybook file for a TypeScript file (.stories.tsx) with the following format: 1. Import the component and the necessary Meta and StoryObj types from Storybook. 2. Create a "Default" story for this component. 3. The "Default" story should provide example values for all fields. 4. Create additional stories for each variant if the relevant settings change based on the provided component description: ${componentDescription}. 5. Generate the default data for the component fields using the following structure as a reference: const defaultData = { rendering: { dataSource: 'sampledatasource', componentName: 'HeroHalfMedia', }, fields: { theme: { value: '', }, sectionId: { value: '', }, componentSpacing: null, eyebrowLevel: { id: '0f556f3a-bbad-4aa5-952d-b79003b39cd6', url: '', name: 'Heading 2', displayName: 'Heading 2', fields: { Value: { value: 'h2', }, }, templateId: 'd2923fee-da4e-49be-830c-e27764dfa269', templateName: 'Enum', }, eyebrowText: { value: 'Eyebrow', }, headlineText: { value: 'This is a headline', }, imgPosition: { id: '0a58d643-e0c1-4a6e-a9f6-03d731a55121', url: '', name: 'Right', displayName: 'Right', fields: { Value: { value: 'right', }, }, templateId: 'd2923fee-da4e-49be-830c-e27764dfa269', templateName: 'Enum', }, primaryImageMobile: { value: { src: 'https://picsum.photos/1200/500', alt: 'Hero Half Media Image', width: '800', height: '450', }, }, primaryImageMobileFocusArea: { id: 'e6b36945-ebc0-4af8-ad95-d8268b56b7d0', url: '', name: 'Center', displayName: 'Center', fields: { Value: { value: 'center', }, }, templateId: 'd2923fee-da4e-49be-830c-e27764dfa269', templateName: 'Enum', }, primaryImage: { value: { src: 'https://picsum.photos/1200/500', alt: 'Hero Half Media Image', width: '800', height: '450', }, }, primaryImageCaption: { value: '', }, primaryVideo: null, backgroundColor: { id: '6c8aa36e-f22d-400a-9fe7-391181db23ad', url: '', name: 'Black', displayName: 'Black', fields: { Value: { value: 'black', }, }, templateId: 'd2923fee-da4e-49be-830c-e27764dfa269', templateName: 'Enum', }, body: { value: '<p><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span></p>', }, cta1Style: { id: '49a23327-0397-4cce-a930-e76918d37c42', url: '', name: 'Primary', displayName: 'Primary', fields: { Value: { value: 'primary', }, }, templateId: 'd2923fee-da4e-49be-830c-e27764dfa269', templateName: 'Enum', }, cta1Link: { value: { href: '/Hero-Half-Media', text: 'Call to action', anchor: '', linktype: 'internal', class: '', title: '', target: '', querystring: '', id: '{3223B86F-3880-4F91-84EF-7203F09C1D3C}', }, }, cta1Icon: { id: '50590edc-7ea7-4436-9a3e-701c87a07db2', url: '', name: 'Arrow', displayName: 'Arrow', fields: { Value: { value: 'arrow', }, }, templateId: 'd2923fee-da4e-49be-830c-e27764dfa269', templateName: 'Enum', }, eventName: { value: '', }, eventType: { value: '', }, eventZone: { value: '', }, }, };. Ensure the generated code does not include any language identifiers (e.g., typescript, yaml) or filenames (e.g., // src/components/${componentName}.stories.tsx) at the beginning or anywhere in the code. Ensure the response contains only the code, with no explanation or comments.`;

        // console.log(storybookPrompt);

        // Use AI to generate the Storybook content
        try {
          const storybookContent = await generateCodeUsingAI(storybookPrompt);

          if (storybookContent) {
            saveFile(
              componentPath,
              `${sanitizedComponentName}.stories.tsx`,
              storybookContent
            );
          }
        } catch (error) {
          vscode.window.showErrorMessage(
            `Error generating Storybook file for ${sanitizedComponentName}: ${error}`
          );
        }

        const yamlFiles = generateYamlFiles(
          componentName,
          componentFields,
          templatePath,
          templateParentId
        );

        saveYamlFiles(componentName, fieldsArray, ymlPath, await yamlFiles);

        askUserForRenderingYaml(
          sanitizedComponentName,
          `${templatePath}/${sanitizedComponentName}`
        );
      }
    }
  );

  // Register the 'extension.askSitecoreCodeGPT' command
  let askSitecoreCodeGPT = vscode.commands.registerCommand(
    "sitecorepal.askSitecoreCodeGPT",
    async () => {
      // Prompt the user for a string input (this will be the API prompt)
      const userPrompt = await vscode.window.showInputBox({
        prompt: "Enter your prompt",
        placeHolder: "Type your prompt here",
      });

      // If the user provided a prompt, proceed with API call
      if (userPrompt) {
        // Call the API
        try {
          const apiResponse = await callApi(userPrompt);

          if (apiResponse) {
            saveFile(
              "src/sxastarter/src/components/pagecontent",
              "Promo.tsx",
              apiResponse
            );
            vscode.window.showInformationMessage(
              `Component created successfully!`
            );
          }

          // Display the API response to the user
          // vscode.window.showInformationMessage(`API Response: ${apiResponse}`);
        } catch (error) {
          vscode.window.showErrorMessage(`API Call Failed: ${error}`);
        }
      } else {
        vscode.window.showWarningMessage("Prompt is required to call the API");
      }
    }
  );

  // Add the command to the context, so it is disposed of when the extension is deactivated
  context.subscriptions.push(askSitecoreCodeGPT);

  context.subscriptions.push(helloWorld);

  context.subscriptions.push(createComponent);
}

// This method is called when your extension is deactivated
export function deactivate() {}

// Function to call the API
async function callApi(prompt: string): Promise<string> {
  const apiUrl = "http://127.0.0.1:5000/api/chat"; // Replace with your API endpoint

  // Define the request payload
  const payload = {
    query: prompt,
  };

  try {
    // Send the POST request to the API using axios
    const response = await axios.post(apiUrl, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response.data.result);

    // Extract the data from the response
    const data = response.data;

    // Return the result or handle the data as needed
    return data.result || "No response from API"; // Adjust according to API response format
  } catch (error) {
    console.log(error);
    // Throw an error if the request fails
    throw new Error(`API request failed: ${error}`);
  }
}

// Main function to ask user about creating the rendering item YAML and collect inputs
async function askUserForRenderingYaml(
  componentName: string,
  datasourceTemplatePath: string
) {
  const userResponse = await vscode.window.showQuickPick(["Yes", "No"], {
    placeHolder: "Do you want to create a YML file for the rendering item?",
  });

  if (userResponse === "Yes") {
    // Collect additional inputs from the user
    const config = vscode.workspace.getConfiguration("extension");

    const renderingItemParentPath = config.get<string>(
      "renderingItemParentPath"
    );
    const renderingItemParentId = config.get<string>("renderingItemParentId");
    const ymlFilePath = config.get<string>("renderingYmlPath");

    // Ensure all inputs are provided
    if (!renderingItemParentPath || !renderingItemParentId || !ymlFilePath) {
      vscode.window.showErrorMessage(
        "All inputs are required to create the rendering item YAML file."
      );
      return;
    }

    // Generate Rendering YAML using AI based on user inputs
    try {
      const renderingYaml = await generateCodeUsingAI(
        `Generate a Sitecore serialization YAML file for a rendering item of component: ${componentName}. The rendering item should be stored under the following parent folder and ID: Parent folder path: ${renderingItemParentPath}. Parent ID: ${renderingItemParentId}. Template: 04646a89-996f-4ee7-878a-ffdbf1f0ef0d. Datasource Template: ${datasourceTemplatePath}. Always create new GUIDs wherever required, without exception. Ensure the generated code does not include any language identifiers (e.g., typescript, yaml) or filenames at the beginning or anywhere in the code.. Ensure that the response contains only the YAML code, with no explanation or comments. Use the following YAML structure as a reference for generating the output: --- ID: "2492bac4-da07-4c86-87f0-9873d40e2276" Parent: "2001c9a8-2f50-4772-a2fe-0ffc1ddc0758" Template: "04646a89-996f-4ee7-878a-ffdbf1f0ef0d" Path: /sitecore/layout/Renderings/Feature/JSS Experience Accelerator/Page Content/Promo SharedFields: - ID: "037fe404-dd19-4bf7-8e30-4dadf68b27b0" Hint: componentName Value: Promo - ID: "06d5295c-ed2f-4a54-9bf2-26228d113318" Hint: __Icon Value: Office/32x32/window_dialog.png - ID: "1a7c85e5-dc0b-490d-9187-bb1dbcb4c72f" Hint: Datasource Template Value: /sitecore/templates/Feature/JSS Experience Accelerator/Page Content/Promo - ID: "7d8ae35f-9ed1-43b5-96a2-0a5f040d4e4e" Hint: Open Properties after Add Value: 0 - ID: "9c6106ea-7a5a-48e2-8cad-f0f693b1e2d4" Hint: __Read Only Value: 0 - ID: "a77e8568-1ab3-44f1-a664-b7c37ec7810d" Hint: Parameters Template Value: "{881869CA-7F58-45EA-8B34-AD1BFD3551A8}" - ID: "b5b27af1-25ef-405c-87ce-369b3a004016" Hint: Datasource Location Value: "query:$site/*[@@name='Data']/*[@@templatename='Promo Folder']|query:$sharedSites/*[@@name='Data']/*[@@templatename='Promo Folder']" - ID: "c39a90ce-0035-41bb-90f6-3c8a6ea87797" Hint: AddFieldEditorButton Value: 0 - ID: "e829c217-5e94-4306-9c48-2634b094fdc2" Hint: OtherProperties Value: IsRenderingsWithDynamicPlaceholders=true Languages: - Language: en Versions: - Version: 1 Fields: - ID: "25bed78c-4957-4165-998a-ca1b52f67497" Hint: __Created Value: 20211012T120931Z - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f" Hint: __Created by Value: | sitecore\JssImport - ID: "8cdc337e-a112-42fb-bbb4-4143751e123f" Hint: __Revision Value: "26c84179-3110-4f6f-aa15-01df96703dc0"`
      );

      // Write the rendering YAML file to the specified path
      saveFile(ymlFilePath, `${componentName}.yml`, renderingYaml);
      vscode.window.showInformationMessage(
        `Rendering item YAML file created successfully at ${ymlFilePath}!`
      );
    } catch (error) {
      vscode.window.showErrorMessage(
        `Error generating rendering item YAML: ${error}`
      );
    }
  } else {
    vscode.window.showInformationMessage(
      "Rendering item YAML creation skipped."
    );
  }
}

// Function to dynamically create a prompt for AI to generate rendering YAML
async function generateCodeUsingAI(prompt: string): Promise<string> {
  try {
    const QUESTION = prompt;

    // Get the configuration settings
    const config = vscode.workspace.getConfiguration("extension");
    const ENDPOINT = config.get<string>("apiUrl");
    const API_KEY = config.get<string>("apiKey");

    if (!ENDPOINT) {
      throw new Error(
        "API URL is not configured. Please set it in the extension settings."
      );
    }

    const payload = {
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: "Assistant is an AI chatbot that helps users turn natural language requirements into Sitecore JSS headless NextJS Typescript code based on the Bootstrap 5 framework. Additionally, it assists in generating YAML files for Sitecore serialization, ensuring proper structure, GUID generation, and adherence to Sitecore conventions.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: QUESTION,
            },
          ],
        },
      ],
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 1516,
      stream: false,
    };
    const httpClient = axios.create({
      headers: {
        "api-key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    const response = await httpClient.post(ENDPOINT, JSON.stringify(payload));

    // console.log(response);
    // console.log(response.data.choices[0].message.content);

    if (response.status === 200) {
      return response.data.choices[0].message.content;
    } else {
      vscode.window.showErrorMessage(
        `Error: ${response.status}, ${response.statusText}`
      );
      return "";
    }
  } catch (error) {
    vscode.window.showErrorMessage("Failed to generate the code");
    return "";
  }
}

// Helper function to normalize line endings to LF
function normalizeLineEndings(
  content: string,
  lineEnding: "lf" | "crlf" = "lf"
): string {
  if (lineEnding === "lf") {
    return content.replace(/\r\n|\r/g, "\n"); // Normalize to LF
  } else {
    return content.replace(/\r\n|\n/g, "\r\n"); // Normalize to CRLF
  }
}

function saveFile(filePath: string, fileName: string, generatedCode: string) {
  // Get the current workspace folder
  const workspaceFolder = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : null;

  if (!workspaceFolder) {
    vscode.window.showErrorMessage(
      "No workspace is open. Please open a workspace first."
    );
    return;
  }

  // Resolve the user-specified path relative to the workspace folder
  const fullPath = path.resolve(workspaceFolder, filePath);
  // Ensure the folder structure exists
  fs.mkdirSync(fullPath, { recursive: true });

  // Normalize the content's line endings to LF (or CRLF)
  const normalizedContent = normalizeLineEndings(generatedCode, "crlf"); // 'lf' for LF or 'crlf' for CRLF

  // Define the component file path (e.g., componentName.tsx)
  const componentFilePath = path.join(fullPath, fileName);
  // Save the component code
  fs.writeFileSync(componentFilePath, normalizedContent, "utf8");

  vscode.window.showInformationMessage(
    `Component ${fileName} created successfully at ${componentFilePath}!`
  );
}

async function generateYamlFiles(
  componentName: string,
  componentFields: string,
  templatePath: string,
  templateParentId: string
) {
  // 1. Generate Template YAML
  const templateYaml = await generateCodeUsingAI(
    `Generate a Sitecore serialization YAML file for the template with the following details: Template Name: ${componentName}, Template Location: ${templatePath}, Template Parent ID: ${templateParentId}. Template: ab86861a-6030-46c5-b394-e8f99e8b87db. Always create new GUIDs wherever required, without exception. Ensure the generated code does not include any language identifiers (e.g., typescript, yaml). Ensure that the response contains only the YAML code, with no explanation or comments. Use the following YAML structure as a reference for generating the output: --- ID: "dfed4457-d760-457a-bec1-c0dccdc44381" Parent: "29afd098-a8b7-40ca-bd0e-28a1fd6f40b1" Template: "ab86861a-6030-46c5-b394-e8f99e8b87db" Path: /sitecore/templates/Feature/JSS Experience Accelerator/Page Content/Promo SharedFields: - ID: "06d5295c-ed2f-4a54-9bf2-26228d113318" Hint: __Icon Value: Office/32x32/window_dialog.png - ID: "12c33f3f-86c5-43a5-aeb4-5598cec45116" Hint: __Base template Value: | {1930BBEB-7805-471A-A3BE-4858AC7CF696} {44A022DB-56D3-419A-B43B-E27E4D8E9C41} - ID: "ba3f86a2-4a1c-4d78-b63d-91c2779c1b5e" Hint: __Sortorder Value: 100 Languages: - Language: en Fields: - ID: "b5e02ad9-d56f-4c41-a065-a133db87bdeb" Hint: __Display name Value: Promo Versions: - Version: 1 Fields: - ID: "25bed78c-4957-4165-998a-ca1b52f67497" Hint: __Created Value: 20111213T133000Z - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f" Hint: __Created by Value: | sitecore\admin - ID: "8cdc337e-a112-42fb-bbb4-4143751e123f" Hint: __Revision Value: "27da0f29-b9d7-466a-828e-272f1e2aff88". Ensure that the Versions node is always nested correctly under the appropriate Language node, as in the sample structure.`
  );

  // 2. Generate Template Section YAML
  const templateSectionYaml = await generateCodeUsingAI(
    `Generate a Sitecore serialization YAML file for the template section with the following details: Template Section Name: Content. Template: e269fbb5-3750-427a-9149-7aa950b49301. Parent: The ID from the Template YAML. Path: Concatenate the Path from the Template YAML with the template section name (/Content). Always create new GUIDs wherever required, without exception. Ensure the generated code does not include any language identifiers (e.g., typescript, yaml). Ensure the response contains only YAML code, with no explanation or comments. Here is the Template Section YAML that should be referenced: ${templateYaml}. Use the following YAML structure as a reference for generating the output: --- ID: "7452a89a-ef55-46aa-a566-1327a1391778" Parent: "dfed4457-d760-457a-bec1-c0dccdc44381" Template: "e269fbb5-3750-427a-9149-7aa950b49301" Path: /sitecore/templates/Feature/JSS Experience Accelerator/Page Content/Promo/Promo SharedFields: - ID: "06d5295c-ed2f-4a54-9bf2-26228d113318" Hint: __Icon Value: Office/32x32/window_dialog.png Languages: - Language: "de-DE" Fields: - ID: "b5e02ad9-d56f-4c41-a065-a133db87bdeb" Hint: __Display name Value: Promo Versions: - Version: 1 Fields: - ID: "25bed78c-4957-4165-998a-ca1b52f67497" Hint: __Created Value: 20240901T114925Z - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f" Hint: __Created by Value: | sitecore\Admin - ID: "8cdc337e-a112-42fb-bbb4-4143751e123f" Hint: __Revision Value: "a9f92ab0-92df-49c2-bd33-0a698bf5aa43" - Language: en Versions: - Version: 1 Fields: - ID: "25bed78c-4957-4165-998a-ca1b52f67497" Hint: __Created Value: 20111213T143500 - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f" Hint: __Created by Value: | sitecore\admin - ID: "8cdc337e-a112-42fb-bbb4-4143751e123f" Hint: __Revision Value: "c39a70b4-dbee-4c5c-9157-010ed21681cc" - Language: "ja-JP" Fields: - ID: "b5e02ad9-d56f-4c41-a065-a133db87bdeb" Hint: __Display name Value: プロモ Versions: - Version: 1 Fields: - ID: "25bed78c-4957-4165-998a-ca1b52f67497" Hint: __Created Value: 20240901T114925Z - ID: "5dd74568-4d4b-44c1-b513-0af5f4cda34f" Hint: __Created by Value: | sitecore\Admin - ID: "8cdc337e-a112-42fb-bbb4-4143751e123f" Hint: __Revision Value: "a9f92ab0-92df-49c2-bd33-0a698bf5aa43". Ensure that the Versions node is always nested correctly under the appropriate Language node, as in the sample structure.`
  );

  // 3. Generate Field YAMLs
  const fields = componentFields.split(",").map((field) => field.trim());
  const fieldYamls = await Promise.all(
    fields.map((field) =>
      generateCodeUsingAI(
        `Generate a Sitecore serialization YAML file for the template field with the following details: Field Name: ${field}. Template: 455a3e98-a627-4b40-8035-e683a0331ac7. Parent: The ID from the Template Section YAML. Path: Concatenate the Path from the Template Section YAML with the template field name (/${field}). Field Type: Identify the type of field based on the field name, For example, use "Rich Text" for text-related fields (e.g., fields with names like PromoText), and use appropriate types for other fields (e.g., "Single-Line Text", "Date", "Checkbox", "General Link", "Image", etc.). Include all shared fields in the YAML file. Always create new GUIDs wherever required, without exception. Ensure the generated code does not include any language identifiers (e.g., typescript, yaml). Ensure the response contains only YAML code, with no explanation or comments. Here is the Template Section YAML that should be referenced: ${templateSectionYaml}. Use the following YAML structure as a reference for generating the output: --- ID: "28079f3a-896b-4273-be5f-59d0ebb7cd7d" Parent: "7452a89a-ef55-46aa-a566-1327a1391778" Template: "455a3e98-a627-4b40-8035-e683a0331ac7" Path: /sitecore/templates/Feature/JSS Experience Accelerator/Page Content/Promo/Promo/PromoText SharedFields: - ID: "1eb8ae32-e190-44a6-968d-ed904c794ebf" Hint: Source Value: "query:$xaRichTextProfile" - ID: "24cb32f0-e364-4f37-b400-0f2899097b5b" Hint: Enable Shared Language Fallback Value: 1 - ID: "ab162cc0-dc80-4abf-8871-998ee5d7ba32" Hint: Type Value: Rich Text - ID: "ba3f86a2-4a1c-4d78-b63d-91c2779c1b5e" Hint: __Sortorder Value: 100 Languages: - Language: en Fields: - ID: "19a69332-a23e-4e70-8d16-b2640cb24cc8" Hint: Title Value: Text Versions: - Version: 1 Fields: - ID: "25bed78c-4957-4165-998a-ca1b52f67497" Hint: __Created Value: 20111213T143500 - ID: "8cdc337e-a112-42fb-bbb4-4143751e123f" Hint: __Revision Value: "809b38b9-bce2-46af-956d-99f9e6aa5eeb" - ID: "fa622538-0c13-4130-a001-45984241aa00" Hint: Enable Language Fallback Value: 1. Ensure that the Versions node is always nested correctly under the appropriate Language node, as in the sample structure.`
      )
    )
  );

  return {
    templateYaml,
    templateSectionYaml,
    fieldYamls,
  };
}

function saveYamlFiles(
  componentName: string,
  componentFields: string[],
  ymlPath: string,
  yamls: {
    templateYaml: string;
    templateSectionYaml: string;
    fieldYamls: string[];
  }
) {
  // Get the current workspace folder
  const workspaceFolder = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : null;

  if (!workspaceFolder) {
    vscode.window.showErrorMessage(
      "No workspace is open. Please open a workspace first."
    );
    return;
  }
  // Resolve the user-specified path relative to the workspace folder
  const fullPath = path.resolve(workspaceFolder, ymlPath);
  // Ensure the folder structure exists
  fs.mkdirSync(path.join(fullPath, componentName), { recursive: true });
  fs.mkdirSync(path.join(fullPath, componentName, "Content"), {
    recursive: true,
  });

  // Save template YAML
  fs.writeFileSync(
    path.join(fullPath, `${componentName}.yml`),
    yamls.templateYaml,
    "utf8"
  );

  // Save template section YAML
  fs.writeFileSync(
    path.join(fullPath, componentName, "Content.yml"),
    yamls.templateSectionYaml,
    "utf8"
  );

  // Save each field YAML
  componentFields.forEach((field, index) => {
    fs.writeFileSync(
      path.join(fullPath, componentName, "Content", `${field}.yml`),
      yamls.fieldYamls[index],
      "utf8"
    );
  });

  vscode.window.showInformationMessage(
    `YAML files for ${yamls.fieldYamls.length} fields created successfully!`
  );
}
