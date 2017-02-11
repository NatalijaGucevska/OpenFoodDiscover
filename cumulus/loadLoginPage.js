
console.log('Get latest Cumulus data');

var page = require('webpage').create();
var _ = require('lodash');
var moment = require('moment');
var testindex = 0;
var loadInProgress = false;

phantom.onError = function(msg, trace) {
    console.log(msg);
    trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
    });
};


page.onError = function (msg, trace) {
    console.log(msg);
    trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
    });
};

// https://www.migros.ch/fr/ma-migros/cumulus/tickets-de-caisse/avec-cumulus.html?dateFrom=16.01.2017&dateTo=29.01.2017&formsubmit=
// https://www.migros.ch/fr/ma-migros/cumulus/tickets-de-caisse/avec-cumulus.html?formsubmit=&dateFrom=10.02.2017&dateTo=27.01.2017

const LOGIN_PAGE = "https://login.migros.ch/login";
const HISTORY_PAGE = "https://www.migros.ch/fr/ma-migros/cumulus/tickets-de-caisse/avec-cumulus.html?formsubmit=";
const DOWNLOAD_ENDPOINT = "https://www.migros.ch/service/avantaReceiptExport/csv.csv";

const NO_RECEIPT_FOUND = "Malheureusement aucun ticket de caisse n’est disponible.";

const SETTINGS = {
    username: "",
    password: "",
};

var formatDate = function(date) { return date.format('YYYY[-]MM[-]DD'); };

//var date = moment('2017-07-15');
var date = moment('2016-07-15');
var today = formatDate(date);
var fourteenDaysAgo = formatDate(date.subtract(150, 'days'));

console.log("from", fourteenDaysAgo, "to", today);

var historyUrl = [
    HISTORY_PAGE,
    "&dateFrom=",
    fourteenDaysAgo,
    "&dateTo=",
    today
].join("");

console.log(historyUrl);

phantom.cookieEnabled = true;
phantom.javascriptEnabled = true;

page.settings.userAgent = "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0";
page.settings.javascriptEnabled = true;
page.viewportSize = { width: 1920, height: 1080 };

console.log('Get latest Cumulus data');

var ids = [];

var openPageHandler = function(i) {
    return function() {
        console.log("open page", i);
        page.open(historyUrl + "&p=" + i, function (status) {});
    };
};

var downloadHandler = function(start) {
    return function() {
        var download = {
            language: 'fr',
            details: 'true',
            sort: 'dateDsc'
        };

        for(var i = 0; i < 10; i++) {
            download["checkbox" + (i + 1)] = ids[i + start * 10];
        }

        request = ""

        var formData = _.map(download, function(v, k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(v);
        }).join("&");

        page.customHeaders = {
            Host:"www.migros.ch",
            Origin:"https://www.migros.ch",
            Referer:"https://www.migros.ch/fr/ma-migros/cumulus/tickets-de-caisse/avec-cumulus.html?formsubmit=&dateFrom=2016-06-01&dateTo=2016-08-15&p=2",
            'Content-Length': formData.length,
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        page.open(DOWNLOAD_ENDPOINT, 'post', formData, function (status) {
            console.log(status);
        });
    };
};

var getTheIdsHandler = function(i) {
    return function() {
        setTimeout(function() {
            console.log("get ids", i);
            loadInProgress = true;
            var newData = page.evaluate(function () {

                var ids = [];
                var elements = document.querySelectorAll('table input[type="checkbox"]:not([name="checkbox-all"])');
                Array.prototype.forEach.call(elements, function (checkbox) {
                    ids.push(checkbox.value);
                });
                return ids;
            });

            newData.forEach(function (x) {
                console.log(x);
                ids.push(x);
            });
            loadInProgress = false;
        }, 500);
    }
};

var steps = [];
steps = [
    function() {
        console.log('step 1 - open login form');
        page.open(LOGIN_PAGE, function(status) {
            console.log("status", status);
        });
    },
    function() {
        console.log('step 2 - fill and submit form');
        page.evaluate(function(settings) {
            const form = document.querySelector('.t-login form');
            form.username.value = settings.username;
            form.password.value = settings.password;
            form.submit();
        }, SETTINGS);
    },
    function() {
        console.log('step 3 - move to cumulus');
        page.open(historyUrl, function(status) {
            console.log("status", status);
        });
    },
    function() {
        console.log('step 4 - screenshot');
        page.render("truc2.png");
    },
    function() {
        console.log('step 5 - click to csv');
        loadInProgress = true;
        var notFound = _.includes(page.plainText, NO_RECEIPT_FOUND);
        console.log('not found', notFound);

        if(notFound) {
            loadInProgress = false;
        }
        else {
            console.log("will load localJs.js");

            var paginationLinks = page.evaluate(function () {
                var pageNumbers = [];
                var elements = document.querySelectorAll('[aria-label="Seite"]');
                Array.prototype.forEach.call(elements, function(div) {
                    var page = div.getAttribute("data-value");

                    if(page)
                        pageNumbers.push(parseInt(page, 10));
                });

                return { pageNumbers: pageNumbers, amount: elements.length};
            });

            // 20160810_174403_0063910_307_6544

            var pageNumber = _.max(paginationLinks.pageNumbers);
            var amount = paginationLinks.amount;

            console.log('amount', amount);

            var data = [];
            if(amount === 0) {
                data = page.evaluate(function() {
                    var ids = [];
                    var elements = document.querySelectorAll('table input[type="checkbox"]:not(.checkbox-all)');
                    Array.prototype.forEach.call(elements, function(checkbox) {
                        ids.push(checkbox.value);
                    });
                    return ids;
                });
                console.log("data", data.length);
                loadInProgress = false;
            }
            else {
                // open each tab and gets the ids
                for(var i = 2; i < amount; i++) {
                    steps.push(openPageHandler(i));
                    steps.push(getTheIdsHandler(i));
                }
                for(i = 0; i < amount; i++) {
                    steps.push(downloadHandler(i));
                }
                loadInProgress = false;
            }
        }
    }
];

var executeRequestsStepByStep = function() {
    //console.log(loadInProgress);
    if (loadInProgress == false && typeof steps[testindex] == "function") {
        //console.log("step " + (testindex + 1));
        steps[testindex]();
        testindex++;
    }
    if (loadInProgress == false && typeof steps[testindex] != "function") {
        console.log("test complete!");
        phantom.exit();
    }
    setTimeout(executeRequestsStepByStep, 50);
};

executeRequestsStepByStep();

page.onLoadStarted = function() {
    loadInProgress = true;
    console.log('  loading started');
};
page.onLoadFinished = function() {
    loadInProgress = false;
    console.log('  loading finished');
};
page.onConsoleMessage = function(msg) {
    console.log(msg);
};



page.onResourceError = function(resourceError) {
    console.log('= onResourceError()');
    console.log('  - unable to load url: "' + resourceError.url + '"');
    console.log('  - error code: ' + resourceError.errorCode + ', description: ' + resourceError.errorString );
};

page.onResourceRequested = function(requestData, networkRequest)
{
    console.log(JSON.stringify(requestData));
    console.log(JSON.stringify(networkRequest));
};
