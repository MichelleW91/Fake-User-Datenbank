"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const faker = __importStar(require("@faker-js/faker"));
const fs = __importStar(require("fs"));
const readlineSync = __importStar(require("readline-sync"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const numUsersFromEnv = process.env.NUM_USERS ? parseInt(process.env.NUM_USERS) : 5;
// Funktion zum Erzeugen von Benutzerdaten
const generateUser = (id) => {
    return {
        id,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
    };
};
// Funktion zum Speichern der Benutzer in einer JSON-Datei
const saveUsersToFile = (users) => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};
// Funktion zum Laden der Benutzer aus einer JSON-Datei
const loadUsersFromFile = () => {
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
            const numUsers = parseInt(readlineSync.question('Wie viele Benutzer möchten Sie generieren? '));
            const newUsers = [];
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
            }
            else {
                console.log('Bestehende Benutzer:');
                existingUsers.forEach((user) => {
                    console.log(`${user.id}: ${user.firstName} ${user.lastName}`);
                });
            }
            break;
        case '3':
            const searchTerm = readlineSync.question('Geben Sie den Namen des Benutzers ein: ');
            const foundUsers = existingUsers.filter((user) => user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchTerm.toLowerCase()));
            if (foundUsers.length > 0) {
                console.log('Gefundene Benutzer:');
                foundUsers.forEach((user) => {
                    console.log(`${user.id}: ${user.firstName} ${user.lastName} - ${user.email}`);
                });
            }
            else {
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
