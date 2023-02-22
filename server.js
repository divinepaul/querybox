import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import process from 'process';
import authRoutes from './routes/auth.js';
import adminUserRoutes from './routes/admin/users.js';
import adminStaffRoutes from './routes/admin/staff.js';
import adminCustomerRoutes from './routes/admin/customers.js';
import adminCategoryRoutes from './routes/admin/category.js';
import adminTopicRoutes from './routes/admin/topics.js';
import adminQuestionRoutes from './routes/admin/admin_questions.js';
import adminAnswerRoutes from './routes/admin/admin_answers.js';
import adminFileRoutes from './routes/admin/admin_files.js';
import adminVoteRoutes from './routes/admin/admin_votes.js';
import adminCommentRoutes from './routes/admin/admin_comments.js';
import adminHistoryRoutes from './routes/admin/admin_history.js';
import adminComplaintsRoutes from './routes/admin/admin_complaints.js';



import fileUpload from 'express-fileupload';
import userQuestionRoutes from './routes/posts/questions.js';
import userFileRoutes from './routes/posts/files.js';
import userVoteRoutes from './routes/posts/votes.js';
import userCommentRoutes from './routes/posts/comments.js';
import userAnswersRoutes from './routes/posts/answers.js';
import userComplaintsRoutes from './routes/posts/complaints.js';
import userProfileRoutes from './routes/profile.js';
import { setCSRFCookie } from './middleware.js';
import * as dotenv from 'dotenv';

dotenv.config();

let app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(setCSRFCookie);

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

try {
    app.use('/api/auth/', authRoutes);
    app.use('/api/admin/users', adminUserRoutes);
    app.use('/api/admin/staff', adminStaffRoutes);
    app.use('/api/admin/customer', adminCustomerRoutes);
    app.use('/api/admin/category', adminCategoryRoutes);
    app.use('/api/admin/topics', adminTopicRoutes);
    app.use('/api/admin/questions', adminQuestionRoutes);
    app.use('/api/admin/answers', adminAnswerRoutes);
    app.use('/api/admin/files', adminFileRoutes);
    app.use('/api/admin/votes', adminVoteRoutes);
    app.use('/api/admin/comments', adminCommentRoutes);
    app.use('/api/admin/history', adminHistoryRoutes);
    app.use('/api/admin/history', adminHistoryRoutes);
    app.use('/api/admin/complaints', adminComplaintsRoutes);

    app.use('/api/questions/', userQuestionRoutes);
    app.use('/api/files/', userFileRoutes);
    app.use('/api/votes/', userVoteRoutes);
    app.use('/api/comments/', userCommentRoutes);
    app.use('/api/answers/', userAnswersRoutes);
    app.use('/api/complaints/', userComplaintsRoutes);
    app.use('/api/profile/', userProfileRoutes);

    app.get("*", (req, res) => {
        res.sendFile(path.join(path.resolve(), './dist/index.html'));
    });

    app.listen(8000, async () => {
        console.log("Started server on port 8000");
    });

} catch (error) {
    console.log(error);

}

