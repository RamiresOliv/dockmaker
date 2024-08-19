# Welcome to dockmaker.

simple context:

`src` directory is the place where you will edit yours marketdowns.<br>
`site` directory is the place where all the `src` files will be rendered.<br>
`includes` directory is the place where you create callable css, javascript contents and others:
$ {import:path/to/file.js} (the $ and {} must be joit i.g: ${})
<br>
**Check this file**
if you want a better exemple go check this file `${page_src_path}`

<!-- This is how works: -->
<!-- "${import:html/hello_world.js}" should return: "<b>Hello world!!!!!!!!!!</b>" -->
<!-- Go check the file content in includes/html/hello_world.html -->

<!-- You can do the same thing, but with strings. -->
<!-- "${import:html/hello_world.js}" should return: "<b>Hello world!!!!!!!!!!</b>" -->
<!-- Go check the file content in includes/html/hello_world.html -->

<br><br>

<!-- As said, this should make a  -->

As I said: ${import:html/hello_world.html}

<!-- This will say something in the web console -->

${import:js/test.js}
