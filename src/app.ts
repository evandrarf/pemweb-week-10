import express from 'express';
import { requestLogger } from './middleware/request-logger';
import helloRouter from './routes/hello.routes';
import productRouter from './routes/product.routes';

const app = express();

// Middleware
app.use(express.json());
app.use(requestLogger);

// Routing
app.use('/hello', helloRouter);
app.use('/products', productRouter);

export default app;
