
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require("body-parser");
var express = require('express');
var cors = require('cors');
var app = express();
const nodemailer = require('nodemailer');
var url = 'mongodb://dev:dev@ds161410.mlab.com:61410/hackathon';
//var url = 'mongodb://DevSarda:DevSarda@ds135800.mlab.com:35800/demodatabase';
var z;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/push', function (req, res) {
    console.log(JSON.stringify(req.body));
    const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'umkchackathonfall2017@gmail.com',
            pass: 'Fall@2017',
        },
    });
    const mailOptions = {
        from: 'umkchackathonfall2017@gmail.com',
        to: req.body.email,
        subject: 'UMKC Hackathon Fall 2017 - Submission Confirmation',
        html: 'Thank you. Your submission has been received, please hold tight while we evaluate your submission and get back to you.',
    };
    transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.end();
        }
        console.log('Message sent: ${info.response}');
        res.end();
    });
});
app.post('/reserve', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        console.log(JSON.stringify(req.body));
        insertDocument(db, req.body, function() {
            res.write("Successfully inserted");
            res.end();
        });
    });
});
var insertDocument = function(db, data, callback) {
    db.collection('umkchackathon').insertOne( data, function(err, result) {
        if(err)
        {
            res.write("Registration Failed, Error While Registering");
            res.end();
        }
        console.log("Inserted a document into the hackathon collection.");
        console.log(result);
        callback();
    });
};
app.get('/signin', function (req, res,next) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        z = req.query.email;
        db.collection('lab10', function (err, collection) {
            collection.findOne({'email': z}, function (err, item) {
                if (err) {
                    res.write("failed to validate");
                    res.end();
                }
                if (item != null) {
                    res.send(item);
                    res.end();
                }

            });
        });

    });
});

app.get('/userDetails',function (req,res,next) {
    MongoClient.connect(url,function (err,db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        db.collection('umkchackathon',function (err,collection) {
            collection.find().toArray(function (err,item) {
                if(err)
                {
                    res.write("failed to fetch");
                    res.end();
                }
                if(item!=null)
                {
                    res.send(item);
                    res.end();
                }

            })
        })
    })
});
app.put('/update', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        db.collection('lab10').update({'email':z},{$set:{'email':req.body.email,'fname':req.body.fname,'lname':req.body.lname}}, function (err, result) {
            if(err)
            {
                res.write("failed to update");
                res.end();
            }
            if(result!=null)
            {
                z=req.body.email;
                res.send("successfully updated");
                res.end();
            }
            console.log(result);
        })
    })
});
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});