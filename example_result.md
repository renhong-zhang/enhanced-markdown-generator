<!--- Source file(s) of this README: -->
<!--- 
Markdown: input: "blueprint.md" 
JSON: input config: "blueprint.json" 
JSON: config data: "config_data.json" 
JSON: package: "package.json" -->


<p align="center"><a href="#table-of-contents"><img align="center" width="100%" src="assets/example_line.svg"/></a></p>

<details open>
	<summary><big><b>Table of Contents</big></b></summary>
	<ol>
		<li><a href="#owner">Owner</a></li>
<li><a href="#filter-">Filter </a></li>
<li><a href="#exporter-">Exporter </a></li>
<li><a href="#badges-">Badges </a></li>
<li><a href="#import">Import</a></li>
<ul><li><a href="#json">JSON</a></li></ul>
	</ol>
</details>



#### Owner

renhong-zhang
Renhong Zhang



#### Filter 


Filter out **Not Finished**:
- [ ] Event A
- [ ] Event C

Filter out **Finished**:
- [x] Event B
- [x] Event D



#### Exporter 


<p align="center"><a href="null"><img width="100%" align="center" src="assets/example_head.svg" alt="null" /></a></p>



#### Badges 

<p align="center">
<a href="#"><img alt="Project Management" src="https://img.shields.io/badge/-Project%20Management-FAE109?&style=flat" height="20" /></a> <a href="#"><img alt="C" src="https://img.shields.io/badge/C-00599C?logo=c&logoColor=white&style=flat" height="20" /></a> <a href="#"><img alt="Cpp" src="https://img.shields.io/badge/C%2B%2B-00599C?logo=c%2B%2B&logoColor=white&style=flat" height="20" /></a> <a href="#"><img alt="STM32" src="https://img.shields.io/badge/-STM32-03234B?&logo=STMicroelectronics&logoColor=white&style=flat" height="20" /></a> <a href="#"><img alt="Raspberry Pi" src="https://img.shields.io/badge/Raspberry%20Pi-A22846?logo=Raspberry%20Pi&logoColor=white&style=flat" height="20" /></a> <a href="#"><img alt="Arduino" src="https://img.shields.io/badge/Arduino-00979D?logo=Arduino&logoColor=white&style=flat" height="20" /></a> <a href="#"><img alt="Matlab" src="https://img.shields.io/badge/Matlab-blue?&style=flat" height="20" /></a> <a href="#"><img alt="simulink" src="https://img.shields.io/badge/-Simulink-orange?&style=flat" height="20" /></a> <a href="#"><img alt="Python" src="https://img.shields.io/badge/Python-FFD43B?logo=python&logoColor=blue&style=flat" height="20" /></a> <a href="#"><img alt="TensorFlow" src="https://img.shields.io/badge/TensorFlow-FF6F00?logo=TensorFlow&logoColor=white&style=flat" height="20" /></a> <a href="#"><img alt="PyTorch" src="https://img.shields.io/badge/PyTorch-EE4C2C?logo=PyTorch&logoColor=white&style=flat" height="20" /></a> <a href="#"><img alt="LaTeX" src="https://img.shields.io/badge/LaTeX-47A141?logo=LaTeX&logoColor=white&style=flat" height="20" /></a> <a href="#"><img alt="Linux" src="https://img.shields.io/badge/Linux-FCC624?logo=linux&logoColor=black&style=flat" height="20" /></a> <a href="#"><img alt="Shell_Script" src="https://img.shields.io/badge/Shell_Script-121011?logo=gnu-bash&logoColor=white&style=flat" height="20" /></a> <a href="#"><img alt="AppleScript" src="https://img.shields.io/badge/-AppleScript-blue?&style=flat" height="20" /></a> <a href="#"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white&style=flat" height="20" /></a> <a href="#"><img alt="Allegro" src="https://img.shields.io/badge/PCB-FF5A00?logo=Allegro&logoColor=white&style=flat" height="20" /></a> <a href="#"><img alt="Solidworks" src="https://img.shields.io/badge/-Solidworks-critical?&style=flat" height="20" /></a> <a href="#"><img alt="SQLite" src="https://img.shields.io/badge/SQLite-07405E?logo=sqlite&logoColor=white&style=flat" height="20" /></a> <a href="#"><img alt="UML" src="https://img.shields.io/badge/-UML-brightgreen?&style=flat" height="20" /></a>
</p>



#### Import



##### JSON


| Option                | Type                                             | Description                                      |
|-----------------------|--------------------------------------------------|--------------------------------------------------|
| -c, --config          | string                                           | Path of the configuration file. Defaults to 'blueprint.json |
| --data                | string                                           | Path of the Source Data.                         |
| -p, --package         | string                                           | Path of the 'package.json' file. Defaults to 'package.json'. |
| pkg.name              | string                                           | Name of the project. Used for the 'title' template. |
| --pkg.contributors    | {name: string; email: string; url: string; img: string; info: string[];}[] | Contributors of the project. Used for the 'contributors' template. |
| --pkg.license         | string                                           | License kind. Used for the 'license' template.   |
| -o, --output          | string                                           | Path of the generated README file. Defaults to 'README.md'. |
| -h, --help            |                                                  | Display this help message.                       |
| -i, --input           | string                                           | The blueprint. Defaults to 'blueprint.md'.       |
| --badges              | {alt: string, url: string, img: string}[]        | Badges. Used for the 'badges' template.          |
| --text                | string                                           | Text describing your project. Used for the 'description' template. |
| --demo                | string                                           | Demo url for your project. Used for the 'description' template. |
| --lineBreak           | string                                           | The linebreak used in the generation of the README file. Defaults to 'rn' |
| --tab                 | string                                           | The tab used in the generation of the README file. Defaults to 't' |
| --placeholder         | [string, string]                                 | The placeholder syntax used when looking for templates in the blueprint. Defaults to '["{{", "}}"]. |
| --line                | string                                           | The line style of the titles. Can also be an URL. Defaults to 'colored'. |
| --templates           | {name: string, template: string}[]               | User created templates.                          |
| -s, --silent          | boolean                                          | Whether the console output from the command should be silent. |
| -d, --dry             | boolean                                          | Whether the command should run as dry. If dry, the output file is notgenerated but outputted to the console instead. |
| --headingPrefix       | {[key: number]: string}                          | The prefix of the header tags. Defaults to '{1: "➤ ", 2: "➤ "}' |
| --logo                | {src: string; alt?: string; width?: number; height?: number;} | The logo information. Used for the 'logo' template. |
| --contributorsPerRow  | number                                           | The amount of contributors pr row when using the 'contributors' template. Defaults to '6' |
| --documentationConfig | object                                           | Configuration object for automatic documentation template. |
| --extend              | string                                           | Path to another configuration object that should be extended. |
| --checkLinks          | boolean                                          | Checks all links for aliveness after the README file has been generated. |

