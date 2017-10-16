var express = require("express");
var router = express.Router();
var db = require("../models");
var path = require("path");
var GoogleAuth = require('google-auth-library');
var sequelize = require("sequelize");

router.get("/", function(req, res) {
    // db.User.find()
    res.render("index");
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login/verify", function(req, res) {
    var CLIENT_ID = '482330377038-kppprl611bgmbattktqroa9rl663dh2f.apps.googleusercontent.com';
    var token = req.body.idtoken;
    var auth = new GoogleAuth;
    var client = new auth.OAuth2(CLIENT_ID, '', '');
    client.verifyIdToken(
        token,
        CLIENT_ID,
        function(e, login) {
            if (e) {
                console.error(e);

                res.json({
                    error: e.message
                });
                return;
            }
            var payload = login.getPayload();
            var userid = payload['sub'];
            payload.valid = true;

            db.User.find({
                where: {
                    googleId: payload.email
                }
            }).then(function(dbUser) {
                if (dbUser === null) {
                    res.json(false);
                } else {
                    res.json(payload);
                    // check here for if unexpected error with db 
                }
            });
        });
});

router.get("/newUser", function(req, res) {
    res.render("new");
});

router.post("/addUser", function(req, res) {
    db.User.create({
        name: req.body.name,
        googleId: req.body.googleId
    }).then(function(data) {
        db.Transactions.create({
            Amount: req.body.amount,
            Sign: true,
            Balance: req.body.amount,
            Category: "Other",
            Description: "Initial Balance",
            UserId: data.dataValues.id
        });
    });
    res.json(true);
});

router.post("/userInfo", function(req, res) {

    db.User.find({
            where: {
                googleId: req.body.email
            }
        })
        .then(function(data) {

            db.Transactions.findAll({
                order: [["createdAt", "DESC"]],
                attributes: ["Amount", "Balance", "createdAt"],
                where: {
                    UserId: data.dataValues.id
                },
                limit: 10
            }).then(function(transData) {
                var userData = [];
                for (i in transData) {
                    userData.push(transData[i].dataValues)
                }
                console.log(userData);
                res.json(userData);
            });
        });
});



router.post("/spending", function(req, res) {
    db.User.findOne({
            where: {
                googleId: req.body.email
            }
        })
        .then(function(dbReturn) {
            db.Transactions.findAll({
                    order: [
                        ["createdAt", "DESC"]
                    ],
                    where: {
                        UserId: dbReturn.dataValues.id
                    },
                    limit: 10
                })
                .then(function(nest) {
                    var allTrans = [];
                    for (i in nest) {
                        allTrans.push(nest[i].dataValues)
                    }
                    res.json(allTrans);
                });
        });
});

router.post("/api/transactions", function(req, res) {

    db.User.findOne({
            where: {
                googleId: req.body.googleId
            }
        })
        .then(function(dbUser) {
            db.Transactions.findOne({
                    order: [
                        ["createdAt", "DESC"]
                    ],
                    where: {
                        UserId: dbUser.dataValues.id
                    }
                })
                .then(function(order) {
                    if (req.body.Balance == "true") {
                        var balance = parseFloat(req.body.Amount) + parseFloat(order.dataValues.Balance);
                        var sign = true;
                    } else if (req.body.Balance == "false") {
                        var balance = parseFloat(order.dataValues.Balance) - parseFloat(req.body.Amount);
                        var sign = false;
                    }
                    console.log(order);
                    db.Transactions.upsert({
                            Amount: parseFloat(req.body.Amount),
                            Sign: sign,
                            Balance: parseFloat(balance),
                            Category: req.body.Category,
                            Description: req.body.Description,
                            UserId: order.dataValues.UserId
                        })
                        .then(function(dbTrans) {

                            db.User.findOne({
                                    where: {
                                        googleId: req.body.googleId
                                    }
                                })
                                .then(function(dbReturn) {
                                    db.Transactions.findAll({
                                            order: [
                                                ["createdAt", "DESC"]
                                            ],
                                            where: {
                                                UserId: dbReturn.dataValues.id
                                            },
                                            limit: 10
                                        })
                                        .then(function(nest) {
                                            var allTrans = [];
                                            for (i in nest) {
                                                allTrans.push(nest[i].dataValues)
                                            }
                                            console.log("Transactions", allTrans);
                                            res.json(allTrans);
                                        });
                                });
                        });
                });
        });
});

router.get("/api/user", function(req, res) {
    db.User.findAll({
        include: [db.Transactions]
    }).then(function(dbUser) {
        res.json(dbUser);
    });
});

router.post("/api/create", function(req, res) {
    db.User.create({
            googleId: req.body.googleId,
            name: req.body.name
        })
        .then(function(dbUser) {
            res.json(dbUser);
        });
});

module.exports = router;