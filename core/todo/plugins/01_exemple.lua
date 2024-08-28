local func = function(project_path, general_configs, file, all)
  -- project_path     : your project path                                         : string
  -- general_configs  : your project configs, the settings.json and book.json.    : array
  -- file             : edit specific file                                        : function
  -- all              : edit all files                                            : function
  -- for specify path like this: "directory/directory2/page.md"
  -- file("index.md", function(str)
  --    This function will be executed in a specific markdown file in your project.
  -- end)
  -- file(function(str)
  --    This function will be executed in EVERY markdown file in your project.
  -- end)
  -- print("Whats up.")
end

return func()
