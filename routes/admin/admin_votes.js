import express from 'express';
import bcrypt from 'bcrypt';
import db from '../../db.js';
import jwt from 'jsonwebtoken';
import { authMiddleware, csrfMiddleWare } from '../../middleware.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    let selectFeilds = {}

    req.body.feilds.forEach(feild => selectFeilds[feild] = feild);

    let query = db.select({ ...selectFeilds})
        .from("tbl_vote")
        .innerJoin('tbl_post', 'tbl_vote.post_id', 'tbl_post.post_id')
        .innerJoin('tbl_customer', 'tbl_customer.customer_id', 'tbl_vote.customer_id')
        .innerJoin('tbl_login', 'tbl_login.email', 'tbl_customer.email')

    if (req.body.searchBy.length) {
        req.body.feilds.forEach((feild, i) => {
            if (feild != "status" && feild != "vote_id" && feild != "vote") {
                query.orWhereLike(feild, `%${req.body.searchBy}%`)
            }
        });
    }
    query.orderBy(req.body.sortBy);
    let users = await query;
    if (users) {
        res.status(200).json(users);
    } else {
        res.status(404).json(users);
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

