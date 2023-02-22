import express from 'express';
import bcrypt from 'bcrypt';
import db from '../../db.js';
import jwt from 'jsonwebtoken';
import { authMiddleware, csrfMiddleWare } from '../../middleware.js';
const router = express.Router();
import PDFDocument from 'pdfmake';
var fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf'
  }
};
var printer = new PDFDocument(fonts);

import { formatDate } from '../../lib/random_functions.js';

router.post('/', authMiddleware, async (req, res) => {
    let query = db.select([...req.body.feilds, "status"]).from("tbl_login");
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

router.post('/print', authMiddleware, async (req, res) => {

    let headers = [];
    let feilds = [];
    req.body.tableHeaders.forEach(header => {
        if (header.selected) {
            headers.push(header.label);
            feilds.push(header.name);
        }
    });
    req.body.feilds = feilds;

    let query = db.select([...feilds, "status"]).from("tbl_login");
    if (req.body.searchBy.length) {
        feilds.forEach((feild, i) => {
            if (feild != "status") {
                query.orWhereLike(feild, `%${req.body.searchBy}%`)
            }
        });
    }

    query.orderBy(req.body.sortBy);
    let users = await query;

    users = users.map(user => {
        return Object.values(user);
    });

    const tableArray = {
        headers: headers,
        rows: users
    };



    var docDefinition = {
        content: [
            { text: `QueryBox ${req.body.title} Report`, fontSize: 25,alignment: 'center' },
            { text: `Reported Generated At: ${formatDate(new Date())}`, fontSize: 14 },
            { text: ` `, fontSize: 14 },
            { text: ` `, fontSize: 14 },
            {
                table: {
                    widths: headers.map(()=>100),
                    body: [
                        headers,
                        ...users
                    ]
                }
            }
        ]
    };

    var doc = printer.createPdfKitDocument(docDefinition, {});

    doc.pipe(res);
    doc.end();

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
