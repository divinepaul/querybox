import express from 'express';
import bcrypt from 'bcrypt';
import db from '../../db.js';
import { authMiddleware, csrfMiddleWare, customerOnly } from '../../middleware.js';
const router = express.Router();

router.get('/all/:id', async (req, res) => {
    let comments = await db.select("*","tbl_comment.date_added")
        .from("tbl_comment")
        .innerJoin("tbl_customer","tbl_customer.customer_id","tbl_comment.customer_id")
        .andWhere('post_id', '=', req.params.id)
        .andWhere('status', '=', true)
        .orderBy("tbl_comment.date_added");
    res.status(200).json(comments);
});

router.post('/post', authMiddleware, csrfMiddleWare, async (req, res) => {
    console.log("yes");
    try {
        await db('tbl_comment').insert({
            customer_id: req.user.customer_id,
            post_id: req.body.id,
            comment: req.body.comment
        });
        res.status(200).json({ message: "Insert Successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/edit', authMiddleware, csrfMiddleWare,customerOnly, async (req, res) => {
    try {
        await db('tbl_comment')
            .where('comment_id', '=', req.body.id)
            .where('customer_id', '=', req.user.customer_id)
            .update({
                comment: req.body.comment
            })
        res.status(200).json({ message: "Updated." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/delete', authMiddleware, csrfMiddleWare,customerOnly, async (req, res) => {
    try {
        await db('tbl_comment')
            .where('comment_id', '=', req.body.id)
            .where('customer_id', '=', req.user.customer_id)
            .update({
                status: false,
            })
        res.status(200).json({ message: "Deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/count/:id', async (req, res) => {
    try {
        let comments = await db.select()
            .from("tbl_comment")
            .count({ total: 'comment' })
            .andWhere('post_id', '=', req.params.id).groupBy("post_id");
        if(comments.length){
            res.status(200).json({ commentCount: votes[0].total });
        } else {
            res.status(200).json({ commentCount: 0 });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

});

export default router;
