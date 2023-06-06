import { Router } from 'express';
import { sessionController } from '../controllers/SessionController';
import { gameController } from '../controllers/GameController';

const router = Router();

router.post('/connect-to-session', sessionController.connectToSession);
router.post('/make-session', sessionController.makeSession);
router.post('/shoot', gameController.shoot);


export default router;
