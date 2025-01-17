const forceDatabaseRefresh = false;

import session from 'express-session';
import dotenv from 'dotenv';
import SequelizeStore from 'connect-session-sequelize';
import express from 'express';
import routes from './routes/index.js';
import { sequelize } from './models/index.js';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;
const SequelizeSessionStore = SequelizeStore(session.Store);
const sess = {
  secret: process.env.SESSION_SECRET || 'secret',
  cookie: {
    maxAge: 300000, // alternative is using the expiration but docs prefer maxAge
    httpOnly: true, //not accessible to js e.g. document.cookie should not reveal it.
    secure: false, // should be true, meaning it won't be sent on http requests, only https.
    sameSite: 'strict' as const, //protects against CSRF attacks
  },
  resave: false,
  saveUninitialized: true,
  rolling: true, //resets the maxAge on every request
  store: new SequelizeSessionStore({
    db: sequelize,
  }),
};

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);
app.options('*', cors()); //preflight
app.use(routes);

sequelize.sync({ force: forceDatabaseRefresh }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
