# `Angular 4 Seed` — starter project for Angular 4 apps

This project is an application skeleton for a [Angular4][angular4] web app. You can use it
to quickly bootstrap your angular4 projects and dev environment for these projects.

The project is preconfigured to install the Angular 4 and a bunch of development and testing tools including linter which follows the angular style guide found in https://angular.io/styleguide.

### Usage

- Clone or fork this repository
```
git clone https://github.com/willyelm/angular4-seed.git
cd angular4-seed
```

- install dependencies
```
npm install
```

- fire up dev server
```
npm start
```
open browser to [`http://localhost:8080`](http://localhost:8080)


### Directory Layout

```
src/                    --> all of the source files for the application
  assets/               --> stylesheet files, images, etc
  app/           --> all app specific modules
    app.module.ts              --> app module declaration
    app.component.spec.ts      --> "version" value service tests
    app.component.ts           --> custom directive that returns the current app version
    app.component.pug          --> pug Template
    app.component.scss      --> sass style file
  main.ts                --> main bootstrap application
  index.pug            --> app layout file (the main pug template file of the app)
karma.conf.js         --> config file for running unit tests with Karma
protractor-conf.js    --> Protractor config file
e2e/            --> end-to-end tests
  app.po.ts          --> protractor page object file
  app.e2e-spec.ts    --> jasmine spec foe app module
```

### Running Unit Tests
```
npm test
```
### Running E2E Tests
```
npm run webdriver
npm run e2e
```


[angular4]: https://angular.io/
