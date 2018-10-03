var Register = function () {
  var EC = protractor.ExpectedConditions;
  var grubHubPopUp = element(by.css('div.c-modal-body-section div:nth-of-type(2)'));
  var signIn = element(by.css('div.s-dropdown.dropdown>button'));
  var createAccount = element(by.css('a.ghs-goToCreateAccount'));
  var firstname = element(by.css('input[name=firstName]'));
  var lastname = element(by.css('input[name=lastName]'));
  var emailid = element(by.css('div.s-input-group>input[name=email]'));
  var password = element(by.css('input[name=password]'));
  var createAccountSubmit = element(by.css('div.s-col-md-12>button'));
  var profileFirstName = element(by.css('div.s-dropdown.dropdown>button span:nth-of-type(3)'));
  this.signin = function () {
    browser.wait(EC.elementToBeClickable((signIn), 5000));
    signIn.click();
  };
  this.verifyProfileFirstName = function () {


    browser.wait(EC.visibilityOf(profileFirstName), 10000);
    expect(profileFirstName.getText()).toEqual('vikash!');
  };
  this.closeGrubHubPopUP = function(){
    
    browser.wait(EC.visibilityOf(grubHubPopUp), 5000);
    grubHubPopUp.isDisplayed().then(function (isVisible) {
      if (isVisible) {
        // element is visible
        grubHubPopUp.click();
        
      }
      else
      {
       //doNothing
      }
  });
};
  this.createyouraccount = function (fname, lname, email, pass) {
        grubHubPopUp.click();
        signIn.click();
         createAccount.click();
        firstname.sendKeys(fname);
        lastname.sendKeys(lname);
        emailid.sendKeys(email);
        password.sendKeys(pass);
        browser.wait(EC.elementToBeClickable((createAccountSubmit)), 5000);
        createAccountSubmit.click();
        
        
      
};
};
module.exports = new Register();