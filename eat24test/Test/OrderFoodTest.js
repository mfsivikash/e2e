/*
Description: Page for Testing Restaurant and orders 
Author: data.user.fname
*/

"use strict;"
var register = require('../PageObject/SignUpPage.js');
var restuarant = require('../PageObject/OrderFoodPage.js');
var data = require('../data.json');
require('../TestConstant.js');

//Suite for Restaurant at Eat 24
describe('Suite for Restaurant page', function () {
    beforeEach(function () {

        //Maximizing the window
        browser.driver.manage().window().maximize();

        //Opening the website
        browser.get(data.siteURL);

        //Closes GrubHub Pop Up if it's displayed
        register.closeGrubHubPopUP();
    });

    it('Find restuarant in particular region and check if it is displayed', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount(data.user.fname, data.user.lname, email, data.user.password);
        restuarant.findfoodatlocation(data.location);
        register.signout();
    });

    it('Find restuarant in particular region and order from 4 star', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount(data.user.fname, data.user.lname, email, data.user.password);
        restuarant.findfoodatlocation(data.location);
        restuarant.filterbystarresturant(4);
        restuarant.orderfood('(324) 234-2342');
        register.signout();
    });

    it('Sorting restaurant according to distance and verifying', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount(data.user.fname, data.user.lname, email, data.user.password);
        restuarant.findfoodatlocation(data.location);
        restuarant.sortrestaurant(3);
        restuarant.checksortedbydistance();
    });
});