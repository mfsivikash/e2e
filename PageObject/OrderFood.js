var utils = require('../Protractor-Utils.js');
var Restaurant = function () {

  //For Expected Conditions
  var EC = protractor.ExpectedConditions;

  var locationBox = element(By.css('input.addressInput-textInput'));
  var findFood = element(By.css('span.s-btn-copy'));
  var restaurants = element.all(By.css('a[class="restaurant-name u-text-wrap"]'));
  var food = element(by.css('div.u-stack-x-4'));
  var distance = element.all(by.css('ghs-restaurant-pickup-distance>span>span.u-stack-x-1'));
  var fourStarFilter = element(by.css('button[title="4 And Above"]'));
  var firstRestaurant = element(by.xpath('//div[@class="s-row"]//ghs-search-item[1]//div[1]//div[1]//div[1]//div[1]//div[1]//div[1]//h5[1]//a'));
  var firstFoodItem = element(by.xpath('//div[@id="menuItem-28395593"]//div[@class="menuItem-inner u-pressable u-inset-2 u-rounded"]'));
  var addQuantity = element(by.css('button.s-btn.s-btn-secondary.s-iconBtn.s-iconBtn--quantity.u-flex-center-center:nth-child(3)'))
  var secondOptionEggPrep = element(by.xpath('//div[@class="menuItemModal-options"]//div[1]//ghs-item-options[1]//div[1]//div[1]//div[2]//div[2]//div[1]//ghs-item-options-radios[1]//div[1]//label[1]//div[1]'))
  var thirdOptionToast = element(by.xpath('//div[@class="menuItemModal-options"]//div[2]//ghs-item-options[1]//div[1]//div[1]//div[2]//div[1]//div[1]//ghs-item-options-radios[1]//div[1]//label[1]'));
  var addToBag = element(by.css('span.s-btn-copy'));
  var quantityDispalyedInCart = element(by.css('div.s-col-xs-1.orderItem-quantity.u-padding-cancel'));
  var checkOut = element(by.css('button[id="ghs-cart-checkout-button"]'));
  var nameCheckOut = element(by.css('p.contact-info-name'));
  var enterPhone = element(by.css('[name="accountPhone"]'));
  var paymentContinue = element(by.css('span.s-btn-copy'));

  /*Description: Method to find food in particular location
  @Parm: location
  */
  this.findfoodatlocation = function (location) {
    browser.sleep(2000);
    locationBox.sendKeys(location);
    findFood.click();
    browser.wait(EC.visibilityOf(food), 10000);
    expect(food.getText()).toEqual('Browse food near you');
  };

  /*Description: Method to order from 4 star restaurant
    @Parm: location
    */
  this.orderfoodfromfourstar = function (phoneno) {
    fourStarFilter.click();
    firstRestaurant.click();
    browser.wait(EC.visibilityOf(firstFoodItem), 10000);
    firstFoodItem.click();
    addQuantity.click();
    secondOptionEggPrep.click();
    thirdOptionToast.click();
    addToBag.click();
    browser.wait(EC.visibilityOf(quantityDispalyedInCart), 10000);
    expect(quantityDispalyedInCart.getText()).toBe('2');
    checkOut.click();
    browser.sleep(10000);
    browser.wait(EC.visibilityOf(enterPhone), 10000);
    enterPhone.sendKeys(phoneno);
    paymentContinue.click();
    browser.wait(EC.visibilityOf(nameCheckOut), 10000);
    expect(nameCheckOut.getText()).toBe('VIKASH KHANDELWAL');
  };
};
module.exports = new Restaurant();