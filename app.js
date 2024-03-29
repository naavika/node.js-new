const express = require('express');
const fs = require('fs');

const app = express();
const port = 4000;

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

// In-memory storage for usernames
const usernames = new Map();

// Route handler for GET request to render the login form
app.get('/login', (req, res) => {
    res.send(`
        <form action="/chat" method="post">
            <input type="text" id="username" name="username" placeholder="username"><br>
            <input type="submit" value="Login">
        </form>
    `);
});

// Route handler for POST request to process login and redirect to chat
app.post('/chat', (req, res) => {
    const username = req.body.username;
    if (!username) {
        res.status(404).send('Username not found');
        return;
    }
    usernames.set(req.ip, username); // Storing username based on IP address
    res.redirect(`/chat`);
});

// Route handler for GET request to render the chat form
app.get('/chat', (req, res) => {
    const username = usernames.get(req.ip);
    if (!username) {
        res.status(404).send('Username not found');
        return;
    }

    // JavaScript code to store username in local storage
    const script = `
        <script>
            // Store username in local storage
            localStorage.setItem('username', '${username}');
        </script>
    `;

    // Render the chat form along with the JavaScript code
    const chatForm = `
        <form action="/send-message" method="post">
            <label for="message">No chats exist</label><br>
            <input type="text" id="message" name="message"><br>
            <input type="hidden" name="username" value="${username}">
            <input type="submit" value="Send">
        </form>
    `;

    res.send(`${script}${chatForm}`);
});

// Route handler for POST request to "/send-message"
app.post("/send-message", (req, res) => {
    const username = req.body.username;
    const message = req.body.message;

    // Construct the message string without double quotes
    const messageString = `${username}: ${message},`;

    // Write message to file
    fs.appendFile('username.txt', messageString, (err) => {
        if (err) throw err;
        console.log('Message saved to file!');
    });

    res.send('Message sent successfully!');
});

// Route handler for GET request to read messages
app.get('/messages', (req, res) => {
    fs.readFile('username.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading messages');
            return;
        }
        const messages = JSON.parse(`{${data}}`);
        const formattedMessages = Object.entries(messages).map(([sender, message]) => `${sender}: ${message}`);
        res.send(`<h1>Messages</h1><pre>${formattedMessages.join('\n')}</pre>`);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
