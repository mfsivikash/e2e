var Register = function () {
  var EC = protractor.ExpectedConditions;
  var grubHubPopUp = element(by.xpath('//div[contains(text(),"Not now")]'));
  var signIn = element(by.xpath('.//span[contains(text(),"Sign in")]'));
  var createAccount = element(by.xpath('//a[@class="ghs-goToCreateAccount"]'));
  var firstname = element(by.xpath('//input[@placeholder="First name"]'));
  var lastname = element(by.xpath('//input[@placeholder="Last name"]'));
  var emailid = element(by.xpath('//input[@placeholder="Enter your email"]'));
  var password = element(by.xpath('//input[@placeholder="Password (8 character minimum)"]'));
  var createAccountSubmit = element(by.xpath('//div[@class="newUserWizard-content wizardStep"]//div[@class="s-col-md-12"]//button'));
  var profileFirstName = element(by.xpath('//span[@class="mainNavProfile-user-initial h4 u-margin-cancel"]'));
  this.signin = function () {
    browser.wait(EC.elementToBeClickable((signIn), 5000));
    signIn.click();
  };
  this.verifyProfileFirstName = function () {


    browser.wait(EC.visibilityOf(profileFirstName), 10000);
    expect(profileFirstName.getText()).toEqual('v');
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