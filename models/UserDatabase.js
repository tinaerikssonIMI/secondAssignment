const User = require('./user'); // Importera User-modellen

class UserDatabase {
    // Spara användare
    async saveUser(username, password) {
        try {
            await User.create({
                username: username,
                password: password,
            });
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Användarnamnet är redan upptaget.');
            }
            throw new Error('Ett fel inträffade när användaren sparades.');
        }
    }

    // Hitta användare baserat på användarnamn
    async findUser(username, password) {
        const user = await User.findOne({ where: { username, password} });
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