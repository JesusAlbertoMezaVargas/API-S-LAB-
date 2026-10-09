require('dotenv').config();
const app = require('./app');
const connectMongo = require('./config/mongo');

const start = async () => {
  try {
    await connectMongo();
    app.listen(process.env.PORT, () =>
      console.log(`API en http://localhost:${process.env.PORT}`));
  } catch (error) {
    console.error('Error al iniciar:', error.message);
  }
};

start();