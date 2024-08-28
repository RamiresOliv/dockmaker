const func = (project_path, general_configs, editFile, editAll) => {
  const configs = JSON.parse(general_configs);

  // project_path     : your project path                                         : string
  // general_configs  : your project configs, the settings.json and book.json.    : object
  // file             : edit specific file                                        : function
  // all              : edit all files                                            : function
  // for specify path like this: "directory/directory2/page.md"
  // file("index.md", (str) => {
  //    This function will be executed in a specific markdown file in your project.
  // });
  // all((str) => {
  //    This function will be executed in EVERY markdown file in your project.
  // });
  // console.log("Whats up.");
};

module.exports = func();
