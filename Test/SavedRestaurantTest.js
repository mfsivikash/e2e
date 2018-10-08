/*
Description: Page for Testing Registration 
Author: Vikash
*/

"use strict;"
var register = require('../PageObject/SignUpPage.js');
var saved = require('../PageObject/SavedRestaurantPage.js');
var order = require('../PageObject/OrderFoodPage.js');
var utils = require('../Protractor-Utils.js');
var data = require('../data.json');
require('../TestConstant.js');

//Suite for Saved Page at Eat24
describe('Saved Restaurant', function () {
    beforeEach(function () {

        //Maximizing the window
        browser.driver.manage().window().maximize();

        //Opening the website
        browser.get(data.siteURL);

        //Closes GrubHub Pop Up if it's displayed
        register.closeGrubHubPopUP();
    });

    it('Save a restaurant in restaurant page and verify in saved pages', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount(data.user.fname, data.user.lname, email, data.user.password);
        order.findfoodatlocation(data.location);

        //Name of the restaurant from Restaurant Page 
        var namer = order.savefirstrestaurant();

        //Name of Restaurant from Saved Page
        var names = saved.savedpageresturantname();
        expect(namer).toEqual(names);
        register.signout();
    });

    it('Save popular restaurant in home page and verify in saved pages', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount(data.user.fname, data.user.lname, email, data.user.password);
        order.findfoodatlocation(data.location);
        browser.navigate().back();

        //Name of the popular restaurant from Home Page 
        var nameh = saved.savepopularrestauranthome();

        //Name of Restaurant from Saved Page
        var names = saved.allsavedpageresturantname();
        utils.compareTwoArrays(nameh, names);
        register.signout();
    });

    it('Save closest restaurant in home page and verify in saved pages', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount(data.user.fname, data.user.lname, email, data.user.password);
        order.findfoodatlocation(data.location);
        browser.navigate().back();

        //Name of the closest restaurant from Home Page 
        var nameh = saved.savedclosestrestauranthome();

        //Name of Restaurant from Saved Page
        var names = saved.allsavedpageresturantname();
        utils.compareTwoArrays(nameh, names);
        register.signout();
    });
});