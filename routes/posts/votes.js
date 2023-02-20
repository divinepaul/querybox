import express from 'express';
import bcrypt from 'bcrypt';
import db from '../../db.js';
import { authMiddleware, csrfMiddleWare, customerOnly } from '../../middleware.js';
const router = express.Router();

router.get('/get/:id', authMiddleware,customerOnly, async (req, res) => {
    console.log(req.user);
    let vote = await db.select()
        .from("tbl_vote")
        .where('customer_id', '=', req.user.customer_id)
        .andWhere('post_id', '=', req.params.id).first();
    if(vote){
        res.status(200).json({ vote: vote.vote });
    } else {
        res.status(404).json({ message: "Not Found" });
    }
});

router.post('/upvote', authMiddleware, csrfMiddleWare,customerOnly, async (req, res) => {
    try {
        console.log(req.user);
        let voteIncrement = 1;
        let vote = await db.select()
            .from("tbl_vote")
            .where('customer_id', '=', req.user.customer_id)
            .andWhere('post_id', '=', req.body.post_id).first();
        if (!vote) {
            await db('tbl_vote').insert({
                customer_id: req.user.customer_id,
                post_id: req.body.post_id,
                vote: 1
            });
        } else {
            await db('tbl_vote')
                .where('post_id', '=', req.body.post_id)
                .andWhere('customer_id', '=', req.user.customer_id)
                .update({
                    vote: vote.vote == 1 ? 0 : 1
                })
            voteIncrement = vote.vote == 1 ? -1 : 1;
        }
        res.status(200).json({ increment: voteIncrement });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/downvote', authMiddleware, csrfMiddleWare,customerOnly, async (req, res) => {
    try {
        console.log(req.user);
        let voteIncrement = -1;
        let vote = await db.select()
            .from("tbl_vote")
            .where('customer_id', '=', req.user.customer_id)
            .andWhere('post_id', '=', req.body.post_id).first();
        if (!vote) {
            await db('tbl_vote').insert({
                customer_id: req.user.customer_id,
                post_id: req.body.post_id,
                vote: -1
            });
        } else {
            await db('tbl_vote')
                .where('post_id', '=', req.body.post_id)
                .andWhere('customer_id', '=', req.user.customer_id)
                .update({
                    vote: vote.vote == -1 ? 0 : -1
                })
            voteIncrement = vote.vote == -1 ? 1 : -1;
        }
        res.status(200).json({ increment: voteIncrement });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/count/:id', async (req, res) => {
    try {
        let votes = await db.select()
            .from("tbl_vote")
            .sum({ total: 'vote' })
            .andWhere('post_id', '=', req.params.id).groupBy("post_id");

        if(votes.length){
            res.status(200).json({ votes: votes[0].total });
        } else {
            res.status(200).json({ votes: 0 });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

});

export default router;
