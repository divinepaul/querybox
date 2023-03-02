import express from 'express';
import bcrypt from 'bcrypt';
import db from '../../db.js';
import { authMiddleware, csrfMiddleWare, customerOnly } from '../../middleware.js';
const router = express.Router();

router.get('/get/:id', authMiddleware, customerOnly, async (req, res) => {
    console.log(req.user);
    let vote = await db.select()
        .from("tbl_vote")
        .where('customer_id', '=', req.user.customer_id)
        .andWhere('post_id', '=', req.params.id).first();
    if (vote) {
        res.status(200).json({ vote: vote.vote });
    } else {
        res.status(404).json({ message: "Not Found" });
    }
});

router.post('/upvote', authMiddleware, csrfMiddleWare, customerOnly, async (req, res) => {
    try {
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
        }
        res.status(200).json({ message: "Sucessfull" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/downvote', authMiddleware, csrfMiddleWare, customerOnly, async (req, res) => {
    try {
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
        }
        res.status(200).json({ message: "Sucessfull" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/count/:id', async (req, res) => {
    try {

        let upvotes = await db.select()
            .from("tbl_vote")
            .count({ total: 'vote' })
            .andWhere('post_id', '=', req.params.id)
            .andWhere('vote', '=', 1)
            .groupBy("post_id");

        let downvotes = await db.select()
            .from("tbl_vote")
            .count({ total: 'vote' })
            .andWhere('post_id', '=', req.params.id)
            .andWhere('vote', '=', -1)
            .groupBy("post_id");


        let upvoteCount = 0;
        let downVoteCount = 0;

        if(upvotes.length){
            upvoteCount = Number(upvotes[0].total);
        }
        if(downvotes.length){
            downVoteCount = Number(downvotes[0].total);
        }

        if(upvotes.length && downvotes.length){
            res.status(200).json({
                upvotes: upvoteCount,
                downvotes: downVoteCount,
                votes: (upvoteCount + (downVoteCount* -1))
            });
        } else {
            res.status(200).json({
                upvotes: upvoteCount,
                downvotes: downVoteCount,
                votes: (upvoteCount + (downVoteCount* -1))
            });
        }

        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

});

export default router;
