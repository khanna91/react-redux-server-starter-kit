React Redux Server Starter Kit
=========

This starter kit is designed to get you up and running with a bunch of awesome new front-end technologies, all on top of a configurable, feature-rich webpack build system that's already setup to provide hot reloading, CSS preprocessing with Sass, unit testing, code coverage reports, bundle splitting, and more.

## Requirements
* react `^v5.11.0`
* npm `^3.10.8`

## Getting Started

After confirming that your development environment meets the specified [requirements](#requirements), you can create a new project based on `react-redux-server-starter-kit` in one of two ways:

### Install from source

First, clone the project:

```bash
$ git clone https://github.com/khanna91/react-redux-server-starter-kit <my-project-name>
$ cd <my-project-name>
```

Then install dependencies and check to see it works

```bash
$ npm install                   # Install project dependencies
$ npm run build-dev             # Compile and build assets and all in dev mode
$ npm run build-prod            # Compile and build assets and all in prod mode
$ npm start                     # Starts the server and launch app
```

## Application Structure

The application structure presented in this boilerplate is **fractal**, where functionality is grouped primarily by feature rather than file type. Please note, however, that this structure is only meant to serve as a guide, it is by no means prescriptive. That said, it aims to represent generally accepted guidelines and patterns for building scalable applications.

```
.
├── bin                      # Build/Start scripts
├── common                   # Common Utils and other utilities/services
├── config                   # Project configuration settings
├── gulp                     # Gulp task to compile and build client side scripts
├── middleware               # Functions that control/modify application’s request-response cycle
├── routes                   # Definition of application end points (URIs) and how they respond to client requests
├── src                      # Application source code
│   ├── components           # Global Reusable Container Components
│   ├── container            # Connect components to actions and store
│   ├── pages                # Components that dictate major page structure
│   ├── reducers             # Collections of reducers/constants/actions
│   ├── theme                # Application-wide styles (generally settings)
│   ├── app-client.js        # Client side javascript template layout
│   └── app-server.js        # Global variable to define all the pages of app
├── static                   # Contains all the static files which needs to serve like fonts, images, vendor css & vendor js
├── views                    # Contains ejs files
├── app.js                   # Entry point of application
└── webpack.config.js        # Webpack config file for local(dev) and production
```

## Run Application locally

```bash
$ http://localhost:3002
```

## Thank You
