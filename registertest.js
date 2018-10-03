/*
Description: Page for Testing Registration 
Author: Vikash
*/
"use strict;"
//Importing Register Repo page
var register = require('../e2etests/registerrepo.js');
//Importing Test Constant
require('../e2etests/TestConstant.js');
//Creating random email
var email = Math.random().toString(36).substring(7) + "@gmail.com";

//Suite for Registration at Eat 24
describe('Register at Eat 24', function () {
    beforeEach(function () {
        //Maximizing the window
        browser.driver.manage().window().maximize();

        //Opening the website
        browser.get('https://www.eat24.com/');

        //Closes GrubHub Pop Up if it's displayed
        register.closeGrubHubPopUP();
    });

    it('Signing up with valid details and verifying the profile name', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount('vikash', 'khandelwal', email, 'abcd1234');
        register.verifyProfileFirstName();
        register.signout();
    });

    it('Signing up with same email id twice', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount('vikash', 'khandelwal', email, 'abcd1234');
        register.verifyProfileFirstName();
        register.signout();
        register.createyouraccount('vikash', 'khandelwal', email, 'abcd1234');
        register.validateNotRegistered();
        register.signout()
    });

    it('Signing up without entering first name', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount('', 'khandelwal', email, 'abcd1234');
        register.firstNameReqValidate();
    });

    it('Signing up without entering last name', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount('vikash', '', email, 'abcd1234');
        register.lastNameValidate();
    });

    it('Signing up without entering email', function () {
        register.createyouraccount('vikash', 'khandelwal', '', 'abcd1234');
        register.emailValidate();
    });

    it('Signing up without entering password', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount('vikash', 'khandelwal', email, '');
        register.passwordValidate();
    });

    it('Signing up without entering anything', function () {
        register.createyouraccount('', '', '', '');
        register.firstNameReqValidate();
        register.lastNameValidate();
        register.emailValidate();
        register.passwordValidate();
    });

    it('Signing up with entering numbers in first name', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount('1111', 'khandelwal', email, 'abcd1234');
        register.firstNameCharacterValidate();
    });

    it('Signing up with entering non-allowed characters in first name', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount('@@@', 'khandelwal', email, 'abcd1234');
        register.firstNameCharacterValidate();
    });

    it('Signing up with entering numbers in last name', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount('vikash', '1111', email, 'abcd1234');
        register.lastNameCharacterValidate();
    });

    it('Signing up with entering non-allowed characters in last name', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount('vikash', '@@@@', email, 'abcd1234');
        register.lastNameCharacterValidate();
    });

    it('Signing up with entering invalid id ', function () {
        register.createyouraccount('vikash', 'khandelwal', 34322, 'password');
        register.emailValidateInvalidId();
    });

    it('Signing up with entering password as "password" ', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount('vikash', 'khandelwal', email, 'password');
        register.passwordSameText();
    });

    it('Signing up with entering password less than 8 characters ', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount('vikash', 'khandelwal', email, 'eeerdsc');
        register.passwordLength();
    });

    it('Signing up with entering password more than 255 characters ', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount('vikash', 'khandelwal', email, 'dfdfdgdfgdgfddgdret34trergregregtrgtgfgfdgregergerg3gre4ggrgrgtrghtgtrhtrhtrgtrg4g4rgregdsg3rg34gregregergregregregregregeregregregregregrgregt34t34sdfsdf34tgreg3rgregregregregtrgregtrtrhtrghfdgfdgrgregregregregregregergregergregergergregergregregrerreerr4');
        register.passwordLength();
    });
});