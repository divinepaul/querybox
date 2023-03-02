import express from 'express';
import bcrypt from 'bcrypt';
import db from '../../db.js';
import { authMiddleware, csrfMiddleWare, customerOnly } from '../../middleware.js';
const router = express.Router();


router.post('/post', authMiddleware, csrfMiddleWare, customerOnly, async (req, res) => {
    let complaintsPerPost = await db.select().from("tbl_complaint").where('post_id', '=', req.body.id);
    let userComplaint = await db.select().from("tbl_complaint").where('post_id', '=', req.body.id).andWhere('customer_id', '=', req.user.customer_id).first();
    try {
        if (!userComplaint) {
            await db('tbl_complaint').insert({
                customer_id: req.user.customer_id,
                post_id: req.body.id,
                reason: req.body.reason
            });
            if (complaintsPerPost.length == 4) {
                await db('tbl_post')
                    .where('post_id', '=', req.body.id)
                    .update({
                        status: "removed"
                    })
            }
        }
        res.status(200).json({ message: "Insert Sucessfull" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
