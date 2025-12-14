import express from 'express';
import {
  createNovel,
  getNovelsByUser,
  getNovelById,
  updateNovel,
  deleteNovel,
  createChapter,
  getChapterWithReviews,
  updateChapter,
  deleteChapter
} from '../controllers/novelController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Novel routes (CRUD)
router.post('/novels', createNovel);           // Create
router.get('/novels', getNovelsByUser);        // Read (list)
router.get('/novels/:id', getNovelById);       // Read (single)
router.put('/novels/:id', updateNovel);        // Update
router.delete('/novels/:id', deleteNovel);     // Delete

// Chapter routes (CRUD)
router.post('/chapters', createChapter);              // Create
router.get('/chapters/:id', getChapterWithReviews);   // Read
router.put('/chapters/:id', updateChapter);           // Update
router.delete('/chapters/:id', deleteChapter);        // Delete

export default router;
