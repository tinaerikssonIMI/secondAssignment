const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './dbfile.sqlite', // Ändra om du har annan databasväg
    logging: false, // Sätt till true för detaljerad loggning
});

sequelize.authenticate()
    .then(() => console.log('Database connected.'))
    .catch((err) => console.error('Error connecting to the database:', err));

module.exports = sequelize;