import express from 'express';
import path from 'path';
const router = express.Router()

// REST API Routes
router.get('/' , (req:any , res:any) => {
    res.sendFile(path.join(__dirname,"..", "public" , "index.html"))
})

export { router }