import { errorHandler, notFound } from './middleware/errorMiddleware.js';

import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

//Compress data
app.use(compression());
//Application security middlewares START
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'script-src': ["'self'"],
    },
  }),
);
app.use(
  cors({
    origin: [process.env.CORS_ORIGIN],
    credentials: true,
  }),
);
//Max 20 requests a minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
app.use(limiter);
////Application security middlewares END
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.send('Server is ready'));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
