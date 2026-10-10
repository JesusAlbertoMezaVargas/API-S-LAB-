const express = require('express');
const cors = require('cors');
const auth = require('./middlewares/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'API funcionando' }));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/institutos', auth, require('./routes/instituto.routes'));

module.exports = app;