import { Router } from 'express';
import { sessionController } from '../controllers/SessionController.js';
import { gameController } from '../controllers/GameController.js';

const router = Router();

router.post('/connect-to-session', sessionController.connectToSession);
router.post('/make-session', sessionController.makeSession);
router.post('/shoot', gameController.shoot);


export default router;
