import express from 'express';
import multer from 'multer';
import { getJobs, createJob, deleteJob, submitApp, getApps } from '../controllers/career.controller';

const router = express.Router();
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.get('/jobs', getJobs);
router.post('/jobs', createJob);
router.delete('/jobs/:id', deleteJob);
router.post('/submit', upload.single('resume'), submitApp);
router.get('/admin/apps', getApps);

export default router;