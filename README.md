# AND Library REST API

REST API built in NodeJS with Express framework.
Pet project for introduction to Node and its ecosystem.

## Install

1. Clone repo
2. `yarn install`

## Run
### Development

`yarn start`

### Unit Tests

* `yarn test` - runs all tests
* `yarn test-watch` - runs all tests in watch mode
* `jest src/app/models` - runs all tests under models 

### Integration Tests

1. Start mongo DB instance `docker run -p 27017:27017 mongo`
2. Run tests jest test/integration/

## Libraries

* <a href="https://yarnpkg.com/en/">Yarn</a> - For package management and execution
* <a href="https://www.npmjs.com/package/winston">Winston</a> - For logging
* <a href="https://www.npmjs.com/package/dotenv">Dotenv</a> - For environment variables support
* <a href="https://github.com/alonronin/mockingoose">Mockingoose</a> - Mocking Mongoose Models

## Battles

* Mongoose connections were left open when running integration tests which would leave Jest hanging. Add to explicitly close the mongoose connection (and force it!). https://github.com/facebook/jest/issues/3602

