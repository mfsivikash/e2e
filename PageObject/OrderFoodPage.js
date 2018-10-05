var utils = require('../Protractor-Utils.js');
var Restaurant = function () {

  //For Expected Conditions
  var EC = protractor.ExpectedConditions;

  //Web-Element in Homepage
  var locationBox = element(By.css('input.addressInput-textInput'));
  var findFood = element(By.css('span.s-btn-copy'));

  //Web-Element in Search Restaurant Page
  var restaurants = element.all(By.css('a[class="restaurant-name u-text-wrap"]'));
  var firstRestaurant = element(by.xpath('//div[@class="s-row"]//ghs-search-item[1]//div[1]//div[1]//div[1]//div[1]//div[1]//div[1]//h5[1]/a'));
  var food = element(by.css('div.u-stack-x-4'));
  var distance = element.all(by.css('.restaurantCard-stats-distance'));
  var oneStarFilter = element(by.css('button[title="1 And Above"]'));
  var twoStarFilter = element(by.css('button[title="2 And Above"]'));
  var threeStarFilter = element(by.css('button[title="3 And Above"]'));
  var fourStarFilter = element(by.css('button[title="4 And Above"]'));
  var fiveStarFilter = element(by.css('button[title="5 Only"]'));
  var laCafe = element(by.css('a#ghs-search-results-restaurantId-656911'));
  var sortOptions = element(by.css('select#ghs-select-sort'));
  let list = element.all(by.css('option.ng-star-inserted'));
  var openNow = element(by.css('label[for$="Open Now"]'));

  //Web-Element in Order Page
  var firstFoodItem = element(by.xpath('//div[@id="menuItem-28395593"]//div[@class="menuItem-inner u-pressable u-inset-2 u-rounded"]'));
  var addQuantity = element(by.css('button.s-btn.s-btn-secondary.s-iconBtn.s-iconBtn--quantity.u-flex-center-center:nth-child(3)'))
  var secondOptionEggPrep = element(by.xpath('//div[@class="menuItemModal-options"]//div[1]//ghs-item-options[1]//div[1]//div[1]//div[2]//div[2]//div[1]//ghs-item-options-radios[1]//div[1]//label[1]//div[1]'))
  var thirdOptionToast = element(by.xpath('//div[@class="menuItemModal-options"]//div[2]//ghs-item-options[1]//div[1]//div[1]//div[2]//div[1]//div[1]//ghs-item-options-radios[1]//div[1]//label[1]'));
  var addToBag = element(by.css('span.s-btn-copy'));
  var quantityDispalyedInCart = element(by.css('div.s-col-xs-1.orderItem-quantity.u-padding-cancel'));
  var checkOut = element(by.css('button[id="ghs-cart-checkout-button"]'));
  var preOrder = element(by.css('button.ghs-preorderButton'));
  var deliverToday = element(by.css('button.ghs-applyWhenFor'));
  var restaurantText = element(by.css('h1.u-text-wrap.ghs-restaurant-nameHeader'));
  var savedIcon = element(by.css('div.u-flex.u-flex-center-center>cb-icon[icon="ribbon"]'));

  //Web-Element in CheckOut Page
  var nameCheckOut = element(by.css('p.contact-info-name'));
  var enterPhone = element(by.css('[name="accountPhone"]'));
  var paymentContinue = element(by.css('span.s-btn-copy'));
  var logo = element(by.css('a.mainNavBrand-logo'));


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

  /*Description: Method to filter by  star restaurant
  @Parm: option
  */
  this.filterbystarresturant = function (option) {
    if (option == 1)
      oneStarFilter.click();
    if (option == 2)
      twoStarFilter.click();
    if (option == 3)
      threeStarFilter.click();
    if (option == 4)
      fourStarFilter.click();
    if (option == 5)
      fiveStarFilter.click();
  };

  /*Description: Method to sort restaurant in order
  @Parm: option
  */
  this.sortrestaurant = function (option) {
    sortOptions.click();
    if (option == 1)
      list.get(0).click();
    if (option == 2)
      list.get(1).click();
    if (option == 3)
      list.get(2).click();
    if (option == 4)
      list.get(3).click();
    if (option == 5)
      list.get(4).click();
  };

  /*Description: Method to order from 4 star restaurant
    @Parm: phoneno
    */
  this.orderfood = function (phoneno) {
    browser.wait(EC.visibilityOf(openNow), 10000);
    openNow.click();
    laCafe.click();
    utils.checkElementPresentAndClick(preOrder, preOrder);
    utils.checkElementPresentAndClick(deliverToday, deliverToday);
    browser.wait(EC.visibilityOf(firstFoodItem), 10000);
    firstFoodItem.click();
    addQuantity.click();
    secondOptionEggPrep.click();
    thirdOptionToast.click();
    addToBag.click();
    browser.wait(EC.visibilityOf(quantityDispalyedInCart), 10000);
    expect(quantityDispalyedInCart.getText()).toBe('2');
    checkOut.click();
    browser.wait(EC.visibilityOf(enterPhone), 10000);
    enterPhone.sendKeys(phoneno);
    paymentContinue.click();
    browser.wait(EC.visibilityOf(nameCheckOut), 10000);
    expect(nameCheckOut.getText()).toBe('VIKASH KHANDELWAL');
    logo.click();
  };

  /*Description: Method to go to Restaurant Page and save it
      @Parm: 
      @Return: Restaurant Name
      */
  this.savefirstrestaurant = function () {
    firstRestaurant.click();
    browser.wait(EC.visibilityOf(savedIcon), 10000);
    savedIcon.click();
    return restaurantText.getText();
  };

  /*Description: Method to find food restaurants are sorted in distance order
    @Parm: 
    */
  this.checksortedbydistance = function () {
    utils.checkElementIsSorted(distance);
  };
};
module.exports = new Restaurant();