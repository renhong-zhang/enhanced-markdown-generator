import { green, red, yellow } from "colors";
import { read, writeJSON } from "fs-extra";
import { resolve, parse } from "path";
import { defaultConfig, defaultConfigName, defaultGenerators, extendConfigWithDefaults, extendConfigWithExtendConfig } from "../config";
import { checkLinksAliveness, extractValues, fileExists, isFunction, loadConfig, loadPackage, readFile, replaceInString, validateObject, writeFile,readJSONFile, readJSONText, loadConfigText } from "../helpers";
import { IConfig, IGenerator, IGeneratorParamsArgs, IGeneratorParamsError, Options, Params } from "../model";
import { simpleTemplateGenerator } from "./generators";
import { Cloneable, RefData, testlog ,FormalLog, Obj} from "./classes";

const DEBUG_GENERATE_IF_LOG = true

/**
 * Generates a readme.
 * @param pkg
 * @param blueprint
 * @param configPath
 * @param generators
 */
export async function generateReadme ({config, blueprint, configPath, generators}: {config: IConfig, blueprint: string, configPath: string, generators: IGenerator<any>[]}): Promise<string> {

	const {silent} = config;

	// * Go through all of the generators and replace with the template
	let defaultArgs = {config, configPath, generateReadme};

	for (const generator of generators) {
		const regex = generator.regex({...defaultArgs, blueprint});
		let match: RegExpMatchArray | null = null;
		//* Run all Matched Text
		do {
			match = regex.exec(blueprint);
			if (match != null) {
				let markdown = match[0];
				let errorReason;
				let params: any | null | Params | IGeneratorParamsError = null;

				// * If the params are required we extract them from the package.
				if (generator.params != null) {
					if (isFunction(generator.params)) {

						// * Extract the params using the function
						params = (<(args: IGeneratorParamsArgs) => any>generator.params)({
							...defaultArgs,
							blueprint,
							match
						});

						// * Validate the params
						if (params == null || params.error) {
							errorReason = (params || {}).error || `the params couldn't not be generated`;
						}

					} else {

						// * Get the required and optional parameters
						const optionalParams = (<any>generator.params)["optional"] || [];
						const requiredParams = {...generator.params};
						delete requiredParams["optional" as keyof typeof generator.params];

						// * Validate the params
						if (!validateObject({obj: config, requiredFields: (<any>Object).values(requiredParams)})) {
							errorReason = `"${configPath}" is missing one or more of the keys "${(<any>Object).values(requiredParams)
							                                                                                  .join(", ")}"`;
						} else {
							params = extractValues({map: {...optionalParams, ...requiredParams}, obj: config});
						}
					}
				}

				// * Use the template if no errors occurred
				// * Use Template in this Step
				if (errorReason == null) {
					markdown = await generator.template({...defaultArgs, blueprint, ...params});
					// * If No Value Generated(cuz no value ref in json), markdown should be null, not '', then this part should not be replace
					if (markdown == null) {
						testlog(`TEST0001 NO Markdown Generated from '${match[0]}', Skip to Next Match`);
						continue;
					}
				} else {
					if (!silent) {
						testlog(yellow(`[readme] - The readme generator "${generator.name}" matched "${match[0]}" but was skipped because ${errorReason}.`));
					}
				}

				// * Replace the match with the new markdown
				const start = match.index!;
				const end = start + match[0].length;
				blueprint = replaceInString(blueprint, markdown, {start, end});

				// * Change the regex pointer so we dont parse the newly added content again
				regex.lastIndex = start + markdown.length;
			}
		} while (match != null);
	}

	return blueprint;
}

/**
 * Generates the readme.
 */
export async function generate ({config, configPath, generators}: {config: IConfig, configPath: string, generators: IGenerator<any>[]}) {

	const {dry, silent, templates, output} = config;
	testlog(`TEST0010 generate(): 0`)
	// * Grab blueprint
	let blueprint: string = "";
	if (Array.isArray(config.input)) {
		blueprint = config.input.join(config.lineBreak);

	} else {
		const blueprintPath = resolve(config.input);
		if (!fileExists(blueprintPath)) {
			testlog(red(`[readme] - Could not find the blueprint file "${blueprintPath}". Make sure to provide a valid path as either the user arguments --readme.input or in the "input" field in the "${configPath}" file.`));
			return;
		}

		blueprint = readFile(blueprintPath) || "";
	}
	testlog(`TEST0010 generate(): 1`)

	testlog(`TEST0010 generate(): 2`)
	// * Generate the readme
	let readme = await generateReadme({config, blueprint, configPath, generators});
	testlog(`TEST0010 generate(): 3`)
	// * Add warning
	let blueprint_path_dict = {
		"Markdown: input": config.input,
		"JSON: input config": config.input_json,
		"JSON: config data": config.data,
		"JSON: package": config.package
	}
	testlog(`TEST0010 generate(): 4`)
	let blueprint_filename_list = []
	for (let blueprint_path_key in blueprint_path_dict) {
		let blueprint_path = blueprint_path_dict[blueprint_path_key as keyof typeof blueprint_path_dict];
		blueprint_filename_list.push(`\n${blueprint_path_key}:`)
		if (Array.isArray(blueprint_path)) {
			for (var temp_path of blueprint_path) {
				blueprint_filename_list.push(`"${parse(temp_path).base}"`)
			}
		} else {
			blueprint_filename_list.push(`"${parse(blueprint_path).base}"`)
		}
	}
	
	// * Remove all the Comments before Writing Warnings
	testlog(`TEST0010 generate(): 5`)
	testlog(`TEST0007 Remove All Comments`)
	readme = readme.replace(/[\n\r][ \t]*<!--[^\0]*?-->[ \t]*[\n\r]/gm, "\n");
	readme = readme.replace(/<!--[^\0]*?-->/gm, "");

	// * Remove multiple New lines, But Protect \n\n
	readme = readme.replace(/^[ \t]*[\n\r]/gm, "\n")
	testlog(`TEST0007 readme 1`)
	testlog(readme)
	readme = readme.replace(/\n{2,}/g, "\n\n")
	testlog(`TEST0007 readme 2`)
	testlog(readme)
	// * Remove Blank Links
	testlog(`TEST0010 generate(): 6`)
	readme = readme.replace(/href="[\s\t]*"/gm, "")

	const warning = `<!--- Source file(s) of this README: -->\n<!--- ${Array.isArray(blueprint_filename_list) ? blueprint_filename_list.join(" ") : blueprint_filename_list} -->\n`;
	if (!silent) {
		readme = `${warning}${readme}`;
	}
	

	testlog(`TEST0010 generate(): 7`)
	// * Check broken links
	if (config.checkLinks) {
		await checkLinksAliveness(readme);
	}

	testlog(`TEST0010 generate(): 8`)
	// ~ For Github Rendering
	// * Protect Images
	readme = readme.replace(/^[ \t]*(\[.*\]\(.*\))/gm, "\n$1\n")
	testlog(`TEST0007 readme 3`)
	testlog(readme)
	// * Protect Titles
	readme = readme.replace(/^(\#{1,7}\s+[^\s].*)/gm, "\n\n$1\n")
	testlog(`TEST0007 readme 4`)
	testlog(readme)
	testlog(`TEST0010 generate(): 9`)
	// * Write the file
	if (!dry) {
		try {
			await writeFile({target: output, content: readme});

			testlog(`TEST0010 generate(): 10`)
			// * Print the success messsage if not silent
			if (!silent) {
				FormalLog(output,`[readme] - A readme file was successfully generated at`);
				testlog(`TEST0003 TOTAL Post Processed JSON is:`)
			}
		} catch (err) {
			FormalLog(err,(`[readme] - ERROR: Could not generate readme at "${output}"`));
		}

	} else {
		FormalLog((readme), (`[readme] - WARNING: Created the following readme but did not write it to any files".`));
	}
}

/**
 * Runs the readme command.
 * @param options
 */
export async function generateCommand (options: Options) {
	const configPath = resolve(options["config"] || options["c"] || defaultConfigName);

	function InitConfigObj(temp_config:IConfig) {

		let config: IConfig = temp_config;
		config = extendConfigWithExtendConfig({config});
		config = extendConfigWithDefaults({config, options});

		// * Extend the config with the package object
		config.pkg = {...(loadPackage(config.package) || {}), ...config.pkg};

		// * Add configPath to config
		config.input_json = configPath;
		config = extendConfigWithExtendConfig({config});
		config = extendConfigWithDefaults({config, options});
	
		// * Extend the config with the package object
		config.pkg = {...(loadPackage(config.package) || {}), ...config.pkg};
	
		return config
	}

	let config: IConfig = InitConfigObj(loadConfig(configPath) || defaultConfig);

	// * Expand Config, only use "expand" and "raw" attributes of IConfig, readme only use `blueprint.json`'s data, blueprint use other json data, so
	// * 1. Expand Other JSON: data_dict_obj, 
	// * 2. Expand Blueprint: blueprint_dict_obj
	function ExpandConfig(temp_config:IConfig){
		let src_data_dict = {
			"data": readJSONFile(temp_config.data),
			"pkg": readJSONFile(temp_config.package),
			"blueprint": readJSONFile(temp_config.input_json),
		}
		let blueprint_data_dict = { //! Keep Same Tag As Above, Remove Tag After Extracted
			"blueprint": readJSONFile(temp_config.input_json)
	}

		temp_config.ref_data = new RefData({src_raw_obj:src_data_dict,blueprint_raw_obj:blueprint_data_dict})
		temp_config.ref_data.Expand()
		// ! Overwrite src's Config List on Blueprint, Help Ref Faster
		testlog(temp_config.ref_data.src_data_obj.dict_.config_list_, `temp_config.ref_data.src_data_obj.dict_.config_list_-after-extract: 0`, DEBUG_GENERATE_IF_LOG)
		testlog(temp_config.ref_data.blueprint_data_obj.dict_.config_list_, `temp_config.ref_data.blueprint_data_obj.dict_.config_list_-after-extract: 0`, DEBUG_GENERATE_IF_LOG)
		temp_config.ref_data.blueprint_data_obj.dict_.ExtractConfig()
		testlog(temp_config.ref_data.blueprint_data_obj.dict_.config_list_, `temp_config.ref_data.blueprint_data_obj.dict_.config_list_-after-extract: 1`, DEBUG_GENERATE_IF_LOG)

		// ! Remove Blueprint Tag
		let new_blueprint_data_dict = temp_config.ref_data.blueprint_data_obj.WriteObj().value_["blueprint"];
		temp_config.ref_data.blueprint_data_obj.Setup(new Obj("",new_blueprint_data_dict));
		
		// * Write Expanded Blueprint Data for External Reference
		temp_config.ref_data.src_data_obj.dict_.WriteJSON(".gen_blueprint_full.json");
		temp_config.ref_data.blueprint_data_obj.dict_.WriteJSON(".gen_blueprint.json");
		return temp_config
	}
	config = ExpandConfig(config)
	FormalLog("","References Extracted")

	testlog(`\nTEST0010 CURRENT config: 3`); 
	testlog(config, `Config-After-Preprocess`);

	await generate({config, configPath, generators: defaultGenerators});
}