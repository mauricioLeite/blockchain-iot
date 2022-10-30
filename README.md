# Blockchain IoT
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Simple client side using blockchain system to manage iot devices network

## Prerequisites
   - Docker should be installed (version 20.10.20 is used on tests).
   - Docker Compose should be installed (version 1.29.2 is used on tests).

## Running

After clone the repository, create a `.env` file based on `.env.example`.

Build a new image, create and up the container:
```bash
make up
```

Using another terminal, log on shell container:
```bash
make sh
```

Inside Docker containet start dev server:
```bash
yarn dev
```

## License
Distributed under the GPL v3 License. See `LICENSE.md` for more information.