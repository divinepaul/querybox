import express from 'express';
import bcrypt from 'bcrypt';
import db from '../../db.js';
import jwt from 'jsonwebtoken';
import PDFDocument from 'pdfkit-table';
import { formatDate } from '../../lib/random_functions.js';

import { authMiddleware, csrfMiddleWare } from '../../middleware.js';
const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    let query = db.select([...req.body.feilds, "status","category_id"]).from("tbl_category");
    if (req.body.searchBy.length) {
        req.body.feilds.forEach((feild, i) => {
            if (feild != "status" && feild != "category_id") {
                query.orWhereLike(feild, `%${req.body.searchBy}%`)
            }
        });
    }
    query.orderBy(req.body.sortBy);
    let users = await query;
    console.log(users);
    console.log(new Date(users[0].date_added).toDateString());
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
    doc.fontSize(14).text(`Reported Generated At: ${formatDate(new Date())}`)
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
   
    let query = db.select([...req.body.feilds, "status","category_id"]).from("tbl_category");
    if (req.body.searchBy.length) {
        req.body.feilds.forEach((feild, i) => {
            if (feild != "status" && feild != "category_id") {
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
    doc.table(tableArray,{ padding: 5, minRowHeight: 80});
    doc.pipe(res);
    doc.end();
});



router.post('/get', authMiddleware, async (req, res) => {
    let id = req.body.id;
    let data = await db.select().from("tbl_category").where('category_id', '=', id).first();
    if (data) {
        res.status(200).json(data);
    } else {
        res.status(404).json(data);
    }
});

router.post('/delete', authMiddleware, csrfMiddleWare, async (req, res) => {
    let id = req.body.id;
    let data = await db.select().from("tbl_category").where('category_id', '=', id).first();
    try {
        await db('tbl_category')
            .where('category_id', '=', id)
            .update({
                status: !data.status,
            })
        res.status(200).json({ message: "Inactive Enabled" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/add', authMiddleware, csrfMiddleWare, async (req, res) => {

    let categories = await db.select().from("tbl_category").where('category_name', '=', req.body.category_name);
    let category = categories[0];
    if (category) {
        return res.status(400).json({ errors: { category_name: "This category already exists" } });
    } else {
        try {
            await db('tbl_category').insert({
                category_name: req.body.category_name,
                category_description: req.body.category_description,
            })
            res.status(200).json({ message: "Sucessfully inserted" });
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});


router.post('/edit', authMiddleware, csrfMiddleWare, async (req, res) => {
    let id = req.body.id;
    try {
        await db.transaction(async trx => {
            await trx('tbl_category')
                .where('category_id', '=', id)
                .update({
                    category_name: req.body.category_name,
                    category_description: req.body.category_description,
                })
        })
        res.status(200).json({ message: "Sucessfully edited!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


export default router;

