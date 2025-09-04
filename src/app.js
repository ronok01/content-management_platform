// import csurf from 'csurf';
// app.use(csurf({ cookie: true }));

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import xssClean from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from "path";
import { fileURLToPath } from "url";

import logger from './core/config/logger.js';
import errorHandler from './core/middlewares/errorMiddleware.js';
import notFound from './core/middlewares/notFound.js';
import { globalLimiter } from './lib/limit.js';
import appRouter from './core/app/appRouter.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set up security middleware
app.use(helmet());
app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
  );
app.use(xssClean());
app.use(mongoSanitize());


// Set up logging middleware
app.use(morgan('combined'));

// Set up body parsing middleware
app.use(express.json({ limit: '10000kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set up rate limiting middleware
app.use(globalLimiter);

// Set up static files middleware
const uploadPath = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(uploadPath));

// Add a welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Welcome to the CogniContent API!",
    status: "success",
    documentation: "/api-docs" // Placeholder for future documentation
  });
});

// Set up API routes
app.use('/api', appRouter);

// Set up 404 error middleware
app.use(notFound);

// Set up error handling middleware
app.use(errorHandler);

logger.info('Middleware stack initialized');

export  { app }; 


