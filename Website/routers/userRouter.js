var express = require('express')
var router = express.Router()
var accountModel = require('../models/accountModel')
const resetPassModel = require('../models/resetPassModel')
var emailVerification = require('../verification-email')
var passwordChange = require('../password-change.js')   //Tad's
const bcrypt = require('bcryptjs')
const passport = require('passport') //Compares passwords
const flash = require('express-flash') //Displays messages if failed login used inside of passport
const session = require('express-session') //So we can store and access users over multiple sessions
const methodOverride = require('method-override')

router.use(methodOverride('_method'))


//Open dashboard if you are currently logged in 
router.get('/dashboard', checkAuthenticated, (req, res) => {
    // first get graph data and device info
    let name = req.user.email
    data = 5     // put dataModel query here
    if(data != null) {
        let chartData = {        
            // The type of chart we want to create
            type: 'line',
    
            // The data for our dataset
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'DEVICE / PLANT ID GOES HERE',
                    backgroundColor: '#00ADB4',
                    borderColor: '#00ADB4',
                    pointBackgroundColor: '#77C425',
                    pointBorderColor: '#77C425',
                    data: [0, 10, 5, 2, 20, 30, 45]
                }]
            },
            // Configuration options go here
            options: {}
        }
        // push timestamps labels and moisture data into data
        res.render('../views/dashboard.ejs', { chartData, name })
    } else {
        res.render('../views/dashboard.ejs', { name })
    }    
})

//Open plants if you are currently logged in 
router.get('/plants', checkAuthenticated, nocache, (req, res) => {
    res.render('../views/plants.ejs', {name: req.user.email})
})

//Open devices if you are currently logged in
router.get('/devices', checkAuthenticated, nocache, (req, res) => {
    res.render('../views/devices.ejs', {name: req.user.email})
})

//Open account if you are currently logged in
router.get('/account', checkAuthenticated, nocache, (req, res) => {
    res.render('../views/account.ejs', {name: req.user.email})
})

//Logout
router.delete('/logout', (req, res) => {
    req.logOut() //Passport fuction to terminate session
    res.redirect('/login') //Sends back to login screen
})

//This will stop you from entering our dashbaord if you are not registered/signed in
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next() //Allows you to proceed 
    }

    res.redirect('/login') //Sends back to login
}

//Wont send you back to login page if your already logedin
function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/dashboard') //Sends you to dashboard
    }
    next() //Sends to login
}

//Disables cache
function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  }

module.exports = router