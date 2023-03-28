import User from "../models/users.js";


const renderNewUserForm = (req, res) => {
    res.render('users/register');
};

const postNewUser = async (req, res) => {

    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (e) => {
            if (e) { next(e); }
            req.flash('success', 'Welcome to Yelcamp');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

const renderUserLogin = (req, res) => {
    res.render('users/login');
};

const submitUserLogin = async (req, res) => {
    req.flash('success', `Welcome back ${req.user.username}!`);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
};

const submitUserLogout = (req, res) => {
    req.logout(() => {
        req.flash('success', 'Good bye!');
        res.redirect('/campgrounds');
    });
};

export { renderNewUserForm, postNewUser, renderUserLogin, submitUserLogin, submitUserLogout }