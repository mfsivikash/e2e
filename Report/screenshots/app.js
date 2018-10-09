var app = angular.module('reportingApp', []);

app.controller('ScreenshotReportController', function ($scope) {
    $scope.searchSettings = Object.assign({
        description: '',
        allselected: true,
        passed: true,
        failed: true,
        pending: true,
        withLog: true
    }, {}); // enable customisation of search settings on first page hit

    var initialColumnSettings = undefined; // enable customisation of visible columns on first page hit
    if (initialColumnSettings) {
        if (initialColumnSettings.displayTime !== undefined) {
            // initial settings have be inverted because the html bindings are inverted (e.g. !ctrl.displayTime)
            this.displayTime = !initialColumnSettings.displayTime;
        }
        if (initialColumnSettings.displayBrowser !== undefined) {
            this.displayBrowser = !initialColumnSettings.displayBrowser; // same as above
        }
        if (initialColumnSettings.displaySessionId !== undefined) {
            this.displaySessionId = !initialColumnSettings.displaySessionId; // same as above
        }
        if (initialColumnSettings.displayOS !== undefined) {
            this.displayOS = !initialColumnSettings.displayOS; // same as above
        }
        if (initialColumnSettings.inlineScreenshots !== undefined) {
            this.inlineScreenshots = initialColumnSettings.inlineScreenshots; // this setting does not have to be inverted
        }

    }


    $scope.inlineScreenshots = false;
    this.showSmartStackTraceHighlight = true;

    this.chooseAllTypes = function () {
        var value = true;
        $scope.searchSettings.allselected = !$scope.searchSettings.allselected;
        if (!$scope.searchSettings.allselected) {
            value = false;
        }

        $scope.searchSettings.passed = value;
        $scope.searchSettings.failed = value;
        $scope.searchSettings.pending = value;
        $scope.searchSettings.withLog = value;
    };

    this.isValueAnArray = function (val) {
        return isValueAnArray(val);
    };

    this.getParent = function (str) {
        var arr = str.split('|');
        str = "";
        for (var i = arr.length - 2; i > 0; i--) {
            str += arr[i] + " > ";
        }
        return str.slice(0, -3);
    };

    this.getSpec = function (str) {
        return getSpec(str);
    };


    this.getShortDescription = function (str) {
        return str.split('|')[0];
    };

    this.convertTimestamp = function (timestamp) {
        var d = new Date(timestamp),
            yyyy = d.getFullYear(),
            mm = ('0' + (d.getMonth() + 1)).slice(-2),
            dd = ('0' + d.getDate()).slice(-2),
            hh = d.getHours(),
            h = hh,
            min = ('0' + d.getMinutes()).slice(-2),
            ampm = 'AM',
            time;

        if (hh > 12) {
            h = hh - 12;
            ampm = 'PM';
        } else if (hh === 12) {
            h = 12;
            ampm = 'PM';
        } else if (hh === 0) {
            h = 12;
        }

        // ie: 2013-02-18, 8:35 AM
        time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

        return time;
    };


    this.round = function (number, roundVal) {
        return (parseFloat(number) / 1000).toFixed(roundVal);
    };


    this.passCount = function () {
        var passCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.passed) {
                passCount++;
            }
        }
        return passCount;
    };


    this.pendingCount = function () {
        var pendingCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.pending) {
                pendingCount++;
            }
        }
        return pendingCount;
    };


    this.failCount = function () {
        var failCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (!result.passed && !result.pending) {
                failCount++;
            }
        }
        return failCount;
    };

    this.passPerc = function () {
        return (this.passCount() / this.totalCount()) * 100;
    };
    this.pendingPerc = function () {
        return (this.pendingCount() / this.totalCount()) * 100;
    };
    this.failPerc = function () {
        return (this.failCount() / this.totalCount()) * 100;
    };
    this.totalCount = function () {
        return this.passCount() + this.failCount() + this.pendingCount();
    };

    this.applySmartHighlight = function (line) {
        if (this.showSmartStackTraceHighlight) {
            if (line.indexOf('node_modules') > -1) {
                return 'greyout';
            }
            if (line.indexOf('  at ') === -1) {
                return '';
            }

            return 'highlight';
        }
        return true;
    };


    var results = [
    {
        "description": "Find restuarant in particular region and check if it is displayed|Suite for Restaurant page",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7b0bc4e5432a5d394d7b0f6baf81984b",
        "instanceId": 5908,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22ht9e2y4hv1boe393bfx8tseeu1539004088262%22%2C%22sessionId%22%3A%226ebneuudfbythz1752eqzdcri1539004088261%22%2C%22sessionStartDateTime%22%3A%222018-10-08T13%3A08%3A08.261Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A4%2C%22dateTime%22%3A%222018-10-08T13%3A08%3A08.270Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%223363a311-cafb-11e8-b358-a93e8c1c42af%22%2C%22v2SessionId%22%3A%223363ca22-cafb-11e8-a322-1f6839a5fd17%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539004089699,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1539004094392,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1539004095687,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1539004105233,
                "type": ""
            }
        ],
        "screenShotFile": "00250042-0071-0031-00f2-00b800b000b2.png",
        "timestamp": 1539004080712,
        "duration": 28600
    },
    {
        "description": "Find restuarant in particular region and order from 4 star|Suite for Restaurant page",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7b0bc4e5432a5d394d7b0f6baf81984b",
        "instanceId": 5908,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22ht9e2y4hv1boe393bfx8tseeu1539004088262%22%2C%22sessionId%22%3A%226ebneuudfbythz1752eqzdcri1539004088261%22%2C%22sessionStartDateTime%22%3A%222018-10-08T13%3A08%3A08.261Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T13%3A08%3A33.620Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%223363a311-cafb-11e8-b358-a93e8c1c42af%22%2C%22v2SessionId%22%3A%223363ca22-cafb-11e8-a322-1f6839a5fd17%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539004114469,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1539004123311,
                "type": ""
            }
        ],
        "screenShotFile": "003b0068-000c-005a-007a-003e007500b8.png",
        "timestamp": 1539004110875,
        "duration": 53887
    },
    {
        "description": "Sorting restaurant according to distance and verifying|Suite for Restaurant page",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7b0bc4e5432a5d394d7b0f6baf81984b",
        "instanceId": 5908,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22ht9e2y4hv1boe393bfx8tseeu1539004088262%22%2C%22sessionId%22%3A%226ebneuudfbythz1752eqzdcri1539004088261%22%2C%22sessionStartDateTime%22%3A%222018-10-08T13%3A08%3A08.261Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T13%3A09%3A29.306Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%223363a311-cafb-11e8-b358-a93e8c1c42af%22%2C%22v2SessionId%22%3A%223363ca22-cafb-11e8-a322-1f6839a5fd17%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539004169718,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1539004180434,
                "type": ""
            }
        ],
        "screenShotFile": "0056008b-0080-0005-0056-00b0005e0057.png",
        "timestamp": 1539004166579,
        "duration": 18147
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "333c08f261026feea9e7640ffc2c502a",
        "instanceId": 4272,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22i21u4kb0shfb5jddrykcf8tbc1539004196927%22%2C%22sessionId%22%3A%22kai5qn7ryh4rc8fb813k7arcq1539004196926%22%2C%22sessionStartDateTime%22%3A%222018-10-08T13%3A09%3A56.926Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T13%3A09%3A57.941Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%227428c0b9-cafb-11e8-b819-0955e89d38bb%22%2C%22v2SessionId%22%3A%227428c0b2-cafb-11e8-9fd0-99d35836c864%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539004200232,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1539004203371,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1539004204802,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1539004214263,
                "type": ""
            }
        ],
        "screenShotFile": "005b00c9-0016-00a8-0074-006200740070.png",
        "timestamp": 1539004188629,
        "duration": 40546
    },
    {
        "description": "Save popular restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "333c08f261026feea9e7640ffc2c502a",
        "instanceId": 4272,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22i21u4kb0shfb5jddrykcf8tbc1539004196927%22%2C%22sessionId%22%3A%22kai5qn7ryh4rc8fb813k7arcq1539004196926%22%2C%22sessionStartDateTime%22%3A%222018-10-08T13%3A09%3A56.926Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T13%3A10%3A33.657Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%227428c0b9-cafb-11e8-b819-0955e89d38bb%22%2C%22v2SessionId%22%3A%227428c0b2-cafb-11e8-9fd0-99d35836c864%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539004234059,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1539004242607,
                "type": ""
            }
        ],
        "screenShotFile": "00ea007a-0095-0002-0089-00eb00fe00c2.png",
        "timestamp": 1539004230649,
        "duration": 18758
    },
    {
        "description": "Save closest restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "333c08f261026feea9e7640ffc2c502a",
        "instanceId": 4272,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22i21u4kb0shfb5jddrykcf8tbc1539004196927%22%2C%22sessionId%22%3A%22kai5qn7ryh4rc8fb813k7arcq1539004196926%22%2C%22sessionStartDateTime%22%3A%222018-10-08T13%3A09%3A56.926Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T13%3A10%3A53.888Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%227428c0b9-cafb-11e8-b819-0955e89d38bb%22%2C%22v2SessionId%22%3A%227428c0b2-cafb-11e8-9fd0-99d35836c864%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539004254270,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1539004263317,
                "type": ""
            }
        ],
        "screenShotFile": "00260063-0001-00f0-00e3-006100850077.png",
        "timestamp": 1539004251254,
        "duration": 18635
    },
    {
        "description": "Signing up with valid details and verifying the profile name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "6a10ad6391f0b101afd67f9552fee721",
        "instanceId": 9416,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22x798egzz3qjnuj9jw5h3l8srk1539004281704%22%2C%22sessionId%22%3A%2272a8t8l8sesj6iz52h9blnf031539004281701%22%2C%22sessionStartDateTime%22%3A%222018-10-08T13%3A11%3A21.701Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A6%2C%22dateTime%22%3A%222018-10-08T13%3A11%3A22.393Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22a6afeef0-cafb-11e8-b114-d7a41fd17bf1%22%2C%22v2SessionId%22%3A%22a6b03d1e-cafb-11e8-a70e-87932d567c07%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539004285287,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1539004289189,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1539004290770,
                "type": ""
            }
        ],
        "screenShotFile": "00a3005f-0092-00a6-009a-008500e7004c.png",
        "timestamp": 1539004275292,
        "duration": 25208
    },
    {
        "description": "Signing up with same email id twice|Register at Eat 24",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "6a10ad6391f0b101afd67f9552fee721",
        "instanceId": 9416,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Expected 'vikash!' not to equal 'vikash!'."
        ],
        "trace": [
            "Error: Failed expectation\n    at Register.validateNotRegistered (D:\\e2etests\\PageObject\\SignUpPage.js:58:44)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:37:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22x798egzz3qjnuj9jw5h3l8srk1539004281704%22%2C%22sessionId%22%3A%2272a8t8l8sesj6iz52h9blnf031539004281701%22%2C%22sessionStartDateTime%22%3A%222018-10-08T13%3A11%3A21.701Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T13%3A11%3A45.236Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22a6afeef0-cafb-11e8-b114-d7a41fd17bf1%22%2C%22v2SessionId%22%3A%22a6b03d1e-cafb-11e8-a70e-87932d567c07%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539004305562,
                "type": ""
            }
        ],
        "screenShotFile": "00bf00d3-008f-0024-00aa-0050003c005c.png",
        "timestamp": 1539004302461,
        "duration": 22985
    },
    {
        "description": "Signing up without entering first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "6a10ad6391f0b101afd67f9552fee721",
        "instanceId": 9416,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22x798egzz3qjnuj9jw5h3l8srk1539004281704%22%2C%22sessionId%22%3A%2272a8t8l8sesj6iz52h9blnf031539004281701%22%2C%22sessionStartDateTime%22%3A%222018-10-08T13%3A11%3A21.701Z%22%2C%22userId%22%3A%2253853786%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T13%3A12%3A09.527Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22a6afeef0-cafb-11e8-b114-d7a41fd17bf1%22%2C%22v2SessionId%22%3A%22a6b03d1e-cafb-11e8-a70e-87932d567c07%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539004329861,
                "type": ""
            }
        ],
        "screenShotFile": "00000099-00d2-003b-00ed-002e00a30088.png",
        "timestamp": 1539004326948,
        "duration": 6170
    },
    {
        "description": "Signing up without entering last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "6a10ad6391f0b101afd67f9552fee721",
        "instanceId": 9416,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00dc0044-0073-00eb-0062-00a00003008d.png",
        "timestamp": 1539004333605,
        "duration": 5140
    },
    {
        "description": "Signing up without entering email|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "6a10ad6391f0b101afd67f9552fee721",
        "instanceId": 9416,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006800c2-0052-009c-008c-007700b000c9.png",
        "timestamp": 1539004339225,
        "duration": 5266
    },
    {
        "description": "Signing up without entering password|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "6a10ad6391f0b101afd67f9552fee721",
        "instanceId": 9416,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00650011-00b0-00ca-001d-00b0001900f9.png",
        "timestamp": 1539004344955,
        "duration": 7188
    },
    {
        "description": "Signing up without entering anything|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "6a10ad6391f0b101afd67f9552fee721",
        "instanceId": 9416,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f500e9-003d-00ff-00a6-00670034009e.png",
        "timestamp": 1539004352639,
        "duration": 5787
    },
    {
        "description": "Signing up with entering numbers in first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "6a10ad6391f0b101afd67f9552fee721",
        "instanceId": 9416,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e40080-0016-00ba-001b-009900db0066.png",
        "timestamp": 1539004358870,
        "duration": 5424
    },
    {
        "description": "Signing up with entering non-allowed characters in first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "6a10ad6391f0b101afd67f9552fee721",
        "instanceId": 9416,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00c7006c-00cc-0030-00e0-0043009a00b5.png",
        "timestamp": 1539004364781,
        "duration": 5253
    },
    {
        "description": "Signing up with entering numbers in last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "6a10ad6391f0b101afd67f9552fee721",
        "instanceId": 9416,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00da00eb-002e-001e-00a9-000b003a00f6.png",
        "timestamp": 1539004370518,
        "duration": 5578
    },
    {
        "description": "Signing up with entering non-allowed characters in last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "6a10ad6391f0b101afd67f9552fee721",
        "instanceId": 9416,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0075009b-0064-0006-009a-00f2005200ab.png",
        "timestamp": 1539004376592,
        "duration": 5246
    },
    {
        "description": "Signing up with entering invalid id |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "6a10ad6391f0b101afd67f9552fee721",
        "instanceId": 9416,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007600c0-0020-003b-009c-00ab00e200eb.png",
        "timestamp": 1539004382332,
        "duration": 5507
    },
    {
        "description": "Signing up with entering password as \"password\" |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "6a10ad6391f0b101afd67f9552fee721",
        "instanceId": 9416,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002d00c9-0051-0059-0000-0004008500e1.png",
        "timestamp": 1539004388348,
        "duration": 5977
    },
    {
        "description": "Signing up with entering password less than 8 characters |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "6a10ad6391f0b101afd67f9552fee721",
        "instanceId": 9416,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d5004d-0012-0096-0097-00eb00f70000.png",
        "timestamp": 1539004394877,
        "duration": 4567
    },
    {
        "description": "Signing up with entering password more than 255 characters |Register at Eat 24",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "6a10ad6391f0b101afd67f9552fee721",
        "instanceId": 9416,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, [at-msg-name=\"password\"])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, [at-msg-name=\"password\"])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as getText] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as getText] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Register.passwordLength (D:\\e2etests\\PageObject\\SignUpPage.js:138:26)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:116:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Signing up with entering password more than 255 characters \") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:113:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:11:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "00980022-000a-0015-00b7-002c002500e3.png",
        "timestamp": 1539004399929,
        "duration": 10916
    },
    {
        "description": "Signing up with valid details and verifying the profile name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "071db7cad5c7bc6f52fdfef318a2f7a9",
        "instanceId": 868,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22i8nc96ay20a6w0pntkurzq1kq1539004421289%22%2C%22sessionId%22%3A%22oedbncitkjnx5nyptaamwajg01539004421288%22%2C%22sessionStartDateTime%22%3A%222018-10-08T13%3A13%3A41.288Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T13%3A13%3A41.961Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22f9e35f35-cafb-11e8-89b9-3f20ec8836b5%22%2C%22v2SessionId%22%3A%22f9e3ad50-cafb-11e8-b06b-bdc1eca28264%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539004424050,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1539004428197,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1539004429516,
                "type": ""
            }
        ],
        "screenShotFile": "006b001b-00ff-00c9-00b8-002500d400d1.png",
        "timestamp": 1539004414887,
        "duration": 24072
    },
    {
        "description": "Signing up with same email id twice|Register at Eat 24",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "071db7cad5c7bc6f52fdfef318a2f7a9",
        "instanceId": 868,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Expected 'vikash!' not to equal 'vikash!'."
        ],
        "trace": [
            "Error: Failed expectation\n    at Register.validateNotRegistered (D:\\e2etests\\PageObject\\SignUpPage.js:58:44)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:37:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22i8nc96ay20a6w0pntkurzq1kq1539004421289%22%2C%22sessionId%22%3A%22oedbncitkjnx5nyptaamwajg01539004421288%22%2C%22sessionStartDateTime%22%3A%222018-10-08T13%3A13%3A41.288Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T13%3A14%3A03.528Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22f9e35f35-cafb-11e8-89b9-3f20ec8836b5%22%2C%22v2SessionId%22%3A%22f9e3ad50-cafb-11e8-b06b-bdc1eca28264%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539004443916,
                "type": ""
            }
        ],
        "screenShotFile": "00280019-006a-0031-00c8-00c900660055.png",
        "timestamp": 1539004440890,
        "duration": 23791
    },
    {
        "description": "Signing up without entering first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "071db7cad5c7bc6f52fdfef318a2f7a9",
        "instanceId": 868,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22i8nc96ay20a6w0pntkurzq1kq1539004421289%22%2C%22sessionId%22%3A%22oedbncitkjnx5nyptaamwajg01539004421288%22%2C%22sessionStartDateTime%22%3A%222018-10-08T13%3A13%3A41.288Z%22%2C%22userId%22%3A%2253853805%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T13%3A14%3A28.083Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22f9e35f35-cafb-11e8-89b9-3f20ec8836b5%22%2C%22v2SessionId%22%3A%22f9e3ad50-cafb-11e8-b06b-bdc1eca28264%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539004468439,
                "type": ""
            }
        ],
        "screenShotFile": "00050088-00bc-002f-0075-007500eb00e6.png",
        "timestamp": 1539004465978,
        "duration": 5500
    },
    {
        "description": "Signing up without entering last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "071db7cad5c7bc6f52fdfef318a2f7a9",
        "instanceId": 868,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002900ac-002a-003a-0042-00ac001700e7.png",
        "timestamp": 1539004471981,
        "duration": 5670
    },
    {
        "description": "Signing up without entering email|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "071db7cad5c7bc6f52fdfef318a2f7a9",
        "instanceId": 868,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f300be-009a-0050-0022-00d000c80059.png",
        "timestamp": 1539004478142,
        "duration": 5413
    },
    {
        "description": "Signing up without entering password|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "071db7cad5c7bc6f52fdfef318a2f7a9",
        "instanceId": 868,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000c006d-00eb-00da-000e-0014002000d5.png",
        "timestamp": 1539004484050,
        "duration": 5572
    },
    {
        "description": "Signing up without entering anything|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "071db7cad5c7bc6f52fdfef318a2f7a9",
        "instanceId": 868,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a700ea-0089-0098-003c-00b400740038.png",
        "timestamp": 1539004490086,
        "duration": 4756
    },
    {
        "description": "Signing up with entering numbers in first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "071db7cad5c7bc6f52fdfef318a2f7a9",
        "instanceId": 868,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006c007f-00e2-00c7-003c-001900b00005.png",
        "timestamp": 1539004495306,
        "duration": 4792
    },
    {
        "description": "Signing up with entering non-allowed characters in first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "071db7cad5c7bc6f52fdfef318a2f7a9",
        "instanceId": 868,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008000a3-00b4-001b-00d1-00d900e700c3.png",
        "timestamp": 1539004500597,
        "duration": 5437
    },
    {
        "description": "Signing up with entering numbers in last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "071db7cad5c7bc6f52fdfef318a2f7a9",
        "instanceId": 868,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006700bb-000a-0097-00ea-00fd002a00de.png",
        "timestamp": 1539004506519,
        "duration": 4951
    },
    {
        "description": "Signing up with entering non-allowed characters in last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "071db7cad5c7bc6f52fdfef318a2f7a9",
        "instanceId": 868,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00030002-00e8-004f-00a1-005a006e001c.png",
        "timestamp": 1539004511971,
        "duration": 4627
    },
    {
        "description": "Signing up with entering invalid id |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "071db7cad5c7bc6f52fdfef318a2f7a9",
        "instanceId": 868,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009400fa-00e1-00e5-0085-003700b80086.png",
        "timestamp": 1539004517117,
        "duration": 4641
    },
    {
        "description": "Signing up with entering password as \"password\" |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "071db7cad5c7bc6f52fdfef318a2f7a9",
        "instanceId": 868,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0047002c-0053-0049-0071-009e008d00e2.png",
        "timestamp": 1539004522226,
        "duration": 4558
    },
    {
        "description": "Signing up with entering password less than 8 characters |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "071db7cad5c7bc6f52fdfef318a2f7a9",
        "instanceId": 868,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00540074-0019-0044-00fb-001c009a00cb.png",
        "timestamp": 1539004527339,
        "duration": 5759
    },
    {
        "description": "Signing up with entering password more than 255 characters |Register at Eat 24",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "071db7cad5c7bc6f52fdfef318a2f7a9",
        "instanceId": 868,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, [at-msg-name=\"password\"])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, [at-msg-name=\"password\"])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as getText] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as getText] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Register.passwordLength (D:\\e2etests\\PageObject\\SignUpPage.js:138:26)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:116:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Signing up with entering password more than 255 characters \") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:113:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:11:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "00d000c8-002c-0073-00cb-0051006f00c2.png",
        "timestamp": 1539004533614,
        "duration": 8814
    },
    {
        "description": "Find restuarant in particular region and check if it is displayed|Suite for Restaurant page",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "e5253285e08563df475362872a7bb2eb",
        "instanceId": 6784,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, a.ghs-goToCreateAccount)"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, a.ghs-goToCreateAccount)\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Register.createyouraccount (D:\\e2etests\\PageObject\\SignUpPage.js:74:19)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\OrderFoodTest.js:28:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Find restuarant in particular region and check if it is displayed\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\OrderFoodTest.js:26:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\OrderFoodTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%226qvm7udnzk4c7u6shg7aorybr1539063083570%22%2C%22sessionId%22%3A%22chxffgdkjlmgz73akl9v694fo1539063083569%22%2C%22sessionStartDateTime%22%3A%222018-10-09T05%3A31%3A23.569Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A6%2C%22dateTime%22%3A%222018-10-09T05%3A31%3A24.173Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%228f547a8a-cb84-11e8-b145-436423b0ddf8%22%2C%22v2SessionId%22%3A%228f553ddd-cb84-11e8-8a35-cb159f0757db%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539063085357,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1539063091747,
                "type": ""
            }
        ],
        "screenShotFile": "00620019-00c8-0020-0025-006b002f00b4.png",
        "timestamp": 1539063077333,
        "duration": 15055
    },
    {
        "description": "Find restuarant in particular region and order from 4 star|Suite for Restaurant page",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "e5253285e08563df475362872a7bb2eb",
        "instanceId": 6784,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1539063093698,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-982a6e873292be6cb66f.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1539063109267,
                "type": ""
            }
        ],
        "screenShotFile": "000300dc-0075-0070-0059-007c00e700d4.png",
        "timestamp": 1539063093649,
        "duration": 58606
    },
    {
        "description": "Sorting restaurant according to distance and verifying|Suite for Restaurant page",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "e5253285e08563df475362872a7bb2eb",
        "instanceId": 6784,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%226qvm7udnzk4c7u6shg7aorybr1539063083570%22%2C%22sessionId%22%3A%22chxffgdkjlmgz73akl9v694fo1539063083569%22%2C%22sessionStartDateTime%22%3A%222018-10-09T05%3A31%3A23.569Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A5%2C%22dateTime%22%3A%222018-10-09T05%3A32%3A37.917Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%228f547a8a-cb84-11e8-b145-436423b0ddf8%22%2C%22v2SessionId%22%3A%228f553ddd-cb84-11e8-8a35-cb159f0757db%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539063158254,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-982a6e873292be6cb66f.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1539063167825,
                "type": ""
            }
        ],
        "screenShotFile": "00a3007e-0048-0063-00b0-00b70044007c.png",
        "timestamp": 1539063154270,
        "duration": 20423
    },
    {
        "description": "Save a restaurant in restaurant page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "e8405ef7b68b6f4922713634b2660053",
        "instanceId": 7932,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%2281y6hkhqrbk9y7iwesbgppayw1539063184775%22%2C%22sessionId%22%3A%2242itfakd0odgyzs4nphuypspi1539063184774%22%2C%22sessionStartDateTime%22%3A%222018-10-09T05%3A33%3A04.774Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-09T05%3A33%3A05.282Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22cba749ec-cb84-11e8-8993-6be36895944f%22%2C%22v2SessionId%22%3A%22cba7bf17-cb84-11e8-a1a5-7dcf709e4827%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539063186574,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1539063189837,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1539063191292,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-982a6e873292be6cb66f.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1539063201768,
                "type": ""
            }
        ],
        "screenShotFile": "006a00cb-005c-00a9-0071-00b300b80025.png",
        "timestamp": 1539063179078,
        "duration": 38977
    },
    {
        "description": "Save popular restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "e8405ef7b68b6f4922713634b2660053",
        "instanceId": 7932,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%2281y6hkhqrbk9y7iwesbgppayw1539063184775%22%2C%22sessionId%22%3A%2242itfakd0odgyzs4nphuypspi1539063184774%22%2C%22sessionStartDateTime%22%3A%222018-10-09T05%3A33%3A04.774Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-09T05%3A33%3A42.764Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22cba749ec-cb84-11e8-8993-6be36895944f%22%2C%22v2SessionId%22%3A%22cba7bf17-cb84-11e8-a1a5-7dcf709e4827%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539063223126,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-982a6e873292be6cb66f.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1539063232857,
                "type": ""
            }
        ],
        "screenShotFile": "001400b1-0045-004e-00b7-009600ef0011.png",
        "timestamp": 1539063219608,
        "duration": 30358
    },
    {
        "description": "Save closest restaurant in home page and verify in saved pages|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "e8405ef7b68b6f4922713634b2660053",
        "instanceId": 7932,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%2281y6hkhqrbk9y7iwesbgppayw1539063184775%22%2C%22sessionId%22%3A%2242itfakd0odgyzs4nphuypspi1539063184774%22%2C%22sessionStartDateTime%22%3A%222018-10-09T05%3A33%3A04.774Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-09T05%3A34%3A13.970Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22cba749ec-cb84-11e8-8993-6be36895944f%22%2C%22v2SessionId%22%3A%22cba7bf17-cb84-11e8-a1a5-7dcf709e4827%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539063254488,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-982a6e873292be6cb66f.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1539063263350,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://res.cloudinary.com/grubhub/image/upload/w_255,h_132,f_auto,q_auto,dpr_auto,g_auto,c_fill/iewythyjgnaryloyufxy - Failed to load resource: the server responded with a status of 504 ()",
                "timestamp": 1539063268619,
                "type": ""
            }
        ],
        "screenShotFile": "002a00ae-00b6-00d3-000c-003600d400fb.png",
        "timestamp": 1539063251463,
        "duration": 26930
    },
    {
        "description": "Signing up with valid details and verifying the profile name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7cd2460215c6dba6c5f738432981586d",
        "instanceId": 1904,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22hmy87vdh6kfwtvvfu87j1ufeh1539063290339%22%2C%22sessionId%22%3A%22wylnqpg1xjni5a90zrnkgncfo1539063290337%22%2C%22sessionStartDateTime%22%3A%222018-10-09T05%3A34%3A50.337Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A6%2C%22dateTime%22%3A%222018-10-09T05%3A34%3A50.775Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%220a933abd-cb85-11e8-86e2-4db3ff9933ca%22%2C%22v2SessionId%22%3A%220a9388d6-cb85-11e8-85c6-b3a0d54774e3%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539063291858,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1539063295495,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1539063297138,
                "type": ""
            }
        ],
        "screenShotFile": "00bf0036-00fb-0038-00c6-002300c300f3.png",
        "timestamp": 1539063283834,
        "duration": 23656
    },
    {
        "description": "Signing up with same email id twice|Register at Eat 24",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7cd2460215c6dba6c5f738432981586d",
        "instanceId": 1904,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Expected 'vikash!' not to equal 'vikash!'."
        ],
        "trace": [
            "Error: Failed expectation\n    at Register.validateNotRegistered (D:\\e2etests\\PageObject\\SignUpPage.js:58:44)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:37:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22hmy87vdh6kfwtvvfu87j1ufeh1539063290339%22%2C%22sessionId%22%3A%22wylnqpg1xjni5a90zrnkgncfo1539063290337%22%2C%22sessionStartDateTime%22%3A%222018-10-09T05%3A34%3A50.337Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-09T05%3A35%3A11.743Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%220a933abd-cb85-11e8-86e2-4db3ff9933ca%22%2C%22v2SessionId%22%3A%220a9388d6-cb85-11e8-85c6-b3a0d54774e3%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539063312078,
                "type": ""
            }
        ],
        "screenShotFile": "00070026-0066-00dc-0058-00f000bc00be.png",
        "timestamp": 1539063309112,
        "duration": 24549
    },
    {
        "description": "Signing up without entering first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7cd2460215c6dba6c5f738432981586d",
        "instanceId": 1904,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22hmy87vdh6kfwtvvfu87j1ufeh1539063290339%22%2C%22sessionId%22%3A%22wylnqpg1xjni5a90zrnkgncfo1539063290337%22%2C%22sessionStartDateTime%22%3A%222018-10-09T05%3A34%3A50.337Z%22%2C%22userId%22%3A%2253906396%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-09T05%3A35%3A37.804Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%220a933abd-cb85-11e8-86e2-4db3ff9933ca%22%2C%22v2SessionId%22%3A%220a9388d6-cb85-11e8-85c6-b3a0d54774e3%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539063338156,
                "type": ""
            }
        ],
        "screenShotFile": "00ff0053-00a2-002a-0060-00ac004b00d2.png",
        "timestamp": 1539063335226,
        "duration": 6082
    },
    {
        "description": "Signing up without entering last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7cd2460215c6dba6c5f738432981586d",
        "instanceId": 1904,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001900db-00ce-0012-00fe-0095007d0075.png",
        "timestamp": 1539063342145,
        "duration": 5885
    },
    {
        "description": "Signing up without entering email|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7cd2460215c6dba6c5f738432981586d",
        "instanceId": 1904,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00fc00db-00b6-0004-006d-005b00a50082.png",
        "timestamp": 1539063348582,
        "duration": 5985
    },
    {
        "description": "Signing up without entering password|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7cd2460215c6dba6c5f738432981586d",
        "instanceId": 1904,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00940059-0081-0032-008a-00d200fc00ab.png",
        "timestamp": 1539063355122,
        "duration": 6172
    },
    {
        "description": "Signing up without entering anything|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7cd2460215c6dba6c5f738432981586d",
        "instanceId": 1904,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007c005c-008d-00c6-00e7-0068001f00a8.png",
        "timestamp": 1539063361921,
        "duration": 7415
    },
    {
        "description": "Signing up with entering numbers in first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7cd2460215c6dba6c5f738432981586d",
        "instanceId": 1904,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b400bf-002b-00a4-008d-005500bb00cc.png",
        "timestamp": 1539063369826,
        "duration": 5831
    },
    {
        "description": "Signing up with entering non-allowed characters in first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7cd2460215c6dba6c5f738432981586d",
        "instanceId": 1904,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00050045-0068-007c-001b-000100fd0083.png",
        "timestamp": 1539063376357,
        "duration": 6527
    },
    {
        "description": "Signing up with entering numbers in last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7cd2460215c6dba6c5f738432981586d",
        "instanceId": 1904,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ff0004-00e3-00b5-007b-0064006c00a3.png",
        "timestamp": 1539063383452,
        "duration": 6302
    },
    {
        "description": "Signing up with entering non-allowed characters in last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7cd2460215c6dba6c5f738432981586d",
        "instanceId": 1904,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d9001d-00e7-00ab-00f4-00f400200078.png",
        "timestamp": 1539063390424,
        "duration": 6991
    },
    {
        "description": "Signing up with entering invalid id |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7cd2460215c6dba6c5f738432981586d",
        "instanceId": 1904,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00db00d3-00c6-0024-005f-0094004b0064.png",
        "timestamp": 1539063397923,
        "duration": 6332
    },
    {
        "description": "Signing up with entering password as \"password\" |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7cd2460215c6dba6c5f738432981586d",
        "instanceId": 1904,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008900f7-00f4-007d-0010-001a002d00bd.png",
        "timestamp": 1539063404743,
        "duration": 6715
    },
    {
        "description": "Signing up with entering password less than 8 characters |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7cd2460215c6dba6c5f738432981586d",
        "instanceId": 1904,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00380076-00ff-0085-0092-006b00ea0011.png",
        "timestamp": 1539063411950,
        "duration": 6257
    },
    {
        "description": "Signing up with entering password more than 255 characters |Register at Eat 24",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "7cd2460215c6dba6c5f738432981586d",
        "instanceId": 1904,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, [at-msg-name=\"password\"])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, [at-msg-name=\"password\"])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as getText] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as getText] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Register.passwordLength (D:\\e2etests\\PageObject\\SignUpPage.js:138:26)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:116:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Signing up with entering password more than 255 characters \") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:113:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:11:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "00ad0089-00e8-0057-0094-00b40038005c.png",
        "timestamp": 1539063418780,
        "duration": 11816
    },
    {
        "description": "Find restuarant in particular region and check if it is displayed|Suite for Restaurant page",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "25133b6604bd16cc058e91e4378b7fb9",
        "instanceId": 8104,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.",
            "Failed: script timeout: result was not received in 11 seconds\n  (Session info: chrome=69.0.3497.100)\n  (Driver info: chromedriver=2.42.591088 (7b2b2dca23cca0862f674758c9a3933e685c27d5),platform=Windows NT 6.1.7601 SP1 x86_64)"
        ],
        "trace": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.\n    at Timeout._onTimeout (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4281:23)\n    at ontimeout (timers.js:498:11)\n    at tryOnTimeout (timers.js:323:5)\n    at Timer.listOnTimeout (timers.js:290:5)",
            "ScriptTimeoutError: script timeout: result was not received in 11 seconds\n  (Session info: chrome=69.0.3497.100)\n  (Driver info: chromedriver=2.42.591088 (7b2b2dca23cca0862f674758c9a3933e685c27d5),platform=Windows NT 6.1.7601 SP1 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at doSend.then.response (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30)\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: Protractor.waitForAngular() - Locator: By(css selector, input.addressInput-textInput)\n    at thenableWebDriverProxy.schedule (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at ProtractorBrowser.executeAsyncScript_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:425:28)\n    at angularAppRoot.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:456:33)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\nFrom: Task: <anonymous>\n    at pollCondition (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2195:19)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2191:7\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2190:22\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at Restaurant.findfoodatlocation (D:\\e2etests\\PageObject\\OrderFoodPage.js:52:13)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\OrderFoodTest.js:29:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"Find restuarant in particular region and check if it is displayed\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at Timeout.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4283:11)\n    at ontimeout (timers.js:498:11)\n    at tryOnTimeout (timers.js:323:5)\n    at Timer.listOnTimeout (timers.js:290:5)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\OrderFoodTest.js:26:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\OrderFoodTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://logx.optimizely.com/v1/events - Failed to load resource: net::ERR_CONNECTION_CLOSED",
                "timestamp": 1539063593437,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://logx.optimizely.com/v1/events - Failed to load resource: net::ERR_TIMED_OUT",
                "timestamp": 1539063593465,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22bala2nvoyrtcj564vlph1ex8a1539063635730%22%2C%22sessionId%22%3A%22ane1293k8lkcv98d776vduwpr1539063635729%22%2C%22sessionStartDateTime%22%3A%222018-10-09T05%3A40%3A35.729Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A9%2C%22dateTime%22%3A%222018-10-09T05%3A40%3A46.169Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22d87252e7-cb85-11e8-8ac9-39c984c8a985%22%2C%22v2SessionId%22%3A%22d87279fb-cb85-11e8-a514-1f14e4f3cc7e%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539063646525,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1539063650542,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1539063656153,
                "type": ""
            }
        ],
        "screenShotFile": "0088001e-00d8-0047-0093-002f00d0004e.png",
        "timestamp": 1539063552821,
        "duration": 130454
    },
    {
        "description": "Find restuarant in particular region and check if it is displayed|Suite for Restaurant page",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "94ac6036cd910248932eca0558d9e5d7",
        "instanceId": 7192,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22f6gkw3kl2h7mt75bf8juc8t4f1539063784289%22%2C%22sessionId%22%3A%22krixvdnuxshf4cc6k85g3asz41539063784287%22%2C%22sessionStartDateTime%22%3A%222018-10-09T05%3A43%3A04.287Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A6%2C%22dateTime%22%3A%222018-10-09T05%3A43%3A05.018Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2230fd4142-cb86-11e8-a1a5-438ec58ef49b%22%2C%22v2SessionId%22%3A%2230fddd8e-cb86-11e8-8c12-b9f4fd9c5753%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539063786096,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1539063789952,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1539063791484,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-982a6e873292be6cb66f.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1539063802097,
                "type": ""
            }
        ],
        "screenShotFile": "00540008-0068-0093-00eb-005a00c800f0.png",
        "timestamp": 1539063763222,
        "duration": 45039
    },
    {
        "description": "Find restuarant in particular region and order from 4 star|Suite for Restaurant page",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "94ac6036cd910248932eca0558d9e5d7",
        "instanceId": 7192,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22f6gkw3kl2h7mt75bf8juc8t4f1539063784289%22%2C%22sessionId%22%3A%22krixvdnuxshf4cc6k85g3asz41539063784287%22%2C%22sessionStartDateTime%22%3A%222018-10-09T05%3A43%3A04.287Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-09T05%3A43%3A32.659Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2230fd4142-cb86-11e8-a1a5-438ec58ef49b%22%2C%22v2SessionId%22%3A%2230fddd8e-cb86-11e8-8c12-b9f4fd9c5753%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539063813034,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-982a6e873292be6cb66f.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1539063823613,
                "type": ""
            }
        ],
        "screenShotFile": "0069006c-000e-000f-008e-002000d8002e.png",
        "timestamp": 1539063809869,
        "duration": 58054
    },
    {
        "description": "Sorting restaurant according to distance and verifying|Suite for Restaurant page",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "94ac6036cd910248932eca0558d9e5d7",
        "instanceId": 7192,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22f6gkw3kl2h7mt75bf8juc8t4f1539063784289%22%2C%22sessionId%22%3A%22krixvdnuxshf4cc6k85g3asz41539063784287%22%2C%22sessionStartDateTime%22%3A%222018-10-09T05%3A43%3A04.287Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-09T05%3A44%3A32.376Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2230fd4142-cb86-11e8-a1a5-438ec58ef49b%22%2C%22v2SessionId%22%3A%2230fddd8e-cb86-11e8-8c12-b9f4fd9c5753%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1539063873274,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-982a6e873292be6cb66f.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1539063883489,
                "type": ""
            }
        ],
        "screenShotFile": "00bd0052-0085-0049-0054-007f009b0054.png",
        "timestamp": 1539063869710,
        "duration": 19225
    }
];

    this.sortSpecs = function () {
        this.results = results.sort(function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) return -1;else if (a.sessionId > b.sessionId) return 1;

    if (a.timestamp < b.timestamp) return -1;else if (a.timestamp > b.timestamp) return 1;

    return 0;
});
    };

    this.sortSpecs();
});

app.filter('bySearchSettings', function () {
    return function (items, searchSettings) {
        var filtered = [];
        var prevItem = null;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.displaySpecName = false;

            countLogMessages(item);

            var hasLog = searchSettings.withLog && item.browserLogs && item.browserLogs.length > 0;
            if (searchSettings.description === '' ||
                (item.description && item.description.toLowerCase().indexOf(searchSettings.description.toLowerCase()) > -1)) {

                if (searchSettings.passed && item.passed || hasLog) {
                    checkIfShouldDisplaySpecName(prevItem, item);
                    filtered.push(item);
                    prevItem = item;
                } else if (searchSettings.failed && !item.passed && !item.pending || hasLog) {
                    checkIfShouldDisplaySpecName(prevItem, item);
                    filtered.push(item);
                    prevItem = item;
                } else if (searchSettings.pending && item.pending || hasLog) {
                    checkIfShouldDisplaySpecName(prevItem, item);
                    filtered.push(item);
                    prevItem = item;
                }

            }
        }

        return filtered;
    };
});

var isValueAnArray = function (val) {
    return Array.isArray(val);
};

var checkIfShouldDisplaySpecName = function (prevItem, item) {
    if (!prevItem) {
        item.displaySpecName = true;
        return;
    }

    if (getSpec(item.description) != getSpec(prevItem.description)) {
        item.displaySpecName = true;
        return;
    }
};

var getSpec = function (str) {
    var describes = str.split('|');
    return describes[describes.length - 1];
};

var countLogMessages = function (item) {
    if ((!item.logWarnings || !item.logErrors) && item.browserLogs && item.browserLogs.length > 0) {
        item.logWarnings = 0;
        item.logErrors = 0;
        for (var logNumber = 0; logNumber < item.browserLogs.length; logNumber++) {
            var logEntry = item.browserLogs[logNumber];
            if (logEntry.level === 'SEVERE') {
                item.logErrors++;
            }
            if (logEntry.level === 'WARNING') {
                item.logWarnings++;
            }
        }
    }
};
