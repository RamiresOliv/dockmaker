/*
This adds base style to the pages
*/

// This loads very fast the style. But can cause issues too. If you think this is bad,
// idk what you should do. (just trust)
const base_style_link = document.getElementById("base_style_link");
base_style_link.href = fixPath("style/base.css");
