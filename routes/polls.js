const express = require('express');

const router = express.Router();
const PollController = require('../controllers/poll-controller');
const checkAuth = require('../middleware/check-auth');

router.post('/', checkAuth, PollController.Create_Poll);
router.get('/', checkAuth, PollController.Get_Polls);
router.delete('/:_id', checkAuth, PollController.Delete_Poll);
router.patch('/', checkAuth, PollController.Update_Poll);
router.get('/:_id', PollController.Get_Poll);

module.exports = router;
