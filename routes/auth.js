import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db.js';
import jwt from 'jsonwebtoken';
import { authMiddleware, csrfMiddleWare } from '../middleware.js';
const router = express.Router();

router.post('/login', async (req, res) => {
    // TODO : Fix res.json() 
    //


    //let users = await sql`SELECT * FROM tbl_login WHERE email=${req.body.email} AND status=true`;
    let users = await db.select().from("tbl_login").where('email', '=', req.body.email).andWhere('status', '=', true);
    console.log(users);
    let user = users[0];
    if (!user) {
        return res.json(400, { errors: { email: "No Such Account Exists" } });
    } else if (!(await bcrypt.compare(req.body.password, user.password))) {
        return res.json(400, { errors: { password: "Wrong password" } });
    } else if (user.status == false) {
        return res.json(400, { errors: { email: "No Such Account Exists" } });
    } else {
        let token;
        if (user.type == "admin") {
            token = jwt.sign({ email: user.email, type: user.type }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '60m' });
        } else if (user.type == "staff") {
            token = jwt.sign({ email: user.email, type: user.type }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '60m' });
        } else if (user.type == "customer") {
            token = jwt.sign({ email: user.email, type: user.type }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '60m' });
        }


        res.cookie('jwttoken', token, {
            maxAge: 1000 * 60 * 60, // would expire after 60 minutes
            httpOnly: true,
            secure: true
        });

        if (user.type == "customer") {
            let customers = await db.select().from("tbl_customer").where('email', '=', user.email);
            let customer = customers[0];
            return res.status(200).json({ url: "", "message": "Login Sucessful", user: { email: user.email, type: user.type, customer_id: customer.customer_id } });
        } else {
            return res.status(200).json({ url: "", "message": "Login Sucessful", user: { email: user.email, type: user.type } });

        }

    }
});

router.post('/register', async (req, res) => {
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

            let token = jwt.sign({ email: req.body.email, type: "customer" }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '60m' });

            res.cookie('jwttoken', token, {
                maxAge: 1000 * 60 * 60, // would expire after 60 minutes
                httpOnly: true,
                secure: true
            });
            let customers = await db.select().from("tbl_customer").where('email', '=', req.body.email);
            let customer = customers[0];
            res.status(200).json({ message: "Sucessfully registered", user: { email: req.body.email, type: "customer", customer_id: customer.customer_id } });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});


router.post('/logout', authMiddleware, csrfMiddleWare, async (req, res) => {
    res.clearCookie("jwttoken");
    res.status(401).json({ message: "Logout Successful" });
});


router.get('/user', authMiddleware, async (req, res) => {
    let user = req.user;
    if (user.type == "staff") {
        res.status(200).json(user);
    } else if (user.type == "customer") {
        let customers = await db.select().from("tbl_customer").where('email', '=', user.email);
        let customer = customers[0];
        res.status(200).json({...user,customer_id: customer.customer_id});
    } else {
        res.status(200).json(user);
    }
});



router.get('/protected', authMiddleware, async (req, res) => {
    console.log("GET");
    console.log(req.user.email);
    res.json(req.user);
});



router.post('/protected', authMiddleware, csrfMiddleWare, async (req, res) => {
    console.log(req.user);
    res.json(req.user);
});

export default router;
