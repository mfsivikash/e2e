var Utils = function () {

    /*Description: Method to check if element is displayed in the page
  @Param: Web-Element
  */
    this.checkElementDisplayed = function (element) {
        browser.wait(function (element) {
            element.isPresent().then(function (isPresent) {
                if (isPresent) {
                    element.isDisplayed().then(function (isDisplayed) {
                        if (isDisplayed) {
                            return true;
                        }
                    });
                }
                else
                    return false;
            });
        }, 20000);
    };

    /*Description: Method to check if element is present in the DOM and click on it
@Param: Web-Element of element to check , Web-Element to Click
*/
    this.checkElementPresentAndClick = function (elementtocheck, elementtoclick) {
        elementtocheck.isPresent().then(function (isPre) {
            if (isPre) {
                elementtoclick.click();
            }
        });
    };
    /*Description:Check if numbers sequence is increasing
* @param {number} numbers - a sequence of input numbers, must be valid floating point values;
* @return {boolean} - true if given sequence is increasing, false otherwise
*/
this.isIncreasingSequence=function(numbers) {
    for (var num = 0; num < numbers.length - 1; num++) {
        if (!(numbers[num] < numbers[num + 1])) {
          return false;
        }
      }
      return true;
    }
};
module.exports = new Utils();