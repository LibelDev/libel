import { addDays, addMonths, setHours, setMinutes, setSeconds } from 'date-fns';
import { promises as fs } from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { Directory, File } from '../config/config';
import { IconName } from '../src/components/Icon/types';
import type { IAnnouncement } from '../src/types/app';

type TAnswers = Omit<IAnnouncement, 'id'>;

(async () => {
  const answers = await inquirer.prompt<TAnswers>([
    {
      type: 'input',
      name: 'body',
      message: 'What do you want to announce?',
      validate: (body: string) => body !== '',
      filter: (body: string) => body.trim()
    },
    {
      type: 'list',
      name: 'icon',
      message: 'Choose an icon',
      choices: [
        { name: '(no icon)', value: null },
        ...Object.keys(IconName).map((key) => ({ name: key, value: IconName[key as keyof typeof IconName] }))
      ],
      filter: (icon: IconName | null) => icon || undefined
    },
    {
      type: 'list',
      name: 'endAt',
      message: 'When will it end at?',
      choices: [
        { name: '(never)', value: null },
        { name: '7 days later', value: getEndAtTimeAfter(0, 7) },
        { name: '2 weeks later', value: getEndAtTimeAfter(0, 14) },
        { name: '1 month later', value: getEndAtTimeAfter(1, 0) }
      ],
      filter: (endAt: number | null) => endAt || undefined
    },
    {
      type: 'confirm',
      name: 'forced',
      message: 'Show again next time if user has closed before?',
      default: false
    }
  ]);
  const announment: IAnnouncement = { id: uuid(), ...answers };
  const filepath = path.join(process.cwd(), Directory.Data, File.Announcements);
  const buffer = await fs.readFile(filepath);
  const json = buffer.toString();
  const announcements = JSON.parse(json) as IAnnouncement[];
  announcements.push(announment);
  const _json = JSON.stringify(announcements, null, 2);
  await fs.writeFile(filepath, _json);
  console.info(announment);
})();

/* helper functions */
function getEndAtTimeAfter (months: number, days: number) {
  const now = new Date();
  const date = (
    setHours(
      setMinutes(
        setSeconds(
          addMonths(
            addDays(
              now, days
            ), months
          ), 59
        ), 59
      ), 23
    )
  );
  return date.getTime();
}
