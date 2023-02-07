import express from 'express';
import bcrypt from 'bcrypt';
import db from '../../db.js';
import { authMiddleware, csrfMiddleWare } from '../../middleware.js';
const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    let selectFeilds = {}
    req.body.feilds.forEach(feild => selectFeilds[feild] = feild);
    let query = db.select({ ...selectFeilds, "email": "tbl_login.email", "status": "status" }).from("tbl_customer").innerJoin('tbl_login', 'tbl_login.email', 'tbl_customer.email');
    if (req.body.searchBy.length) {
        req.body.feilds.forEach((feild, _) => {
            if (!["status", "customer_id"].includes(feild)) {
                if (feild == "email") {
                    query.orWhereLike("tbl_login.email", `%${req.body.searchBy}%`)
                } else {
                    query.orWhereLike(feild, `%${req.body.searchBy}%`)
                }
            }
        });
    }
    query.orderBy(req.body.sortBy);
    let data = await query;
    if (data) {
        res.status(200).json(data);
    } else {
        res.status(404).json(data);
    }
});

router.post('/get', authMiddleware, async (req, res) => {
    let id = req.body.id;
    let data = await db.select().from("tbl_customer").innerJoin('tbl_login', 'tbl_login.email', 'tbl_customer.email').where('tbl_login.email', '=', id).first();
    if (data) {
        res.status(200).json(data);
    } else {
        res.status(404).json(data);
    }
});

router.post('/delete', authMiddleware, csrfMiddleWare, async (req, res) => {
    let id = req.body.id;
    let data = await db.select().from("tbl_login").where('email', '=', id).first();
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
    console.log(req.body);
    let users = await db.select().from("tbl_login").where('email', '=', req.body.email);
    let user = users[0];
    if (user) {
        return res.status(400).json({ errors: { email: "Account with this email exists" } });
    } else if (req.body.password != req.body.confirm_password) {
        return res.status(400).json({ errors: { password: "Passwords dont Match", confirm_password: "Password dont match" } });
    } else {
        try {
            await db.transaction(async trx => {
                await trx('tbl_login').insert({
                    email: req.body.email,
                    password: (await bcrypt.hash(req.body.password, 10)),
                    type: 'customer',
                    status: true
                })
                await trx('tbl_customer').insert({
                    email: req.body.email,
                    customer_fname: req.body.customer_fname,
                    customer_lname: req.body.customer_lname,
                    customer_house_name: req.body.customer_house_name,
                    customer_street: req.body.customer_street,
                    customer_city: req.body.customer_city,
                    customer_state: req.body.customer_state,
                    customer_country: req.body.customer_country,
                    customer_pincode: req.body.customer_pincode,
                    customer_phone: req.body.customer_phone,
                })
            })
            res.status(200).json({ message: "Sucessfully inserted" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});

router.post('/edit', authMiddleware, csrfMiddleWare, async (req, res) => {
    let id = req.body.email;
    if (req.body.password != req.body.confirm_password) {
        return res.status(400).json({ errors: { password: "Passwords dont Match", confirm_password: "Password dont match" } });
    } else {
        try {
            await db.transaction(async trx => {
                await trx('tbl_customer')
                    .where('email', '=', id)
                    .update({
                        customer_fname: req.body.customer_fname,
                        customer_lname: req.body.customer_lname,
                        customer_house_name: req.body.customer_house_name,
                        customer_street: req.body.customer_street,
                        customer_city: req.body.customer_city,
                        customer_state: req.body.customer_state,
                        customer_country: req.body.customer_country,
                        customer_pincode: req.body.customer_pincode,
                        customer_phone: req.body.customer_phone,
                    })
            })
            res.status(200).json({ message: "Sucessfully edited!" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});

export default router;
