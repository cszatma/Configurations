import inquirer, { Question } from 'inquirer';

interface Answer {
  shouldDelete: boolean;
}

const confirmDeleteQuestion = (configName: string): Question<Answer> => ({
  name: 'shouldDelete',
  type: 'confirm',
  message: `Are you sure you want to permanently delete ${configName}?`,
  default: false,
});

export default async function confirmDelete(
  configName: string,
): Promise<boolean> {
  const { shouldDelete } = await inquirer.prompt<Answer>(
    confirmDeleteQuestion(configName),
  );

  return shouldDelete;
}
