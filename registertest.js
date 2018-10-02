"use strict;"
var register = require('../e2etests/registerrepo.js');
describe('Register at Eat 24', function () {
    beforeAll(function () {
        browser.driver.manage().window().maximize();
        browser.get('https://www.eat24.com/');
        

    });
    it('Sign up ', function () {
        register.createyouraccount('vikash', 'khandelwal', 'vikash1121234@gmail.com', 'abcd1234');
        register.verifyProfileFirstName;
        
    });
   
});