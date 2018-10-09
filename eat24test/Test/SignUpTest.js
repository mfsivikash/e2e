/*
Description: Page for Testing Registration 
Author: Vikash
*/

"use strict;"
var register = require('../PageObject/SignUpPage.js');
var data = require('../data.json');

//Suite for Registration at Eat 24
describe('Register at Eat 24', function () {
    beforeEach(function () {

        //Maximizing the window
        browser.driver.manage().window().maximize();

        //Opening the website
        browser.get(data.siteURL);

        //Closes GrubHub Pop Up if it's displayed
        register.closeGrubHubPopUP();
    });

    it('Signing up with valid details and verifying the profile name', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount(data.user.fname, data.user.lname, email, data.user.password);
        register.verifyProfileFirstName();
        register.signout();
    });

    it('Signing up with same email id twice', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount(data.user.fname, data.user.lname, email, data.user.password);
        register.verifyProfileFirstName();
        register.signout();
        register.createyouraccount(data.user.fname, data.user.lname, email, data.user.password);
        register.validateNotRegistered();
        register.signout()
    });

    it('Signing up without entering first name', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount('', data.user.lname, email, data.user.password);
        register.firstNameReqValidate();
    });

    it('Signing up without entering last name', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount(data.user.fname, '', email, data.user.password);
        register.lastNameValidate();
    });

    it('Signing up without entering email', function () {
        register.createyouraccount(data.user.fname, data.user.lname, '', data.user.password);
        register.emailValidate();
    });

    it('Signing up without entering password', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount(data.user.fname, data.user.lname, email, '');
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
        register.createyouraccount('1111', data.user.lname, email, data.user.password);
        register.firstNameCharacterValidate();
    });

    it('Signing up with entering non-allowed characters in first name', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount('@@@', data.user.lname, email, data.user.password);
        register.firstNameCharacterValidate();
    });

    it('Signing up with entering numbers in last name', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount(data.user.fname, '1111', email, data.user.password);
        register.lastNameCharacterValidate();
    });

    it('Signing up with entering non-allowed characters in last name', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount(data.user.fname, '@@@@', email, data.user.password);
        register.lastNameCharacterValidate();
    });

    it('Signing up with entering invalid id ', function () {
        register.createyouraccount(data.user.fname, data.user.lname, 34322, 'password');
        register.emailValidateInvalidId();
    });

    it('Signing up with entering password as "password" ', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount(data.user.fname, data.user.lname, email, 'password');
        register.passwordSameText();
    });

    it('Signing up with entering password less than 8 characters ', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount(data.user.fname, data.user.lname, email, 'eeerdsc');
        register.passwordLength();
    });

    it('Signing up with entering password more than 255 characters ', function () {
        var email = Math.random().toString(36).substring(7) + "@gmail.com";
        register.createyouraccount(data.user.fname, data.user.lname, email, 'dfdfdgdfgdgfddgdret34trergregregtrgtgfgfdgregergerg3gre4ggrgrgtrghtgtrhtrhtrgtrg4g4rgregdsg3rg34gregregergregregregregregeregregregregregrgregt34t34sdfsdf34tgreg3rgregregregregtrgregtrtrhtrghfdgfdgrgregregregregregregergregergregergergregergregregrerreerr4');
        register.passwordLength();
    });
});