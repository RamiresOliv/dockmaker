# Dockmaker

## Your documentation is ready but here some stuff...

> Theres some words with I wish to you read:

## Directories:

`src` directory is the place where you will edit yours markdowns.
`site` directory is the place where all the `src` files will be rendered.
`includes` directory is the place where you create callable css, javascript

## Bbook settings (book.json)

`book.json` is where you will set the book informations, these settings will affect the export results. _(I recomend you go there and change the things as you desire.)_

#### book.json:

```json
{
  "name": "DockMaker",
  "description": "A simple documentation website creator.",
  "url": "",
  "author": {
    "name": "RamiresOliv",
    "github": "https://github.com/RamiresOliv/RamiresOliv"
  },
  "navigation": {
    "enabled": true,
    "whitelist": [".md", ".html"],
    "blacklist_dir": ["images"]
  },
  "includes": {
    "test": "argument."
  }
}
```

## In-Machine settings (settings.json)

`settings.json` is a file made to configure export location, import location and localhost settings, very usefull in your machine, nothing in `settings.json` will affect your website if is in Github pages or any other host.

#### settings.json:

```json
{
  "includes": {
    "dir": "includes"
  },
  "output": {
    "dir": "site"
  },
  "src": {
    "dir": "src"
  },
  "localhost": {
    "port": 6555
  }
}
```

## FAQ

### 1. Q: How I publish this to github pages?

A: uh.. Good question. Try just posting the content made in the directory `site` (It's possible. No jk.)

### 2. Q: About the CLI commands?

A: just use `dockmaker help [command]` in your terminal, to see what the command does and how to use.

### 3. Q: Others specific things?

A: Wait for full documentation. :(

## End

Thats all, thanks for be using dockmaker.

**_->_ Remember credits. _<-_**

(drag this to your `src` and start the server to read better, then access: [http://localhost:6555/readme](http://localhost:6555/readme)
