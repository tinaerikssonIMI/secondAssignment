const UserDatabase = require('./UserDatabase'); // Importera UserDatabase

class UserManager {
    constructor() {
        this.loggedInUser = null; // Håller reda på den inloggade användaren
    }

    // Registrera en ny användare
    async register(username, password) {
        const userExists = await UserDatabase.findUser(username, password);
        if (userExists) {
            throw new Error('Användarnamnet är redan upptaget.');
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            throw new Error("Lösenordet måste innehålla minst 8 tecken,\nvarav minst en stor bokstav, en siffra och ett specialtecken.");
        }

        return await UserDatabase.saveUser(username, password);
    }

    // Logga in användare
    async login(username, password) {
        const user = await UserDatabase.findUser(username, password);
        if (!user) {
            throw new Error('Användaren finns inte.');
        }
        
        if (user.password !== password) {
            throw new Error('Fel lösenord.');
        }

        this.loggedInUser = user; // Logga in användaren
        return user;
    }

    // Uppdatera lösenord
    async updatePassword(username, newPassword) {
        return await UserDatabase.updatePassword(username, newPassword);
    }

    // Logga ut användare
    logout() {
        this.loggedInUser = null;
    }
}

module.exports = UserManager;