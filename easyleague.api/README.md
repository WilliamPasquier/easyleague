# EasyLeague - Flask API

...

## How to make it work ?

This API application is build with python 3.11.x or higher. Please be sure you may have install it. You can check it with

```console
python --version
```

If it's not the case, you can install a version from here : [Python Releases for Windows](https://www.python.org/downloads/windows/)

To install all the packages needed for this app. Use this command :

First of all start a virtual environnement.

```console
python -m venv ./easyleague_env
```

Start it with

```console
.\easyleague_env\Scripts\Activate.ps1
```

Then install all the required packages.

```console
pip install -r requirements.txt
```
After that you can start the application with the command

```console
python app.py <Riot token>
```

You can obtain one from the [Riot Developer Portal](https://developer.riotgames.com/).
Keys are available for 24 hours. Make sure it's a working key.