# Fantasion interface | https://fantasion.cz

This is a web interface for Fantasion, a non-profit company that runs summer camps for children in Czechia.

## Components

* [fantasion-backend](./packages/fantasion-backend) Django driven API and admin interface
* [fantasion-public](./packages/fantasion-public) Cloud Function driven public websitei

## See also

* [User roles](./packages/fantasion-backend/docs/user-roles.md)

## Requirements

This project requires you to have current version of Python and Node.js installed. You will also need [Poetry](https://python-poetry.org/) and [npm](https://npmjs.com/).

## Installation

Install dependencies with npm. It should trigger installation of Python dependencies as well.

```shell
npm ci
```

## Running

To run the backend, use

```shell
npm run backend
```

To run the website, use

```shell
npm run web
```

Obviously, you will need the backend running for the website to work.
