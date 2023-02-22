import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js';
import { authMiddleware, csrfMiddleWare, customerOnly } from '../middleware.js';
const router = express.Router();

router.get('/topics' , async (req, res) => {
    let query = db.select("*").
        from("tbl_topic")
        .innerJoin("tbl_category","tbl_topic.category_id","tbl_category.category_id")
    query.andWhere("tbl_topic.status",'=',true);
    let topics = await query;
    if (topics) {
        res.status(200).json(topics);
    } else {
        res.status(404).json(topics);
    }

});

router.get('/user-questions' , authMiddleware, customerOnly, async (req, res) => {

    let query = db.select("*","tbl_post.status").
        from("tbl_question")
        .innerJoin("tbl_post","tbl_post.post_id","tbl_question.post_id")
        .innerJoin("tbl_topic","tbl_question.topic_id","tbl_topic.topic_id")
        .innerJoin("tbl_category","tbl_topic.category_id","tbl_category.category_id")

    query.andWhere("tbl_post.status",'=','published');
    query.andWhere("tbl_post.customer_id",'=',req.user.customer_id);
    
    let questions = await query;
    if (questions) {
        res.status(200).json(questions);
    } else {
        res.status(404).json(questions);
    }

});

router.get('/draft-questions' , authMiddleware, customerOnly, async (req, res) => {

    let query = db.select("*","tbl_post.status").
        from("tbl_question")
        .innerJoin("tbl_post","tbl_post.post_id","tbl_question.post_id")
        .innerJoin("tbl_topic","tbl_question.topic_id","tbl_topic.topic_id")
        .innerJoin("tbl_category","tbl_topic.category_id","tbl_category.category_id")
    query.andWhere("tbl_post.status",'=','draft');
    query.andWhere("tbl_post.customer_id",'=',req.user.customer_id);
    
    let questions = await query;
    if (questions) {
        res.status(200).json(questions);
    } else {
        res.status(404).json(questions);
    }

});

//router.get('/comments-posted' , authMiddleware, customerOnly, async (req, res) => {
    //let query = db.select("*","tbl_post.status","tbl_question.post_id as post_id").
        //from("tbl_answer")
        //.innerJoin("tbl_question","tbl_answer.question_id","tbl_question.question_id")
        //.innerJoin("tbl_post","tbl_post.post_id","tbl_answer.post_id")
    //query.andWhere("tbl_post.status",'=','published');
    //query.andWhere("tbl_post.customer_id",'=',req.user.customer_id);

    //let answers = await query;
    //console.log(answers);
    //if (answers) {
        //res.status(200).json(answers);
    //} else {
        //res.status(404).json(answers);
    //}
//});

router.get('/answers-posted' , authMiddleware, customerOnly, async (req, res) => {
    let query = db.select("*","tbl_post.status","tbl_question.post_id as post_id").
        from("tbl_answer")
        .innerJoin("tbl_question","tbl_answer.question_id","tbl_question.question_id")
        .innerJoin("tbl_post","tbl_post.post_id","tbl_answer.post_id")
    query.andWhere("tbl_post.status",'=','published');
    query.andWhere("tbl_post.customer_id",'=',req.user.customer_id);
    
    let answers = await query;
    console.log(answers);
    if (answers) {
        res.status(200).json(answers);
    } else {
        res.status(404).json(answers);
    }

});

router.get('/viewed-questions' , authMiddleware, customerOnly, async (req, res) => {

    let query = db.select("*","tbl_post.status").
        from("tbl_history")
        .innerJoin("tbl_question","tbl_history.question_id","tbl_question.question_id")
        .innerJoin("tbl_post","tbl_post.post_id","tbl_question.post_id")
        .innerJoin("tbl_topic","tbl_question.topic_id","tbl_topic.topic_id")
        .innerJoin("tbl_category","tbl_topic.category_id","tbl_category.category_id")

    query.andWhere("tbl_post.status",'=','published');
    query.andWhere("tbl_history.customer_id",'=',req.user.customer_id);
    
    let questions = await query;
    if (questions) {
        res.status(200).json(questions);
    } else {
        res.status(404).json(questions);
    }

});

export default router;
