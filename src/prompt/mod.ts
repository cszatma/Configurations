import { prompt, ConfirmQuestion, ListQuestion } from "inquirer";

import { CUSTOM_CONFIG_TYPE_NAME } from "../util/config_types";

interface ConfigTypeAnswer {
  configTypeName: string;
}

const configTypeQuestion = (configTypeNames: string[]): ListQuestion<ConfigTypeAnswer> => ({
  name: "configTypeName",
  type: "list",
  message: "Which package is this configuration for?",
  choices: [
    ...configTypeNames.map((name) => ({
      name,
      value: name,
    })),
    {
      name: "Other",
      value: CUSTOM_CONFIG_TYPE_NAME,
    },
  ],
});

export async function chooseConfigTypePrompt(configTypeNames: string[]): Promise<string> {
  const { configTypeName } = await prompt<ConfigTypeAnswer>(configTypeQuestion(configTypeNames));
  return configTypeName;
}

interface ConfirmDeleteAnswer {
  shouldDelete: boolean;
}

const confirmDeleteQuestion = (configName: string): ConfirmQuestion<ConfirmDeleteAnswer> => ({
  name: "shouldDelete",
  type: "confirm",
  message: `Are you sure you want to permanently delete ${configName}?`,
  default: false,
});

export async function confirmDeletePrompt(configName: string): Promise<boolean> {
  const { shouldDelete } = await prompt<ConfirmDeleteAnswer>(confirmDeleteQuestion(configName));
  return shouldDelete;
}
