/*
Path fixer:
This thing is required to fix the things path. 🙂
*/

function fixPath(path) {
  path = path || "";
  if (!path.startsWith("/")) path = "/" + path;

  if ("${book_url}" == "") {
    return document.location.origin + path;
  } else {
    return "${book_url}" + path;
  }
}
