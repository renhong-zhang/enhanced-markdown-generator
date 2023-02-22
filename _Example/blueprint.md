<!--- This is a Simple Example Shows Main Features of this Generator -->

[--template:toc--]

#### Owner
[--owner.id.github--]
[-- owner.name --]

#### Filter 

Filter out **Not Finished**:
[-- TODO ||  "done": [ " " ] --]

Filter out **Finished**:
[-- TODO ||  "done": [ "x" ] --]

#### Exporter 
[-- head_svg  >> "path":"example_head.svg" , "[[format]]":"ext-image" --]

<!-- * Export Cutline Image -->
[-- cutline_svg  >> "path":"example_line.svg" , "[[format]]":"ext-empty" --]

#### Badges 
<!-- * Skill Set -->
<p align="center">
[-- skill-set --]
</p>



#### Import
##### JSON
[-- cheatsheet.generator.command_options --]
