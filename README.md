# AR-music
Web AR application that let user interact with instruments to produce sounds and link gestures to sounds.


This project has been carried out during our interships at [OCTO Technology](https://www.octo.com/).

## 👁️&nbsp; Demo

The demo is [here](https://elkokonut.github.io/AR-music/index.html).

## 🔑&nbsp; Prerequisites

- yarn v1.22.18

## 🚀&nbsp; Installation

1. Clone the repository

    ```bash
    git clone git@github.com:Elkokonut/AR-music.git
    ```

2. Change your directory to the cloned repository

    ```bash
    cd AR-music
    ```

3. Install all modules

    ```bash
    yarn install
    ```

## 🧑🏻‍💻&nbsp; Working

1. Start server

    ```bash
    yarn parcel index.html
    ```

The website in then available on http://localhost:1234.


## 📁&nbsp; Filesystem

If your path is local, put your model in static directory and use static as the base of your path. See [Parcel reporter static filescopy](https://www.npmjs.com/package/parcel-reporter-static-files-copy).

1. Create static directory in your project root
2. Fill it with your static files
3. Refer to your statics files as if static was the root of your project

## 🏗️&nbsp; Build for deployment

- To build:

    ```bash
    yarn parcel build index.html
    ```

    All builded code is located in dist.

## 🙋🏻‍♂️&nbsp; Author

- Marine Charra for Octo Technology
- Mathieu Tammaro for Octo Technology

## 📚&nbsp; License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.