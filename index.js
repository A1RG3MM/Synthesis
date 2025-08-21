const express = require('express');
const dotenv = require('dotenv');
const path = require('path')
dotenv.config();

const app = express();
const port = parseInt(process.env.PORT) || 3000;
const views = path.join(__dirname, 'views');

app.use(express.static('public'))

app.use('/', (req, res) => {
    res.sendFile(views + '\\index.html');
})

app.listen(port, () => {
    console.log(`Synthesis is running on port ${port}!\n- http://localhost:${port}`)
})

// yo ill do this later
// i forgot most of ts