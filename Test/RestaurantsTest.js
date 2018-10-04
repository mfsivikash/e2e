/*
Description: Page for Testing Restaurant and orders 
Author: Vikash
*/

"use strict;"
var register = require('../PageObject/SignUpPage.js');
var restuarant = require('../PageObject/Restaurants.js');
require('../TestConstant.js');

//Suite for Restaurant at Eat 24
describe('Suite for Restaurant page', function () {
    beforeEach(function () {

        //Maximizing the window
        browser.driver.manage().window().maximize();

        //Opening the website
        browser.get('https://www.eat24.com/');

        //Closes GrubHub Pop Up if it's displayed
        register.closeGrubHubPopUP();
    });

    it('Find restuarant in particular region and check if it is displayed', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount('vikash', 'khandelwal', email, 'abcd1234');
        restuarant.findfoodatlocation('80 S Los Angeles St, Los Angeles, CA, 90012');
        register.signout();
    });

    it('Find restuarant in particular region and order from 4 star', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount('vikash', 'khandelwal', email, 'abcd1234');
        restuarant.findfoodatlocation('80 S Los Angeles St, Los Angeles, CA, 90012');
        restuarant.orderfoodfromfourstar();
        register.signout();
    });

});