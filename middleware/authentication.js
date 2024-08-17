const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {UnauthenticatedError} = require('../errors')

const authenticate = async(req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication invalid');
    }

    const token = authorization.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {userId: payload.userId, name: payload.name}
        next();
    } catch (error) {
        return new UnauthenticatedError('Authentication invalid');
    }
}

module.exports = authenticate;