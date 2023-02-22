import express from 'express';
import bcrypt from 'bcrypt';
import db from '../../db.js';
import { authMiddleware, csrfMiddleWare, customerOnly } from '../../middleware.js';
const router = express.Router();

router.get('/get/:id' , async (req, res) => {
    console.log(req.params.id);
    try {
        let answer = await db.select("*","tbl_question.post_id as question_post_id","tbl_post.date_added as date_added").from("tbl_answer")
            .innerJoin("tbl_question", "tbl_answer.question_id", "tbl_question.question_id")
            .innerJoin("tbl_post", "tbl_post.post_id", "tbl_answer.post_id")
            .innerJoin("tbl_customer","tbl_post.customer_id","tbl_customer.customer_id")
            .where('tbl_post.post_id', '=', req.params.id).first();

        res.status(200).json(answer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/get-per-question/:id', async (req, res) => {
    try {
        let answers = await db.select("*")
            .from("tbl_answer")
            .innerJoin("tbl_post", "tbl_post.post_id", "tbl_answer.post_id")
            .where('question_id', '=', req.params.id)
            .andWhere('status', '=', 'published')
        ;

            //.sum({votes: "tbl_vote.vote"})
            //.innerJoin("tbl_post", "tbl_post.post_id", "tbl_answer.post_id")
            //.innerJoin("tbl_vote", "tbl_vote.post_id", "tbl_post.post_id")
            //.groupBy('tbl_answer.answer_id')
            //.groupBy('tbl_vote.vote_id')
            //.groupBy('tbl_post.post_id')
            //.orderBy("votes","desc")
        
        res.status(200).json(answers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.post('/publish', authMiddleware, customerOnly, async (req, res) => {
    try {
        let id = req.body.post_id;
        await db.transaction(async trx => {
            await trx('tbl_answer')
                .where('post_id', '=', id)
                .update({
                    answer_content: req.body.answer_content,
                })
            await trx('tbl_post')
                .where('post_id', '=', id)
                .update({
                    status: "published",
                    date_modified: db.raw('CURRENT_TIMESTAMP'),
                    date_added: db.raw('CURRENT_TIMESTAMP')
                })
            await trx('tbl_vote').insert({
                customer_id: req.user.customer_id,
                post_id: id,
                vote: 1 
            });
        })
        res.status(200).json({ message: "Sucessfully published!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/delete', authMiddleware, async (req, res) => {
    let id = req.body.id;
    try {
        await db.transaction(async trx => {
            await trx('tbl_post')
                .where('post_id', '=', id)
                .update({
                    status: "deleted" 
                })
        })
        res.status(200).json({ message: "Sucessfully deleted!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/update', authMiddleware, async (req, res) => {
    console.log("UPDATE");
    let id = req.body.post_id;
    try {
        await db.transaction(async trx => {
            await trx('tbl_answer')
                .where('post_id', '=', id)
                .update({
                    answer_content: req.body.answer_content,
                })

            await trx('tbl_post')
                .where('post_id', '=', id)
                .update({
                    date_modified: db.raw('CURRENT_TIMESTAMP')
                })
        })
        res.status(200).json({ message: "Sucessfully edited!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




router.post('/new', authMiddleware, csrfMiddleWare,customerOnly, async (req, res) => {
    let answer = await db.select()
        .from("tbl_answer")
        .innerJoin("tbl_post", "tbl_post.post_id", "tbl_answer.post_id")
        .where('answer_content', '=', 'Enter your answer here. \n\nYou can use markdown to format your question.')
        .andWhere('customer_id', '=', req.user.customer_id)
        .andWhere('question_id', '=', req.body.question_id)
        .andWhere('status', '=', "draft").first();
    console.log(answer);
    if (answer) {
        return res.status(200).json({ message: "Sucessfully inserted", post_id: answer.post_id });
    }
    try {
        let post_id;
        await db.transaction(async trx => {
            post_id = await trx('tbl_post').insert({
                customer_id: req.user.customer_id,
                status: "draft"
            }).returning("post_id");

            await trx('tbl_answer').insert({
                post_id: post_id[0].post_id,
                question_id: req.body.question_id,
                answer_content: 'Enter your answer here. \n\nYou can use markdown to format your question.'
            });
        })
        res.status(200).json({ message: "Sucessfully inserted", post_id: post_id[0].post_id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
