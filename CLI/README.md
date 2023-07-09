# LimePlace CLI

CLI tool to interact with LimePlace contract.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [License](#license)

## Installation

* clone the repository
* create .env form .env.example (just rename it, it has default config)
* navigate to /CLI folder and install node modules `npm install`
* start index.ts with typescript node `ts-node index.ts`
* you will need mobile Metamask to authenticate!


## Usage

Use keyboard to navigate between different menus.


Crete, update and cancel listings.


Crete collections and tokens to list.

## Features

* Create collection.
* Create token. Add image - upload it to IPFS
* List tokens. 
* Edit price.
* Cancel listing.
* List tokens that are minted somewhere else. (Tokens should implement ERC721)
* Buy tokens. 
* View list of collections. (search|filter|sort)
* View list of listings. (search|filter|sort)
* Preview of listings
* Owner can withdrew listing fees of sold tokens.

## License

MIT