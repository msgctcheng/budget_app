var express = require("express");
var router = express.Router();
var db = require("../models");
var path = require("path");
var GoogleAuth = require('google-auth-library');

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
            console.log('email', payload.email);

            db.User.find({
                where: {
                    googleId : payload.email
                }
            }).then(function(dbUser) {
                if (dbUser === null) {
                    res.json(false);
                } else {
                    res.json(payload);
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
            Balance: req.body.amount,
            Category: "Other",
            Description: "Initial Balance",
            UserId: data.dataValues.id
        });
    });
    res.json(true);
});

router.get("/data.csv", function(req, res) {
    res.sendFile(path.join(__dirname, "data.csv"));
});

router.get("/api/transactions", function(req, res) {
    db.Transactions.findAll({})
        .then(function(dbTrans) {
            res.json(dbTrans);
        });
});

router.post("/api/transactions", function(req, res) {
    db.Transactions.create({
            Balance: req.body.Balance,
            Amount: req.body.Amount,
            Description: req.body.Description,
            Category: req.body.Category,
            UserId: req.body.UserId
        })
        .then(function(dbTrans) {
            res.json(dbTrans);
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