var utils = require('../Protractor-Utils.js');

var Saved = function () {

    //For Expected Conditions
    var EC = protractor.ExpectedConditions;

    //Web-Elements in Saved Pages
    var profileMenu = element(by.css('cb-icon.u-hidden-sm--down'));
    var savedPage = element(by.xpath('//span[contains(text(),"Saved")]'));
    var restaurantTitle = element(by.css('div.s-col-xs-12>h4>a'));
    var multiRestaurantTitle = element.all(by.css('div.s-col-xs-12>h4>a'));

    //Web-Elements in HomePage
    var allsavedIconPopular = element.all(by.xpath('//ghs-restaurant-section-data[@type="popular"]//div//button[@title="Save this restaurant"]'));
    var allPopularRestaurant = element.all(by.xpath('//ghs-restaurant-section-data[@type="popular"]//div//h5'));
    var scrollToPopularRestaurant = element(by.xpath('//ghs-restaurant-section-data[@type="popular"]'));
    var allClosestRestaurant = element.all(by.xpath('//ghs-restaurant-section-data[@type="closest"]//button[@title="Save this restaurant"]'));
    var allsavedIconClosest = element.all(by.xpath('//ghs-restaurant-section-data[@type="closest"]//button[@title="Save this restaurant"]'));

    /*Description: Method to go to Saved Page
    @Parm: 
    @Return: Restaurant Name
    */
    this.savedpageresturantname = function () {
        profileMenu.click();
        savedPage.click();
        return restaurantTitle.getText();
    };

    /*Description: Method to save all Popular Restaurant in HomePage
    @Parm: 
    @Return: Restaurant Name
    */
    this.savepopularrestauranthome = function () {
        browser.executeScript('arguments[0].scrollIntoView()', scrollToPopularRestaurant.getWebElement());
        utils.clickallelements(allsavedIconPopular);
        var names = utils.storeallelementtextintoarray(allPopularRestaurant);
        return names;
    };

    /*Description: Method to save all Closest  Restaurant in HomePage
    @Parm: 
    @Return: Restaurant Name
    */
    this.savedclosestrestauranthome = function () {
        browser.executeScript('arguments[0].scrollIntoView()', scrollToPopularRestaurant.getWebElement());
        utils.clickallelements(allsavedIconClosest);
        var names = utils.storeallelementtextintoarray(allClosestRestaurant);
        return names;
    };

    /*Description: Method to get all name from saved pages 
        @Parm: 
        @Return: Restaurant Name
        */
    this.allsavedpageresturantname = function () {
        profileMenu.click();
        savedPage.click();
        var names = utils.storeallelementtextintoarray(multiRestaurantTitle);
        return names;
    };
};
module.exports = new Saved();