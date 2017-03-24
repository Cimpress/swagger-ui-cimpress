'use strict';

var expect = require('chai').expect;
var webdriver = require('selenium-webdriver');
var driver = require('../driver');
var servers = require('../servers');
var until = webdriver.until;
var helpers = require('../helpers');

var specPath = helpers.parseSpecFilename(__filename);

describe('swagger 2.0 specification tests using petstore.json', function () {
  this.timeout(40 * 1000);

  var testTimeout = 1000;

  before((done) => {
    this.timeout(50 * 1000);
    servers.start(specPath, done);
  });

  afterEach(() =>{
    it('should not have any console errors', (done) => {
      driver.manage().logs().get('browser').then((browserLogs) => {
        var errors = [];
        browserLogs.forEach((log) => {
          // 900 and above is "error" level. Console should not have any errors
          if (log.level.value > 900) {
            console.log('browser error message:', log.message);
            errors.push(log);
          }
        });
        expect(errors).to.be.empty;
        done();
      });
    });
  });

  var expectedTitle = 'API Reference';
  it('should have the title “' + expectedTitle + '”', function () {
    return driver.wait(until.titleIs(expectedTitle), testTimeout);
  });

  var requiredElementsById = [
    'swagger-ui-container',
    'resources_container',
    'api_info',
    'resource_pet',
    'resource_store',
    'resource_user'
  ];
  requiredElementsById.forEach((id) => {
    it('should render element: ' + id, () => {
      var locator = webdriver.By.id(id);
      return driver.wait(until.elementLocated(locator), testTimeout);
    });
  });
  // nesting file inputs in labels causes the file upload to fail
  it('should not have a file input inside a label', function () {
    return driver.findElements(webdriver.By.css('label input[type="file"]')).then((i)=> {
      expect(i).to.be.empty;
    })
  })

  after(() => {
    servers.close()
    // driver.quit returns a promise that mocha will wait for
    return driver.quit()
  });
});
