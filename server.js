const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const UserManager = require('./models/UserManager');
const {sequelize} = require('./models/user');
const { uuid } = require('uuidv4');

const app = express();
const userManager = new UserManager();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

sequelize.sync().then(() => { 
    console.log('Database synced.');
});

const userSessions = {};

async function authenticatedUser(req, res, next) { 
    const sessionID = req.headers['x-session-id'];

    console.log('SessionID:', sessionID);
    if (!sessionID || !userSessions[sessionID]) {
        return res.status(401).json({ success: false, message: 'Du är inte inloggad.' });
    }

    req.session = userSessions[sessionID];
    return next();
}

// Registrera användare
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        await userManager.register(username, password);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Fel vid registrering:', err.message);
        res.status(400).json({ success: false, message: err.message });
    }
});

app.get('/main.js', (req, res) => { 
    res.sendFile(path.join(__dirname, 'public', 'main.js'));
});

app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/loggedInPage', authenticatedUser, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'loggedInPage.html'));
});

// Logga in användare
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userManager.login(username, password);
        const userSessionId = uuid().replace(/[a-zA-Z-]/g, '');
        userSessions[userSessionId] = user;

        res.status(200).json({ success: true, sessionID: userSessionId, username: user.username });
    } catch (err) {
        console.error('Fel vid inloggning:', err.message); // Logga felet
        res.status(400).json({ success: false, message: err.message });
    }
});

// Logga ut användare
app.post('/logout', async (req, res) => {
    const sessionID = req.headers['x-session-id'];

    if (!sessionID) {
        return res.status(400).json({ success: false, message: 'Du är inte inloggad.' });
    }

    delete userSessions[sessionID];
    res.status(200).json({ success: true });
});

// Serverstart
app.listen(8080, () => {
    console.log('Servern körs på http://localhost:8080');
});