const express = require('express');
const router = express.Router();
const JobsControllerClass = require('../controllers/jobs');
const JobsController = new JobsControllerClass;

router.route('/').post(JobsController.createJob).get(JobsController.getAllJobs);
router.route('/:id').get(JobsController.getJob).patch(JobsController.updateJob).delete(JobsController.deleteJob);

module.exports = router;