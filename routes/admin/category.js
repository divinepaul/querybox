import express from 'express';
import bcrypt from 'bcrypt';
import db from '../../db.js';
import jwt from 'jsonwebtoken';

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
    if (users) {
        res.status(200).json(users);
    } else {
        res.status(404).json(users);
    }
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
    console.log(data);
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

