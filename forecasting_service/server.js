// =============================================================================
/**
 * Server for forecasting service
 */
// =============================================================================
/**
 * BASE SETUP
 * import the packages we need
 */
const express    = require('express');
const app        = express();
const port       = process.env.FORECASTING_SERVICE_PORT || 8080; // set our port
const bodyParser = require('body-parser');
const exphbs     = require('express-handlebars');
const path       = require('path');
const formidable = require('formidable');
const fs         = require('fs');
const config     = require('./config');
const exec       = require('child_process').exec;
const publicIp   = require('public-ip');
const nodemailer = require("nodemailer");
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure express to use handlebars templates
var hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname,'views','layouts'),
    partialsDir: path.join(__dirname),
    helpers: {
        toJSON: function (object) {
            return JSON.stringify(object, null,'\t');
        }


    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views/'));
app.use(express.static(path.join(__dirname, 'public')));
/**
 * ROUTES FOR OUR API
 * Create our router
 */
const router = express.Router();
/**
 * Middleware to use for all requests
 */
router.use(function(req, res, next) {
    /**
     * Logs can be printed here while accessing any routes
     */
    console.log('Accessing Forecasting Service Routes');
    next();
});
/**
 * Base route of the router : to make sure everything is working check http://localhost:8080/forecasting)
 */
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the forecasting Service!'});
});
/**
 * Route1:  run the forecasting service
 */
router.route('/executeForecasting')
    .post(function(req, res)
    {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            console.log(fields);
            var oldpath = files.filetoupload.path;
            fields.name = fields.name.replace(/\s/g, '');
            var newpath = './r_server/files_uploaded/' + fields.name + '_' + 'testData.csv';
            var pathToExecuteScript = './files_uploaded/' + fields.name + '_' + 'testData.csv';
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                var cmd = "Rscript ForecastingService.R " +
                    "--target="+pathToExecuteScript + " " +
                    "--starttime=1518524056 " +
                    "--type=SINGLE " +
                    "--client="+fields.name+" " +
                    "--predsteps="+fields.predictSteps+" " +
                    "--influx.dbhost="+config.influxdb.host+":"+config.influxdb.port+" " +
                    "--influx.dbuser="+config.influxdb.user+" " +
                    "--influx.dbpassword="+config.influxdb.password+" " +
                    "--mongo.dbhost="+config.mongodb.host+" " +
                    "--mongo.dbuser="+config.mongodb.user+" " +
                    "--mongo.dbpassword="+config.mongodb.password;
                console.log(cmd);
                exec(cmd, {cwd: './r_server'},function (error, stdout, stderr)
                {
                    var lines = stdout.toString().split('\n');
                    console.log(lines);
                    if(error) {
                        var err = error.toString().split('\n');
                        console.log(err);
                    }
                    if(stderr) {
                        var stderrr = stderr.toString().split('\n');
                        console.log(stderrr);
                    }
                });
                publicIp.v4().then(ipaddress => {
                    var link = '<a href="http://'+ipaddress+':3000/" target="_blank">';
                    var sendInfo = 'Submitted for Evaluation: <br> 1. Please use <b>'+fields.name+'</b> as default database name in Grafana. <br> 2. Please check '+link+'here </a> for graphs';
                    res.send(sendInfo);
                });

            });
        });
    });
/**
 * REGISTER OUR ROUTES
 * our router is now pointing to /forecasting
 */
app.use('/forecasting', router);

app.post('/sendMessage', function(req, res){
    var data=req.body;
    var smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "",
            pass: ""
        }});

    smtpTransport.sendMail({  //email options
        from: data.email,
        to: "v.podolskiy@tum.de", // receiver
        subject: "[ForeCasting Service]", // subject
        text: "\n##- Please type your reply above this line -## \n\nName:"+data.name+"\n\nEmail-Id: "+data.email +"\n\n _____Message from User________\n\n"+data.message // body
    }, function(error, info){  //callback
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + info.response);
        }
        smtpTransport.close();
    });

    res.send("Message Sent");
});
//displays our homepage
app.get('/', function(req, res){
    res.render('home');
});
app.listen(port);
console.log('Server started and listening on port ' + port);
