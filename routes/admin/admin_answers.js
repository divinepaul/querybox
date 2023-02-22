import bcrypt from 'bcrypt';
import express from 'express';
import db from '../../db.js';
import jwt from 'jsonwebtoken';
import { authMiddleware, csrfMiddleWare } from '../../middleware.js';
import PDFDocument from 'pdfkit-table';
import { formatDate } from '../../lib/random_functions.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    let selectFeilds = {}

    req.body.feilds.forEach(feild => selectFeilds[feild] = feild);

    let query = db.select({ ...selectFeilds, "status": "tbl_post.status", 
        "full_name": db.raw("CONCAT(tbl_customer.customer_fname, ' ', tbl_customer.customer_lname)"),
        "date_added": "tbl_post.date_added" })
        .from("tbl_answer")
        .innerJoin('tbl_post', 'tbl_post.post_id', 'tbl_answer.post_id')
        .innerJoin('tbl_question', 'tbl_question.question_id', 'tbl_answer.question_id')
        .innerJoin('tbl_customer', 'tbl_customer.customer_id', 'tbl_post.customer_id')

    if (req.body.searchBy.length) {
        req.body.feilds.forEach((feild, i) => {
            if (feild != "status" && feild != "answer_id") {
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

router.post('/print', authMiddleware, async (req, res) => {

    let doc = new PDFDocument({ margin: 30, size: 'A4' });
    doc.fontSize(25).text(`QueryBox ${req.body.title} Report`,{align: 'center'})
    doc.moveDown();
    doc.fontSize(14).text(`Reported Generated At: ${new Date().toDateString()}`)
    doc.moveDown();
    doc.moveDown();

    let headers = [];
    let feilds = [];
    req.body.tableHeaders.forEach(header => {
        if (header.selected) {
            headers.push(header.label);
            feilds.push(header.name);
        }
    });
    req.body.feilds = feilds;
   
    let selectFeilds = {}

    req.body.feilds.forEach(feild => selectFeilds[feild] = feild);

    let query = db.select({ ...selectFeilds, "status": "tbl_post.status", 
        "full_name": db.raw("CONCAT(tbl_customer.customer_fname, ' ', tbl_customer.customer_lname)"),
        "date_added": "tbl_post.date_added" })
        .from("tbl_answer")
        .innerJoin('tbl_post', 'tbl_post.post_id', 'tbl_answer.post_id')
        .innerJoin('tbl_question', 'tbl_question.question_id', 'tbl_answer.question_id')
        .innerJoin('tbl_customer', 'tbl_customer.customer_id', 'tbl_post.customer_id')

    if (req.body.searchBy.length) {
        req.body.feilds.forEach((feild, i) => {
            if (feild != "status" && feild != "answer_id") {
                query.orWhereLike(feild, `%${req.body.searchBy}%`)
            }
        });
    }
    query.orderBy(req.body.sortBy);

    let users = await query;

    users = users.map(user=>{
        return Object.values(user);
    });

    const tableArray = {
        headers: headers,
        rows: users 
    };

    doc.table(tableArray,{ padding: 10,minRowHeight: 80,});
    doc.pipe(res);

    doc.end();

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

