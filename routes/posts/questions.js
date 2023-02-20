import express from 'express';
import bcrypt from 'bcrypt';
import db from '../../db.js';
import { authMiddleware, csrfMiddleWare, customerOnly } from '../../middleware.js';
const router = express.Router();

router.get('/get/:id', async (req, res) => {
    try {
        let questions = await db.select("*","tbl_post.date_added").from("tbl_question")
            .innerJoin("tbl_post","tbl_post.post_id","tbl_question.post_id")
            .innerJoin("tbl_customer","tbl_post.customer_id","tbl_customer.customer_id")
            .innerJoin("tbl_topic","tbl_question.topic_id","tbl_topic.topic_id")
            .innerJoin("tbl_category","tbl_topic.category_id","tbl_category.category_id")
            .where('tbl_question.post_id', '=', req.params.id);
        res.status(200).json({ question: questions[0] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/history/add/:id',authMiddleware,customerOnly, async (req, res) => {
    console.log("history add");
    try {
        let view = await db.select()
            .from("tbl_history")
            .where('customer_id', '=', req.user.customer_id)
            .andWhere('question_id', '=', req.params.id).first();

        if (!view) {
            await db('tbl_history').insert({
                customer_id: req.user.customer_id,
                question_id: req.params.id
            });
        }
        res.status(200).json({ question: "Sucessfully inserted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/' , async (req, res) => {
    let query = db.select("*","tbl_post.status").from("tbl_question")
        .innerJoin("tbl_post","tbl_post.post_id","tbl_question.post_id")
        .innerJoin("tbl_topic","tbl_question.topic_id","tbl_topic.topic_id")
        .innerJoin("tbl_category","tbl_topic.category_id","tbl_category.category_id")


    if (req.body.searchBy.length) {
        req.body.feilds.forEach((feild, i) => {
            if (!["post_id","status","question_id","customer_id"].includes(feild)) {
                query.orWhereILike(feild, `%${req.body.searchBy}%`)
            }
        });
    }

    query.andWhere("tbl_post.status",'=','published');
    
    //query.orderBy(req.body.sortBy);
    
    let users = await query;
    if (users) {
        res.status(200).json(users);
    } else {
        res.status(404).json(users);
    }

    //try {
        //let questions = await db.select().from("tbl_question").where('post_id', '=', req.params.id);
        //res.status(200).json({ question: questions[0] });
    //} catch (error) {
        //console.log(error);
        //res.status(500).json({ message: "Internal Server Error" });
    //}
});



router.get('/topics', authMiddleware, async (req, res) => {
    let topics = await db.select().from("tbl_topic").where('status', '=', true);
    let selectTopics = [];
    topics.forEach(topic => {
        selectTopics.push({ value: topic.topic_id, label: topic.topic_name });

    });
    res.status(200).json({ topics: selectTopics });
});


router.post('/publish', authMiddleware, async (req, res) => {
    try {
    let id = req.body.post_id;
    await db.transaction(async trx => {
        await trx('tbl_question')
            .where('post_id', '=', id)
            .update({
                question_title: req.body.question_title,
                question_description: req.body.question_description,
                topic_id: req.body.topic_id,
            })

        await trx('tbl_post')
            .where('post_id', '=', id)
            .update({
                status: "published",
                date_modified: db.raw('CURRENT_TIMESTAMP'),
                date_added: db.raw('CURRENT_TIMESTAMP')
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


router.post('/update', authMiddleware, async (req, res) => {
    let id = req.body.post_id;
    try {
        await db.transaction(async trx => {
            await trx('tbl_question')
                .where('post_id', '=', id)
                .update({
                    question_title: req.body.question_title,
                    question_description: req.body.question_description,
                    topic_id: req.body.topic_id
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




router.get('/new', authMiddleware, async (req, res) => {

    let question = await db.select()
        .from("tbl_question")
        .innerJoin("tbl_post","tbl_post.post_id","tbl_question.post_id")
        .where('question_title', '=', 'Your Question Title')
        .andWhere('question_description', '=', `Enter the details of your question here. \n\nYou can use markdown to format your question.`)
        .andWhere('topic_id', '=', 1)
        .andWhere('customer_id', '=', req.user.customer_id)
        .andWhere('status', '=', "draft").first();

    console.log(question);

    if(question){
        return res.status(200).json({ message: "Sucessfully inserted", post_id: question.post_id });
    }

    try {
        let post_id;
        await db.transaction(async trx => {
            post_id = await trx('tbl_post').insert({
                customer_id: req.user.customer_id,
                status: "draft"
            }).returning("post_id");

            await trx('tbl_question').insert({
                post_id: post_id[0].post_id,
                topic_id: 1,
                question_title: `Your Question Title`,
                question_description: `Enter the details of your question here. \n\nYou can use markdown to format your question.`
            });
        })
        res.status(200).json({ message: "Sucessfully inserted", post_id: post_id[0].post_id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
