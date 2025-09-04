import express from 'express';
import authRoutes from '../../entities/auth/auth.routes.js';
import userRoutes from '../../entities/user/user.routes.js';
import contentRoutes from '../../entities/content/content.routes.js';
import interactionRoutes from '../../entities/interactions/interactions.routes.js';
import analyticsRoutes from '../../entities/analytics/analytics.routes.js';
import requestRoutes from '../../entities/request/request.routes.js';


const router = express.Router();


router.use('/v1/auth', authRoutes);
router.use('/v1/users', userRoutes);
router.use('/v1/content', contentRoutes);
router.use('/v1/interactions', interactionRoutes);
router.use('/v1/analytics', analyticsRoutes);
router.use('/v1/creator', requestRoutes);


export default router;
