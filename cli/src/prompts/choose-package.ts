import inquirer, { Question } from 'inquirer';

import { configNames, ConfigType } from '../utils/config-types';
import { parseConfigName } from '../utils/parse-functions';
import { Optional } from '../types/aliases';

interface Answer {
  packageName: string;
}

const packageQuestion = (packageNames: string[]): Question<Answer> => ({
  name: 'packageName',
  type: 'list',
  message: 'Which package is this configuration for?',
  choices: [
    ...packageNames.map(name => ({
      name,
      value: name,
    })),
    {
      name: 'Other',
      value: '__other__',
    },
  ],
});

export default async function choosePackage(): Promise<Optional<ConfigType>> {
  const { packageName } = await inquirer.prompt<Answer>(
    packageQuestion(configNames),
  );

  // Handle custom case
  if (packageName === '__other__') {
    // Currently not supported
    return undefined;
  }

  return parseConfigName(packageName);
}
