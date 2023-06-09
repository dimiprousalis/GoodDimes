const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')

 exports.getLogin = (req, res) => {
    if (req.user) {
      return res.redirect('/transactions')
    }
    res.render('login', {
      title: 'Login'
    })
  }
  
  exports.postLogin = (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
    if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' })
  
    if (validationErrors.length) {
      req.flash('errors', validationErrors)
      return res.redirect('/login')
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err) }
      if (!user) {
        req.flash('errors', info)
        return res.redirect('/login')
      }
      req.logIn(user, (err) => {
        if (err) { return next(err) }
        req.flash('success', { msg: 'Success! You are logged in.' })
        res.redirect(req.session.returnTo || '/transactions')
      })
    })(req, res, next)
  }
  
  exports.logout = (req, res, next) => {
    req.logout((error) => {
      if (error) { return next(error) }
      res.redirect('/')
    })
  }
  
  exports.getSignup = (req, res) => {
    if (req.user) {
      return res.redirect('/transactions')
    }
    res.render('signup', {
      title: 'Create Account'
    })
  }
  
  //update to async/await
  exports.postSignup = async (req, res, next) => {
    try {
      const validationErrors = [];
      if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
      if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
      if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });
  
      if (validationErrors.length) {
        req.flash('errors', validationErrors);
        return res.redirect('../signup');
      }
  
      req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
  
      const existingUser = await User.findOne({
        $or: [
          { email: req.body.email },
          { userName: req.body.userName },
        ],
      });
  
      if (existingUser) {
        req.flash('errors', { msg: 'Account with that email address or username already exists.' });
        return res.redirect('../signup');
      }
  
      const user = new User({
        userName: req.body.userName,
        email: req.body.email,
        firstName: req.body.firstName,
        password: req.body.password,
      });
  
      await user.save();
  
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/transactions');
      });
    } catch (err) {
      return next(err);
    }
  };
  




