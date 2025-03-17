import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as readlineSync from 'readline-sync';
import * as dotenv from 'dotenv';
dotenv.config();

const numUsersFromEnv = process.env.NUM_USERS ? parseInt(process.env.NUM_USERS) : 5;

// Benutzertypen definieren
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Funktion zum Erzeugen von Benutzerdaten
const generateUser = (id: number): User => {
  return {
    id,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  };
};

// Funktion zum Speichern der Benutzer in einer JSON-Datei
const saveUsersToFile = (users: User[]): void => {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

// Funktion zum Laden der Benutzer aus einer JSON-Datei
const loadUsersFromFile = (): User[] => {
  if (fs.existsSync('users.json')) {
    const data = fs.readFileSync('users.json', 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

// Benutzer im Terminal steuern
const runApp = () => {
  const existingUsers = loadUsersFromFile();

  console.log('Willkommen bei der Fake-Benutzerdatenbank!');
  console.log('1: Neue Benutzer generieren');
  console.log('2: Bestehende Benutzer anzeigen');
  console.log('3: Nach einem Benutzer suchen');
  console.log('0: Beenden');

  const action = readlineSync.question('Wählen Sie eine Option (0-3): ');

  switch (action) {
    case '1':
      const numUsers = parseInt(
        readlineSync.question('Wie viele Benutzer möchten Sie generieren? ')
      );
      const newUsers: User[] = [];
      for (let i = 0; i < numUsers; i++) {
        newUsers.push(generateUser(i + 1));
      }
      const allUsers = [...existingUsers, ...newUsers];
      saveUsersToFile(allUsers);
      console.log(`${numUsers} neue Benutzer wurden erstellt.`);
      break;

    case '2':
      if (existingUsers.length === 0) {
        console.log('Keine Benutzer in der Datenbank.');
      } else {
        console.log('Bestehende Benutzer:');
        existingUsers.forEach((user) => {
          console.log(`${user.id}: ${user.firstName} ${user.lastName}`);
        });
      }
      break;

    case '3':
      const searchTerm = readlineSync.question('Geben Sie den Namen des Benutzers ein: ');
      console.log(searchTerm);
      const splittedName = searchTerm.split(" ");
      const foundUsers = existingUsers.filter((user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())

      //Zweiter Lösungsweg
        // user.firstName.toLowerCase().includes(searchTerm[0].toLowerCase()) ||
        // user.lastName.toLowerCase().includes(searchTerm[1].toLowerCase())
      );
      console.log(foundUsers);
      if (foundUsers.length > 0) {
        console.log('Gefundene Benutzer:');
        foundUsers.forEach((user) => {
          console.log(`${user.id}: ${user.firstName} ${user.lastName} - ${user.email}`);
        });
      } else {
        console.log('Kein Benutzer gefunden.');
      }
      break;

    case '0':
      console.log('Beenden...');
      break;

    default:
      console.log('Ungültige Eingabe, bitte versuchen Sie es erneut.');
      break;
  }

  // Das Programm erneut ausführen, wenn der Benutzer nicht beenden möchte
  if (action !== '0') {
    runApp();
  }
};

// Anwendung starten
runApp();
