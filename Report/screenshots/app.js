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
        "sessionId": "704afb945090859e3e74fea62710056e",
        "instanceId": 4148,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22wla1e4atv2nnt0lp2j3r13n381538976587068%22%2C%22sessionId%22%3A%22siw8pzx3do7sksle0lgoixpx81538976587068%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A29%3A47.068Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T05%3A29%3A47.947Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%222b66747b-cabb-11e8-982d-4f8340b85f89%22%2C%22v2SessionId%22%3A%222b66e9ac-cabb-11e8-afe9-bda66085afc3%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538976589874,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538976599421,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538976605170,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538976633410,
                "type": ""
            }
        ],
        "screenShotFile": "00a3006e-000a-0083-004c-005e00cd0044.png",
        "timestamp": 1538976580700,
        "duration": 68132
    },
    {
        "description": "Find restuarant in particular region and order from 4 star|Suite for Restaurant page",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "704afb945090859e3e74fea62710056e",
        "instanceId": 4148,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: Wait timed out after 10011ms"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 10011ms\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at Register.createyouraccount (D:\\e2etests\\PageObject\\SignUpPage.js:72:13)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\OrderFoodTest.js:34:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"Find restuarant in particular region and order from 4 star\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\OrderFoodTest.js:32:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\OrderFoodTest.js:12:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "00f100f4-0013-008d-0028-007900cb005a.png",
        "timestamp": 1538976649647,
        "duration": 16323
    },
    {
        "description": "Sorting restaurant according to distance and verifying|Suite for Restaurant page",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "704afb945090859e3e74fea62710056e",
        "instanceId": 4148,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: Wait timed out after 10014ms"
        ],
        "trace": [
            "TimeoutError: Wait timed out after 10014ms\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)\nFrom: Task: <anonymous wait>\n    at scheduleWait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at thenableWebDriverProxy.wait (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:59:33)\n    at ProtractorBrowser.to.(anonymous function) [as wait] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:67:16)\n    at Register.createyouraccount (D:\\e2etests\\PageObject\\SignUpPage.js:72:13)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\OrderFoodTest.js:43:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\nFrom: Task: Run it(\"Sorting restaurant according to distance and verifying\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\OrderFoodTest.js:41:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\OrderFoodTest.js:12:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "0080001f-0048-008d-0040-0001007e0006.png",
        "timestamp": 1538976666653,
        "duration": 14827
    },
    {
        "description": "Open a restaurant page and save it|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0744bd7e8e85bd918f1b9eb6d6866120",
        "instanceId": 6452,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22lzm5c1onktmcxt1vtg7051ukf1538976691937%22%2C%22sessionId%22%3A%22n18vluukwi1cbuamnjloax0p61538976691937%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A31%3A31.937Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T05%3A31%3A32.920Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2269e831cf-cabb-11e8-bd69-5b063488fe35%22%2C%22v2SessionId%22%3A%2269e858d1-cabb-11e8-a620-214ba611cf79%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538976694922,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538976699177,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538976700815,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538976710991,
                "type": ""
            }
        ],
        "screenShotFile": "00030034-0067-00f8-0050-00d8005b0057.png",
        "timestamp": 1538976685345,
        "duration": 39911
    },
    {
        "description": "Find restuarant in particular region and check if it is displayed|Suite for Restaurant page",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "86a0b27ee17dabceb23e1c229c5a95de",
        "instanceId": 7492,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22puptk3vsbbgk1pbfvm4l0946l1538976742244%22%2C%22sessionId%22%3A%229ljvpv5zvgru5ghw4h1ogci1y1538976742243%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A32%3A22.242Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A3%2C%22dateTime%22%3A%222018-10-08T05%3A32%3A22.252Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2287e46ef9-cabb-11e8-878f-addbe658400e%22%2C%22v2SessionId%22%3A%2287e4bd1d-cabb-11e8-a117-0f3cdba44e0b%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538976743705,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538976748476,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538976749872,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538976760148,
                "type": ""
            }
        ],
        "screenShotFile": "00a800ff-00f6-007f-00a5-009a00ed00a3.png",
        "timestamp": 1538976734917,
        "duration": 32031
    },
    {
        "description": "Find restuarant in particular region and check if it is displayed|Suite for Restaurant page",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "b1b87337673f6e72bd6710023cbb0cb6",
        "instanceId": 8696,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22ze0mmog7dtbefjk0mqv5944jj1538976876701%22%2C%22sessionId%22%3A%22ahdcbz3l0zp1su7t1injw1w1y1538976876700%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A34%3A36.700Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A6%2C%22dateTime%22%3A%222018-10-08T05%3A34%3A37.392Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22d808f18d-cabb-11e8-9f5a-4f1e692f3407%22%2C%22v2SessionId%22%3A%22d809189d-cabb-11e8-9f25-a5ba63cb94aa%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538976878558,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538976883126,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538976884389,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538976893779,
                "type": ""
            }
        ],
        "screenShotFile": "00250029-0069-00d8-00d4-0018001700e5.png",
        "timestamp": 1538976870940,
        "duration": 27874
    },
    {
        "description": "Find restuarant in particular region and order from 4 star|Suite for Restaurant page",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "b1b87337673f6e72bd6710023cbb0cb6",
        "instanceId": 8696,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22ze0mmog7dtbefjk0mqv5944jj1538976876701%22%2C%22sessionId%22%3A%22ahdcbz3l0zp1su7t1injw1w1y1538976876700%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A34%3A36.700Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T05%3A35%3A02.971Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22d808f18d-cabb-11e8-9f5a-4f1e692f3407%22%2C%22v2SessionId%22%3A%22d809189d-cabb-11e8-9f25-a5ba63cb94aa%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538976903369,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538976912617,
                "type": ""
            }
        ],
        "screenShotFile": "002100d7-0092-00c7-0097-00bc00ba009b.png",
        "timestamp": 1538976900339,
        "duration": 49414
    },
    {
        "description": "Sorting restaurant according to distance and verifying|Suite for Restaurant page",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "b1b87337673f6e72bd6710023cbb0cb6",
        "instanceId": 8696,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22ze0mmog7dtbefjk0mqv5944jj1538976876701%22%2C%22sessionId%22%3A%22ahdcbz3l0zp1su7t1injw1w1y1538976876700%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A34%3A36.700Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T05%3A35%3A54.140Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22d808f18d-cabb-11e8-9f5a-4f1e692f3407%22%2C%22v2SessionId%22%3A%22d809189d-cabb-11e8-9f25-a5ba63cb94aa%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538976954513,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538976965605,
                "type": ""
            }
        ],
        "screenShotFile": "00d6000c-0070-00f1-0047-00c500c80078.png",
        "timestamp": 1538976951452,
        "duration": 21139
    },
    {
        "description": "Open a restaurant page and save it|Saved Restaurant",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "8b4b00d8afe67fb94db0176abc6c32e2",
        "instanceId": 5276,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, a.ghs-goToCreateAccount)"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, a.ghs-goToCreateAccount)\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as click] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Register.createyouraccount (D:\\e2etests\\PageObject\\SignUpPage.js:74:19)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:28:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Open a restaurant page and save it\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:26:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SavedRestaurantTest.js:13:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22dbbvyp0gq0dj4i3iebspn0out1538976982670%22%2C%22sessionId%22%3A%22vdimzsisy7og0j27b8g581diu1538976982668%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A36%3A22.668Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A6%2C%22dateTime%22%3A%222018-10-08T05%3A36%3A23.476Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%2217326081-cabc-11e8-9a6c-cfa356a35bf3%22%2C%22v2SessionId%22%3A%2217328797-cabc-11e8-90d2-ffc4d50c8fb3%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538976984277,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538976991110,
                "type": ""
            }
        ],
        "screenShotFile": "001300c7-00db-0009-0051-00d5009c00af.png",
        "timestamp": 1538976976991,
        "duration": 14461
    },
    {
        "description": "Signing up with valid details and verifying the profile name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22ta5247v21e6vefgk7sr49n98t1538977004880%22%2C%22sessionId%22%3A%224kc3imcknqfq3ht6xszp8fbv51538977004878%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A36%3A44.878Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A3%2C%22dateTime%22%3A%222018-10-08T05%3A36%3A44.891Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22246e704c-cabc-11e8-a0cd-49b50da5fd3b%22%2C%22v2SessionId%22%3A%22246ee571-cabc-11e8-9c5f-0f85285e8681%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538977006712,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538977010766,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538977011955,
                "type": ""
            }
        ],
        "screenShotFile": "009b0036-00d8-00b4-006c-005000bf0038.png",
        "timestamp": 1538976995817,
        "duration": 25492
    },
    {
        "description": "Signing up with same email id twice|Register at Eat 24",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Expected 'vikash!' not to equal 'vikash!'."
        ],
        "trace": [
            "Error: Failed expectation\n    at Register.validateNotRegistered (D:\\e2etests\\PageObject\\SignUpPage.js:58:44)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:36:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22ta5247v21e6vefgk7sr49n98t1538977004880%22%2C%22sessionId%22%3A%224kc3imcknqfq3ht6xszp8fbv51538977004878%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A36%3A44.878Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T05%3A37%3A05.572Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22246e704c-cabc-11e8-a0cd-49b50da5fd3b%22%2C%22v2SessionId%22%3A%22246ee571-cabc-11e8-9c5f-0f85285e8681%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538977025923,
                "type": ""
            }
        ],
        "screenShotFile": "00ff0015-003c-00a2-0042-002e00f5009b.png",
        "timestamp": 1538977022925,
        "duration": 24631
    },
    {
        "description": "Signing up without entering first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22ta5247v21e6vefgk7sr49n98t1538977004880%22%2C%22sessionId%22%3A%224kc3imcknqfq3ht6xszp8fbv51538977004878%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A36%3A44.878Z%22%2C%22userId%22%3A%2253851398%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T05%3A37%3A31.624Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%22246e704c-cabc-11e8-a0cd-49b50da5fd3b%22%2C%22v2SessionId%22%3A%22246ee571-cabc-11e8-9c5f-0f85285e8681%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538977051960,
                "type": ""
            }
        ],
        "screenShotFile": "00180063-00c0-002e-0070-0024001800d0.png",
        "timestamp": 1538977049136,
        "duration": 6049
    },
    {
        "description": "Signing up without entering last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0069007b-003c-00c2-00ca-004f0058007c.png",
        "timestamp": 1538977055690,
        "duration": 5317
    },
    {
        "description": "Signing up without entering email|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0063000d-0070-0078-00b7-0079007100fe.png",
        "timestamp": 1538977061472,
        "duration": 5977
    },
    {
        "description": "Signing up without entering password|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004f0075-0044-000c-0065-00a9008d0024.png",
        "timestamp": 1538977067946,
        "duration": 6117
    },
    {
        "description": "Signing up without entering anything|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00210053-00d0-00b1-0084-005300db00fb.png",
        "timestamp": 1538977074569,
        "duration": 5238
    },
    {
        "description": "Signing up with entering numbers in first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009200d5-0003-001f-009b-0003000b0085.png",
        "timestamp": 1538977080296,
        "duration": 6367
    },
    {
        "description": "Signing up with entering non-allowed characters in first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f100f7-0062-00e6-00e6-00e2000900e6.png",
        "timestamp": 1538977087137,
        "duration": 5642
    },
    {
        "description": "Signing up with entering numbers in last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b500d4-0058-00a6-0074-003400bc00cf.png",
        "timestamp": 1538977093259,
        "duration": 5536
    },
    {
        "description": "Signing up with entering non-allowed characters in last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009000fa-0051-001e-006c-003400c300cd.png",
        "timestamp": 1538977099306,
        "duration": 5503
    },
    {
        "description": "Signing up with entering invalid id |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d50011-00dc-0049-0062-00e700d300d1.png",
        "timestamp": 1538977105321,
        "duration": 4517
    },
    {
        "description": "Signing up with entering password as \"password\" |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00dd0064-006b-00cc-0062-00de005e0081.png",
        "timestamp": 1538977110336,
        "duration": 4481
    },
    {
        "description": "Signing up with entering password less than 8 characters |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00c80021-0047-0060-00ee-00ae006a002c.png",
        "timestamp": 1538977115284,
        "duration": 5350
    },
    {
        "description": "Signing up with entering password more than 255 characters |Register at Eat 24",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "ad2677221577282a078e3508defdbc14",
        "instanceId": 7300,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, [at-msg-name=\"password\"])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, [at-msg-name=\"password\"])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as getText] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as getText] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Register.passwordLength (D:\\e2etests\\PageObject\\SignUpPage.js:138:26)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:115:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Signing up with entering password more than 255 characters \") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:112:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:10:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "00db00b2-00e3-00f8-007c-00a100b4001c.png",
        "timestamp": 1538977121128,
        "duration": 10570
    },
    {
        "description": "Open a restaurant page and save it|Saved Restaurant",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "fb19cd7e62ad0d7c967f4f565ca47df7",
        "instanceId": 7320,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22x7wn8reeqr7pjzsj319nuivqj1538977142711%22%2C%22sessionId%22%3A%224qlmd6m8ypvuavhjtf96eqly21538977142710%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A39%3A02.710Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T05%3A39%3A03.416Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%227696b213-cabc-11e8-922e-23c63486ace3%22%2C%22v2SessionId%22%3A%2276970036-cabc-11e8-970f-89be07c41b7a%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538977145252,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538977150607,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538977152318,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://assets.eat24.com/js/main-b44a3ed7bcc35ddf501a.js 0:339715 \"No chunk found for: RestaurantModule\"",
                "timestamp": 1538977161552,
                "type": ""
            }
        ],
        "screenShotFile": "00300081-0050-005a-0053-00630041001c.png",
        "timestamp": 1538977136446,
        "duration": 39802
    },
    {
        "description": "Signing up with valid details and verifying the profile name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22707ih7r8zdemxsssh2wjvvs2s1538977188015%22%2C%22sessionId%22%3A%22idpby8gla3el3or0iarjtkbu01538977188015%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A39%3A48.014Z%22%2C%22userId%22%3A%22%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A7%2C%22dateTime%22%3A%222018-10-08T05%3A39%3A48.878Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%229197d7b2-cabc-11e8-bd61-8bbd8151d547%22%2C%22v2SessionId%22%3A%229197fecb-cabc-11e8-be17-d1e3ebd78461%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538977191119,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ 152:16575 Uncaught SyntaxError: Unexpected token h in JSON at position 0",
                "timestamp": 1538977195184,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://www.eat24.com/ - [DOM] Found 2 elements with non-unique id #navi-form: (More info: https://goo.gl/9p2vKq) %o %o",
                "timestamp": 1538977196732,
                "type": ""
            }
        ],
        "screenShotFile": "004e006b-0026-00d9-002b-002d00c20026.png",
        "timestamp": 1538977182107,
        "duration": 24179
    },
    {
        "description": "Signing up with same email id twice|Register at Eat 24",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Expected 'vikash!' not to equal 'vikash!'."
        ],
        "trace": [
            "Error: Failed expectation\n    at Register.validateNotRegistered (D:\\e2etests\\PageObject\\SignUpPage.js:58:44)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:36:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2974:25)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22707ih7r8zdemxsssh2wjvvs2s1538977188015%22%2C%22sessionId%22%3A%22idpby8gla3el3or0iarjtkbu01538977188015%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A39%3A48.014Z%22%2C%22userId%22%3A%220%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T05%3A40%3A10.409Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%229197d7b2-cabc-11e8-bd61-8bbd8151d547%22%2C%22v2SessionId%22%3A%229197fecb-cabc-11e8-be17-d1e3ebd78461%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538977210741,
                "type": ""
            }
        ],
        "screenShotFile": "0045005e-0041-0045-001e-007d004700fe.png",
        "timestamp": 1538977207616,
        "duration": 23540
    },
    {
        "description": "Signing up without entering first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://clickstream.grubhub.com/event.gif?event=%7B%22name%22%3A%22reverse-geocoded-users-ip%22%2C%22platform%22%3A%22umami%20eat24%22%2C%22browserId%22%3A%22707ih7r8zdemxsssh2wjvvs2s1538977188015%22%2C%22sessionId%22%3A%22idpby8gla3el3or0iarjtkbu01538977188015%22%2C%22sessionStartDateTime%22%3A%222018-10-08T05%3A39%3A48.014Z%22%2C%22userId%22%3A%2253851438%22%2C%22referrer%22%3A%22%22%2C%22userAgent%22%3A%22Mozilla/5.0%20%28Windows%20NT%206.1%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/69.0.3497.100%20Safari/537.36%22%2C%22protocol%22%3A%22https%3A%22%2C%22hostname%22%3A%22www.eat24.com%22%2C%22pathname%22%3A%22/%22%2C%22queryParams%22%3A%22%22%2C%22view%22%3A%22homepage%20logged%20out%22%2C%22data%22%3A%5B%5D%2C%22sequence%22%3A2%2C%22dateTime%22%3A%222018-10-08T05%3A40%3A35.453Z%22%2C%22timezone%22%3A-330%2C%22v2BrowserId%22%3A%229197d7b2-cabc-11e8-bd61-8bbd8151d547%22%2C%22v2SessionId%22%3A%229197fecb-cabc-11e8-be17-d1e3ebd78461%22%7D - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1538977235824,
                "type": ""
            }
        ],
        "screenShotFile": "005d008b-0035-0008-00a6-0091003400a7.png",
        "timestamp": 1538977232661,
        "duration": 6786
    },
    {
        "description": "Signing up without entering last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001900c2-001b-00b2-0069-00da007a003c.png",
        "timestamp": 1538977239947,
        "duration": 5672
    },
    {
        "description": "Signing up without entering email|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0095008b-005c-0051-00ca-0091001e0078.png",
        "timestamp": 1538977246103,
        "duration": 6599
    },
    {
        "description": "Signing up without entering password|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001000d5-0068-0027-005d-002c0067002a.png",
        "timestamp": 1538977253205,
        "duration": 6024
    },
    {
        "description": "Signing up without entering anything|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004b00a4-00d2-003d-0096-008900b40022.png",
        "timestamp": 1538977259722,
        "duration": 5564
    },
    {
        "description": "Signing up with entering numbers in first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a700ae-0062-005d-0010-00d400ad0038.png",
        "timestamp": 1538977265742,
        "duration": 4815
    },
    {
        "description": "Signing up with entering non-allowed characters in first name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007900c8-0044-008b-00c8-00b400c9003f.png",
        "timestamp": 1538977271039,
        "duration": 4575
    },
    {
        "description": "Signing up with entering numbers in last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "003a00e4-0010-003e-0000-006c00ab00a4.png",
        "timestamp": 1538977276127,
        "duration": 7118
    },
    {
        "description": "Signing up with entering non-allowed characters in last name|Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00150071-003a-0003-00ac-00d1009e0041.png",
        "timestamp": 1538977283725,
        "duration": 7675
    },
    {
        "description": "Signing up with entering invalid id |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004500a9-00dc-003e-00dc-005d001100f4.png",
        "timestamp": 1538977292016,
        "duration": 5380
    },
    {
        "description": "Signing up with entering password as \"password\" |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004900aa-0044-00d9-009e-000500d8008a.png",
        "timestamp": 1538977297910,
        "duration": 5719
    },
    {
        "description": "Signing up with entering password less than 8 characters |Register at Eat 24",
        "passed": true,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00890092-0058-00c2-00d2-006c00120031.png",
        "timestamp": 1538977304116,
        "duration": 5843
    },
    {
        "description": "Signing up with entering password more than 255 characters |Register at Eat 24",
        "passed": false,
        "pending": false,
        "os": "Windows NT",
        "sessionId": "0d79d668c3a553f91197c093bad36a81",
        "instanceId": 9036,
        "browser": {
            "name": "chrome",
            "version": "69.0.3497.100"
        },
        "message": [
            "Failed: No element found using locator: By(css selector, [at-msg-name=\"password\"])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, [at-msg-name=\"password\"])\n    at elementArrayFinder.getWebElements.then (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27)\n    at ManagedPromise.invokeCallback_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at asyncRun (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at <anonymous>\n    at process._tickCallback (internal/process/next_tick.js:189:7)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.(anonymous function).args [as getText] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.(anonymous function).args [as getText] (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at Register.passwordLength (D:\\e2etests\\PageObject\\SignUpPage.js:138:26)\n    at UserContext.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:115:18)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:112:25\n    at new ManagedPromise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1077:7)\n    at ControlFlow.promise (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2505:12)\n    at schedulerExecute (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:95:18)\n    at TaskQueue.execute_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\nFrom: Task: Run it(\"Signing up with entering password more than 255 characters \") in control flow\n    at UserContext.<anonymous> (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at shutdownTask_.MicroTask (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:112:5)\n    at addSpecsToSuite (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\mindfire\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (D:\\e2etests\\Test\\SignUpTest.js:10:1)\n    at Module._compile (module.js:653:30)\n    at Object.Module._extensions..js (module.js:664:10)\n    at Module.load (module.js:566:32)\n    at tryModuleLoad (module.js:506:12)"
        ],
        "browserLogs": [],
        "screenShotFile": "00f6003f-0094-0082-0016-003300190023.png",
        "timestamp": 1538977310449,
        "duration": 10232
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
