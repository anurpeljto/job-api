const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, UnauthenticatedError} = require('../errors')

class AuthControllerClass {
    register = async(req, res) => {
        const user = await User.create({...req.body});
        // const token = jwt.sign({userID: user._id, name: user.name }, process.env.JWT_SECRET, {expiresIn: '30d'});
        const token = user.createJWT();
        return res.status(StatusCodes.CREATED).json({ user: {name: user.getName()}, token });
    }

    login = async(req, res) => {
        const {email, password} = req.body;

        if(!email || !password) {
            throw new BadRequestError('Email or password missing');
        }

        const user = await User.findOne({email});
        
        if(!user) {
            throw new UnauthenticatedError('Invalid credentials');
        }
        const isMatch = await user.comparePW(password);
        
        if(!isMatch) {
            throw new UnauthenticatedError('Incorrect password!');
        }

        const token = user.createJWT();
        return res.status(StatusCodes.OK).json({ user: {name: user.name}, token });

    }
}

module.exports = AuthControllerClass;