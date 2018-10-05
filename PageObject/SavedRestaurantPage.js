var utils = require('../Protractor-Utils.js');
var Saved = function () {

    var profileMenu = element(by.css('cb-icon.u-hidden-sm--down'));
    var savedPage = element(by.xpath('//span[contains(text(),"Saved")]'));
    var restaurantTitle = element(by.css('div.s-col-xs-12>h4>a'));

    /*Description: Method to go to Saved Page
    @Parm: 
    @Return: Restaurant Name
    */
    this.savedpageresturantname = function () {
        profileMenu.click();
        savedPage.click();
        return restaurantTitle.getText();
    };
};
module.exports = new Saved();