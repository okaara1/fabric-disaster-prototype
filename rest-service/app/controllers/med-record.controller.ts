import { Router, Request, Response } from 'express';

const router: Router = Router();


router.get('/:recordId', (req: Request, res: Response) => {
  let { recordId } = req.params;

  res.send(`You asked for: ${recordId}!`);
});

export const RecordController: Router = router;