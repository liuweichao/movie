var User = require('../models/user');

// userList page
exports.list = function(req,res){
    User.fetch(function(err,users){
        if(err){
            console.log(err);
        }
        res.render('userList',{
            title:'imooc 用户页',
            users:users
        })
    })
};

//signup
exports.signup = function (req,res) {
    var _user = req.body.user;

    User.findOne({name: _user.name}, function (err, user) {
        if(err){
            console.log(err);
        }
        if(user){
            res.redirect('/signin');
        }else{
            var user = new User(_user);
            user.save(function(err,user){
                if(err){
                    console.log(err);
                }
                res.redirect('/')
            });
        }
    });

};


//	signin
exports.signin = function (req,res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({name: name}, function (err, user) {
        if(err){
            console.log(err);
        }
        if(!user){
            res.redirect('/signup');
        }else{
            user.compareParssword(password, function (err, isMath) {
                if(err){
                    console.log(err);
                }
                if(isMath){
                    req.session.user = user;
                    return res.redirect('/')
                }else{
                    res.redirect('/signin');
                }
            });
        }
    });
};


exports.logout =  function (req,res) {
    delete req.session.user;
    //delete app.locals.user;
    res.redirect('/');
};

exports.showSignin = function(req,res){
    res.render("signin",{
        title:'登录页面'
    })
};

exports.showSignup = function(req,res){
    res.render("signup",{
        title:'注册页面'
    })
};

// midware for user
exports.signinRequired = function(req,res,next){
    var user = req.session.user;
    if(!user){
        return res.redirect('/signin');
    }
    next();
};

// midware for user
exports.adminRequired = function(req,res,next){
    var user = req.session.user;
    if(user.role <= 10){
        return res.redirect('/signin');
    }
    next();
};