const Job = require('../models/Job');
const user = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');

class JobsControllerClass {
    getAllJobs = async(req, res) => {
        const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt');
        return res.status(StatusCodes.OK).json({success: true, jobs: jobs});
    }

    createJob = async(req, res) => {
        req.body.createdBy = req.user.userId;
        const newJob = await Job.create(req.body);
        return res.status(StatusCodes.CREATED).json({msg: 'Successfully inserted new job', job: newJob})
    }

    getJob = async(req, res) => {
        const {user: {userId}, params: {id: jobId}} = req;

        const job = await Job.findOne({_id: jobId, createdBy: userId});

        if(!job) {
            throw new NotFoundError('No job with given ID');
        }

        return res.status(StatusCodes.OK).json({success: true, job : job});
    }

    updateJob = async(req, res) => {
        const {user: {userId}, params: {id: jobId}, body: {company, position}} = req;

        if (company === '' || position === ''){
            throw new BadRequestError('Invalid company/position value');
        }

        const updatedJob = await Job.findOneAndUpdate({_id: jobId, createdBy: userId}, req.body, {new: true, runValidators: true})

        if (!updatedJob) {
            throw new NotFoundError('No job with given ID');
        }

        return res.status(StatusCodes.ACCEPTED).json({success: true, job: updatedJob});
    }

    deleteJob = async(req, res) => {
        const {user: {userId}, params: {id: jobId}} = req;
        const removedJob = await Job.findByIdAndRemove({_id: jobId, createdBy: userId});

        if(!removedJob){
            throw new NotFoundError('Job with given ID does not exist');
        }
        return res.status(StatusCodes.ACCEPTED).json({succes: true, job: removedJob});
    }
}

module.exports = JobsControllerClass;