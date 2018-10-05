var utils = require('../Protractor-Utils.js');
var Register = function () {

  //For Expected Conditions
  var EC = protractor.ExpectedConditions;

  //Web-Elements at HomePage
  var grubHubPopUp = element(by.css('div.c-modal-body-section div:nth-of-type(2)'));
  var signIn = element(by.css('div.s-dropdown.dropdown>button'));
  var profileFirstName = element(by.css('div.s-dropdown.dropdown>button span:nth-of-type(3)'));
  var profileMenu = element(by.css('cb-icon.u-hidden-sm--down'));
  var logoutLink = element(by.css('a.ghs-signOut.u-text-interactive'));
  var grubHubFrame = element(by.css('div.c-modal[data-chiri-id="2DLRWAuQ8cU0A8IwkCYcsy"]'));

  //Web-Element at Sign up Window
  var createAccount = element(by.css('a.ghs-goToCreateAccount'));
  var firstname = element(by.css('input[name=firstName]'));
  var lastname = element(by.css('input[name=lastName]'));
  var emailid = element(by.css('div.s-input-group>input[name=email]'));
  var password = element(by.css('input[name=password]'));
  var createAccountSubmit = element(by.css('div.s-col-md-12>button'));
  var firstNameError = element(by.css('[at-msg-name="firstName"]'));
  var lastNameError = element(by.css('[at-msg-name="lastName"]'));
  var emailError = element(by.css('[at-msg-name="email"]'));
  var passwordError = element(by.css('[at-msg-name="password"]'));

  /*Description: Clicking on Sign In
  @Parm: 
  */
  this.signin = function () {
    browser.wait(EC.elementToBeClickable((signIn), 5000));
    signIn.click();
  };

  /*Description: Logging out
  @Parm: 
  */
  this.signout = function () {
    browser.sleep(2000);
    browser.wait(EC.elementToBeClickable((profileMenu), 10000));
    profileMenu.click();
    logoutLink.click();
  };

  /*Description: Method to assert first name in profile
 @Parm: 
 */
  this.verifyProfileFirstName = function () {
    browser.wait(EC.visibilityOf(profileFirstName), 10000);
    expect(profileFirstName.getText()).toEqual('vikash!');
  };

  /*Description: Method to assert first name and return false if matched (for duplicate account)
  @Parm: 
  */
  this.validateNotRegistered = function () {
    browser.wait(EC.visibilityOf(profileFirstName), 10000);
    expect(profileFirstName.getText()).not.toEqual('vikash!');
  };

  /*Description: Method to close First Pop of GrubHub
  @Parm: 
  */
  this.closeGrubHubPopUP = function () {
    utils.checkElementPresentAndClick(grubHubFrame, grubHubPopUp);
  };

  /*Description: Method to create account
  @Param: First name,Last name, Email and Password
  */
  this.createyouraccount = function (fname, lname, email, pass) {
    browser.wait(EC.visibilityOf(signIn), 10000);
    signIn.click();
    createAccount.click();
    firstname.sendKeys(fname);
    lastname.sendKeys(lname);
    emailid.sendKeys(email);
    password.sendKeys(pass);

    //Timeout condition of 5 sec to wait for Create Account button to be clickable
    browser.wait(EC.elementToBeClickable((createAccountSubmit)), 5000);
    createAccountSubmit.click();
  };

  /*Description: Assertion of validation message - first name is required
    @Param: 
    */
  this.firstNameReqValidate = function () {
    expect(firstNameError.getText()).toBe('First name is required');
  };

  /*Description: Assertion of validation message - first name should not contain number/special character
    @Param: 
    */
  this.firstNameCharacterValidate = function () {
    expect(firstNameError.getText()).toBe("First name must contain only alphabetic characters and - , .'");
  };

  /*Description: Assertion of validation message - last name should not contain number/special character
    @Param: 
    */
  this.lastNameCharacterValidate = function () {
    expect(lastNameError.getText()).toBe("Last name must contain only alphabetic characters and - , . '");
  };

  /*Description: Assertion of validation message - Last name is required
    @Param: 
    */
  this.lastNameValidate = function () {
    expect(lastNameError.getText()).toBe('Last name is required');
  };

  /*Description: Assertion of validation message - Email is required
    @Param: 
    */
  this.emailValidate = function () {
    expect(emailError.getText()).toBe('Email is required');
  };

  /*Description: Assertion of validation message - Invalid email id
    @Param: 
    */
  this.emailValidateInvalidId = function () {
    expect(emailError.getText()).toBe("You've entered an invalid email address. Make sure it includes an '@' and a top-level domain like '.com', '.edu', or '.gov'.");
  };

  /*Description: Assertion of validation message - Password is required
    @Param: 
    */
  this.passwordValidate = function () {
    expect(passwordError.getText()).toBe('Password is required');
  };

  /*Description: Assertion of validation message - Password should be less than 8 and greater than 255 character
    @Param: 
    */
  this.passwordLength = function () {
    expect(passwordError.getText()).toBe('Password must be between 8 and 255 characters in length');
  };

  /*Description: Assertion of validation message - Password same as password
    @Param: 
    */
  this.passwordSameText = function () {
    expect(passwordError.getText()).toBe("Password cannot be 'password'");
  };
};
module.exports = new Register();