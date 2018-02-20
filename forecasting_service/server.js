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
        },


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
    .get(function(req, res)
    {
        const exec = require('child_process').exec;
        exec("Rscript ForecastingService.R --target=test1.csv --starttime=1518524056 --type=BATCH", {cwd: './r_server'},function (error, stdout, stderr)
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
        res.json( "Running: You can check the visualization");
    });

router.route('/execute')
    .get(function(req, res)
    {
        const exec = require('child_process').exec;

        var cmd  = "Rscript ForecastingService.R --target=test1.csv --starttime=1518524056 --type=SINGLE --client=client1 --predsteps=10 --influx.dbhost=influxdb:8086 --influx.dbuser=root --influx.dbpassword=root --mongo.dbhost=mongodb --mongo.dbuser=user --mongo.dbpassword=pass";

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
        res.json( "Running: You can check the visualization");
    });
/**
 * Route2:  anything else
 */
router.route('/other')
    .get(function(req, res)
    {
            res.send('Success');
    });
/**
 * REGISTER OUR ROUTES
 * our router is now pointing to /forecasting
 */
app.use('/forecasting', router);
//displays our homepage
app.get('/', function(req, res){
    res.render('home');
});
/**
 * Start the server
 * our router is now pointing to /exercises
 */
app.listen(port);
console.log('Server started and listening on port ' + port);
