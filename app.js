const express = require('express');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/contactus', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/contactus.html'));
});


app.post('/contactus', (req, res) => {
  
  console.log(req.body); 
  res.redirect('/success');
});


app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/success.html'));
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
