import express from 'express';
import bcrypt from 'bcrypt';
import db from '../../db.js';
import jwt from 'jsonwebtoken';
import { authMiddleware, csrfMiddleWare } from '../../middleware.js';
const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    let query = db.select([...req.body.feilds,"status"]).from("tbl_login");
    if (req.body.searchBy.length) {
        req.body.feilds.forEach((feild, i) => {
            if (feild != "status") {
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
    let data = await db.select().from("tbl_login").where('email', '=', id).first();
    if (data) {
        res.status(200).json(data);
    } else {
        res.status(404).json(data);
    }
});

router.post('/delete', authMiddleware, csrfMiddleWare, async (req, res) => {

    let id = req.body.id;
    let data = await db.select().from("tbl_login").where('email', '=', id).first();
    console.log(data);
    try {
        await db('tbl_login')
            .where('email', '=', id)
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

    let users = await db.select().from("tbl_login").where('email', '=', req.body.email);
    let user = users[0];

    if (user) {
        return res.status(400).json({ errors: { email: "Account with this email exists" } });
    } else if (req.body.password != req.body.confirm_password) {
        return res.status(400).json({ errors: { password: "Passwords dont Match", confirm_password: "Password dont match" } });
    } else {
        try {
            await db('tbl_login').insert({
                email: req.body.email,
                password: (await bcrypt.hash(req.body.password, 10)),
                type: 'admin',
                status: true
            })
            res.status(200).json({ message: "Sucessfully inserted" });
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});


export default router;
