import express from 'express';
import bcrypt from 'bcrypt';
import db from '../../db.js';
import jwt from 'jsonwebtoken';
import { authMiddleware, csrfMiddleWare } from '../../middleware.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    let selectFeilds = {}

    req.body.feilds.forEach(feild => selectFeilds[feild] = feild);

    let query = db.select({ ...selectFeilds, "post_id": "tbl_post.post_id"})
        .from("tbl_complaint")
        .innerJoin('tbl_post', 'tbl_post.post_id', 'tbl_complaint.post_id')
        .innerJoin('tbl_customer', 'tbl_customer.customer_id', 'tbl_complaint.customer_id')
        .innerJoin('tbl_login', 'tbl_login.email', 'tbl_customer.email')

    if (req.body.searchBy.length) {
        req.body.feilds.forEach((feild, i) => {
            if (feild != "status" && feild != "complaint_id") {
                query.orWhereILike(feild, `%${req.body.searchBy}%`)
            }
        });
    }
    query.andWhereNot("tbl_post.status","=","removed");
    query.orderBy(req.body.sortBy);
    let users = await query;


    let complaints = await Promise.all(users.map(async (complaint)=>{
        let post_id = complaint["tbl_post.post_id"];

        let answer = await db.select().from("tbl_answer").where("post_id", '=', post_id).first();
        let question = await db.select().from("tbl_question").where("post_id", '=', post_id).first();
        if(answer){
            let answer_question = await db.select().from("tbl_question").where("question_id", '=', answer.question_id).first();
            complaint['question_id'] = answer_question.post_id;
            complaint['type'] = "Answer";
        } else {
            complaint['question_id'] = question.post_id;
            complaint['type'] = "Question";
        }
        return complaint;
    }));

    console.log(complaints);

    if (users) {
        res.status(200).json(complaints);
    } else {
        res.status(404).json(users);
    }
});

router.post('/delete', authMiddleware, async (req, res) => {
    let id = req.body.id;
    try {
        await db.transaction(async trx => {
            await trx('tbl_post')
                .where('post_id', '=', id)
                .update({
                    status: "removed" 
                })
        })
        res.status(200).json({ message: "Sucessfully deleted!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
//router.post('/get', authMiddleware, async (req, res) => {
//let id = req.body.id;
//let data = await db.select().from("tbl_topic").where('topic_id', '=', id).first();
//if (data) {
//res.status(200).json(data);
//} else {
//res.status(404).json(data);
//}
//});

//router.post('/delete', authMiddleware, csrfMiddleWare, async (req, res) => {
//let id = req.body.id;
//let data = await db.select().from("tbl_topic").where('topic_id', '=', id).first();
//console.log(data);
//try {
//await db('tbl_topic')
//.where('topic_id', '=', id)
//.update({
//status: !data.status,
//})
//res.status(200).json({ message: "Inactive Enabled" });
//} catch (err) {
//console.log(err);
//res.status(500).json({ message: "Internal Server Error" });
//}
//});

//router.post('/add', authMiddleware, csrfMiddleWare, async (req, res) => {

//let topics = await db.select().from("tbl_topic").where('topic_name', '=', req.body.topic_name);
//let topic = topics[0];
//if (topic) {
//return res.status(400).json({ errors: { topic_name: "This topic already exists" } });
//} else {
//try {
//await db('tbl_topic').insert({
//category_id: req.body.category_id,
//topic_name: req.body.topic_name,
//topic_description: req.body.topic_description
//})
//res.status(200).json({ message: "Sucessfully inserted" });
//} catch (err) {
//console.log(err);
//res.status(500).json({ message: "Internal Server Error" });
//}
//}
//});


//router.post('/edit', authMiddleware, csrfMiddleWare, async (req, res) => {
//let id = req.body.id;
//try {
//await db.transaction(async trx => {
//await trx('tbl_topic')
//.where('topic_id', '=', id)
//.update({
//topic_name: req.body.topic_name,
//topic_description: req.body.topic_description,
//category_id: req.body.category_id,
//})
//})
//res.status(200).json({ message: "Sucessfully edited!" });
//} catch (error) {
//console.log(error);
//res.status(500).json({ message: "Internal Server Error" });
//}
//});


export default router;

