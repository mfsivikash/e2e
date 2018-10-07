/*
Description: Page for Testing Registration 
Author: Vikash
*/

"use strict;"
var register = require('../PageObject/SignUpPage.js');
var saved = require('../PageObject/SavedRestaurantPage.js');
var order = require('../PageObject/OrderFoodPage.js');
require('../TestConstant.js');

//Suite for Saved Page at Eat24
describe('Saved Restaurant', function () {
    beforeEach(function () {

        //Maximizing the window
        browser.driver.manage().window().maximize();

        //Opening the website
        browser.get('https://www.eat24.com/');

        //Closes GrubHub Pop Up if it's displayed
        register.closeGrubHubPopUP();
    });

    it('Open a restaurant page and save it', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount('vikash', 'khandelwal', email, 'abcd1234');
        order.findfoodatlocation('80 S Los Angeles St, Los Angeles, CA, 90012');

        //Name of the restaurant from Restaurant Page 
        var namer = order.savefirstrestaurant();

        //Name of Restaurant from Saved Page
        var names = saved.savedpageresturantname();
        expect(namer).toEqual(names);
        register.signout();
    });
});