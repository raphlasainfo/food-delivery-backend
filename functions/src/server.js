import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import outletRoutes from './routes/outletRoutes.js';
import menuItemRoutes from './routes/menuItemRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import wageRoutes from './routes/wageRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Import Middleware
import { errorHandler } from './middleware/errorHandler.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check routes
app.get('/', (req, res) => {
    res.json({ message: 'Food Delivery API is running successfully!' });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Food delivery backend is running' });
});

// Resource Routes
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/outlets', outletRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/wages', wageRoutes);

// Error Handling Middleware
app.use(errorHandler);

// At the bottom of src/server.js
if (process.env.NODE_ENV !== 'production' && !process.env.K_SERVICE) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

export default app;