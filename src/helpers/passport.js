require('dotenv').config({ path: './../../.env' });
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Users = require('../models/userModel');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
    try {
        const user = Users.query().where({ id: payload.id }).first();
        if (!user) done(null, false);

        done(null, {id: user.id, role: user.role_id});
    } catch (error) {
        done(error, false);
    }
}));