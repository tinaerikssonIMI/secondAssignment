const User = require('./User'); // Importera User-modellen

class UserDatabase {
    // Spara användare
    async saveUser(username, password) {
        try {
            console.log(`Försöker spara användare: ${username}`);
            await User.create({
                username: username,
                password: password,
            });
            console.log(`Användare ${username} sparad framgångsrikt.`);
        } catch (err) {
            console.error('Fel vid sparande av användare:', err);
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Användarnamnet är redan upptaget.');
            }
            throw new Error('Ett fel inträffade när användaren sparades.');
        }
    }

    // Hitta användare baserat på användarnamn
    async findUser(username, password) {
        const user = await User.findOne({ where: { username, password } });
        return user;
    }

    // Uppdatera lösenord
    async updatePassword(username, newPassword) {
        const user = await this.findUserByUsername(username);
        if (user) {
            user.password = newPassword;
            await user.save();
        } else {
            throw new Error('Användaren hittades inte.');
        }
    }
}

module.exports = new UserDatabase(); // Exportera en instans av UserDatabase