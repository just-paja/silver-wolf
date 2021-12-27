# fantasion-backend

The API and administration backend for Fantasion. Written in Django.

## Requirements

Make sure, you're running current version of Python and have [Poetry](https://python-poetry.org/) installed.

## Installation

Install dependencies

```shell
poetry install
```

Create local database

```shell
poetry run ./manage.py migrate
```

## Run local server

```shell
poetry run ./manage.py runserver
```
