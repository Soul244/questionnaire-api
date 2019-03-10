const express = require('express');

const router = express.Router();
const PollController = require('../controllers/poll-controller');
const checkAuth = require('../middleware/check-auth');

router.post('/', checkAuth, PollController.Create_Poll);
router.get('/', checkAuth, PollController.Get_Polls);
router.delete('/:_id', checkAuth, PollController.Delete_Poll);
router.post('/update', checkAuth, PollController.Update_Poll);
router.get('/:slug', PollController.Get_Poll);
// router.get('/all/:page', PollController.Get_All_Polls);

module.exports = router;
