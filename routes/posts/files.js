import express from 'express';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import db from '../../db.js';
import { authMiddleware, csrfMiddleWare } from '../../middleware.js';
const router = express.Router();

router.post('/upload/:postid', authMiddleware, async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const file = req.files.file;

        let file_records = await db('tbl_files').insert({
            file_name: file.name,
            post_id: req.params.postid,
        }).returning("file_id");


        let file_id = file_records[0].file_id;

        fs.writeFileSync(`./files/${file_id}`,file.data);

        res.status(200).json({ message: "Sucessfully inserted", file_id: file_id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/delete/', authMiddleware, async (req, res) => {

    // TODO check if its the right customer
    
    let id = req.body.id;
    try {
        await db('tbl_files')
            .where('file_id', '=', id)
            .update({
                status: false,
            })
        res.status(200).json({ message: "Deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/get-info-per-post/:id', async (req, res) => {
    try {
        let files = await db.select().from("tbl_files").where('post_id', '=', req.params.id).andWhere('status','=',true);
        res.status(200).json(files);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/get-info/:id', async (req, res) => {
    try {
        let files = await db.select().from("tbl_files").where('file_id', '=', req.params.id).andWhere('status','=',true);
        res.status(200).json({ file: files[0] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/download/:id', async(req,res) => {
    let file = await db.select().from("tbl_files").where('file_id', '=', req.params.id).andWhere('status','=',true).first();
    console.log(file);
    //res.setHeader('Content-Transfer-Encoding', 'binary');
    //res.setHeader('Content-Type', 'application/octet-stream');
    res.download(path.join(path.resolve(),`./files/${file.file_id}`),file.file_name);
});


export default router;
