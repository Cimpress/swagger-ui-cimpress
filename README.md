![screenshot](screenshot.png)

# swagger-ui-cimpress

[![Build Status](https://travis-ci.org/Cimpress-MCP/swagger-ui-cimpress.svg?branch=master)](https://travis-ci.org/Cimpress-MCP/swagger-ui-cimpress)
[![codecov](https://codecov.io/gh/Cimpress-MCP/swagger-ui-cimpress/branch/master/graph/badge.svg)](https://codecov.io/gh/Cimpress-MCP/swagger-ui-cimpress)
[![NPM version](https://badge.fury.io/js/swagger-ui-cimpress.svg)](http://badge.fury.io/js/swagger-ui-cimpress)
[![Dependency Status](https://david-dm.org/Cimpress-MCP/swagger-ui-cimpress/status.svg)](https://david-dm.org/Cimpress-MCP/swagger-ui-cimpress)
[![devDependency Status](https://david-dm.org/Cimpress-MCP/swagger-ui-cimpress/dev-status.svg)](https://david-dm.org/Cimpress-MCP/swagger-ui-cimpress#info=devDependencies)

A swagger-ui fork with an easy to read, responsive three pane view. Used on https://developer.cimpress.io.

Swagger UI uses client-side Javascript (jQuery + Backbone) to download a swagger.json resource and make "Try It" requests to the described endpoints. You can learn more about the swagger-ui project at the upstream source: https://github.com/swagger-api/swagger-ui


## Acknowledgement

This is a fork of https://github.com/jensoleg/swagger-ui which is a fork of https://github.com/swagger-api/swagger-ui. There are many differences, including the build process and test definitions.


## Developers

Cimpress employees can deploy builds to Cimpress Open, but first it’s necessary to setup credentials.

    # Install aws-cli and configure credentials to right AWS account
    # For more info, see https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html
    $ pip install awsebcli --upgrade
    $ aws configure

    # Build the project
    $ yarn run build

    # Deploy to 'integration', 'staging', or 'production'
    $ yarn run deploy:integration
