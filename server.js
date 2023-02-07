import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRoutes from './routes/auth.js';
import adminUserRoutes from './routes/admin/users.js';
import adminStaffRoutes from './routes/admin/staff.js';
import adminCustomerRoutes from './routes/admin/customers.js';
import adminCategoryRoutes from './routes/admin/category.js';
import adminTopicRoutes from './routes/admin/topics.js';
import { setCSRFCookie } from './middleware.js';
import * as dotenv from 'dotenv';

dotenv.config();

let app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(cookieParser());
app.use(setCSRFCookie);

app.use('/api/auth/', authRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/staff', adminStaffRoutes);
app.use('/api/admin/customer', adminCustomerRoutes);
app.use('/api/admin/category', adminCategoryRoutes);
app.use('/api/admin/topics', adminTopicRoutes);

app.get("*", (req, res) => {
    res.sendFile(path.join(path.resolve(), './dist/index.html'));
});

app.listen(8000, async () => {
    console.log("Started server on port 8000");
});

