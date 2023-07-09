# LimePlaceApi

This api has indexer, that will found all emitted events from LimePlace contract. 

It will also listen for any new one.


All events will be parsed and inserted into database.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [License](#license)

## Installation

* clone the repository
* create .env form .env.example (rename it and set your Infura key. By default it is set to use Sepolia test net)
* navigate to /API folder and install node modules `npm install`
* navigate to /API/docker and run `docker-compose up -d`
* if you want to change network: 

update .env file and restart docker containers with detaching of volumes `docker-compose down -v`
* wait server to start, and parse old events
* open `localhost:3000`


## Usage

This api need to be running inorder to use CLI client!

It's endpoints is used by CLI to gather information about listings and collections.

## Features

* Parse LimePlace contract events.
* Serve data to CLI
* All endpoints are documented in Swagger and can be tested on [Link localhost:3000](http://localhost:3000)

## License

MIT
