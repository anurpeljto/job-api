require('dotenv').config();
require('express-async-errors');

// security pkgs
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authenticate = require('./middleware/authentication');


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// route imports

const jobs = require('./routes/jobs');
const auth = require('./routes/auth');


app.set('trust proxy', 1);
app.use(rateLimiter({
  windowsMs: 15 * 60 * 1000,
  max: 100
})) ;
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());



// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use('/api/v1/auth', auth);
app.use('/api/v1/jobs', authenticate, jobs);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
