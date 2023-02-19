import { resolve, relative, dirname, extname, parse } from "path";
import { fileExists, getBadges, getValue, isObject, placeholderRegexCallback, readFile, writeFile } from "../helpers";
import { BadgesTemplateArgs, ContributorsTemplateArgs, DescriptionTemplateArgs, IGenerator, IGeneratorParamsArgs, IConfig, IUserTemplate, LicenseTemplateArgs, LineTemplateArgs, LoadTemplateArgs, LogoTemplateArgs, MainTitleTemplateArgs, TableOfContentsTemplateArgs, TitleTemplateArgs, DocumentationTemplateArgs } from "../model";
import { badgesTemplate, bulletsTemplate, contributorsTemplate, descriptionTemplate, documentationTemplate, licenseTemplate, lineTemplate, logoTemplate, mainTitleTemplate, tableTemplate, titleTemplate, tocTemplate } from "./templates";

// * My Templates
const DEBUG_GENERATOR_IF_LOG = true
const DEBUG_TEMP_IF_LOG = false
//~ Test Console
import { green, red, yellow } from "colors";
import { testlog, Dict, Cell, Obj, Cmd, REF_PATH_DELIMITER, Formatter, Filter, Exporter, IsArray, IsObjectInstance, RefData, FormalLog, ConvertNestedNumberedDictToList } from "./classes";

/**
 * Creates a simple template.
 * @param name
 * @param template
 * @param params
 */
export function simpleTemplateGenerator({ name, template, params }: IUserTemplate): IGenerator<{}> {
	return {
		name,
		regex: placeholderRegexCallback(`template:${name}`),
		template: () => template,
		params
	};
}

/**
 * Loads markdown.
 */
export const generateLoad: IGenerator<LoadTemplateArgs> = {
	name: "load",
	regex: placeholderRegexCallback("load:(.+?\.md)"),
	template: ({ content, generateReadme, configPath, config }: LoadTemplateArgs) => {
		return generateReadme({ config, blueprint: content, configPath, generators: [generateLoad] });
	},
	params: ({ config, match, generateReadme, configPath }) => {
		const absolutePath = resolve(match[2]);

		if (!fileExists(absolutePath)) {
			return { error: `the file "${absolutePath}" doesn't exist.` };
		}

		const content = readFile(absolutePath) || "";
		return { content, generateReadme, configPath, config };
	}
};

/**
 * Generates a logo.
 */
export const generateLogo: IGenerator<LogoTemplateArgs> = {
	name: "logo",
	regex: placeholderRegexCallback("template:logo"),
	template: logoTemplate,
	params: {
		logo: "logo",
		src: "logo.src"
	}
};

/**
 * Generates a title.
 */
export const generateMainTitle: IGenerator<MainTitleTemplateArgs> = {
	name: "main-title",
	regex: placeholderRegexCallback("template:title"),
	template: mainTitleTemplate,
	params: {
		name: "pkg.name"
	}
};

/**
 * Generates badges.
 */
export const generateBadges: IGenerator<BadgesTemplateArgs> = {
	name: "badges",
	regex: placeholderRegexCallback("template:badges"),
	template: badgesTemplate,
	params: ({ config }: IGeneratorParamsArgs) => {
		const badges = getBadges({ config });
		if (badges.length === 0) {
			return { error: "it could not generate any badges" };
		}
		return { badges, config };
	}
};

/**
 * Generates a description.
 */
export const generateDescription: IGenerator<DescriptionTemplateArgs> = {
	name: "description",
	regex: placeholderRegexCallback("template:description"),
	template: descriptionTemplate,
	params: {
		description: "pkg.description",
		optional: {
			demo: "demo",
			text: "text"
		}
	}
};

/**
 * Generates a line.
 */
export const generateLine: IGenerator<LineTemplateArgs> = {
	name: "line",
	regex: placeholderRegexCallback("template:line"),
	template: lineTemplate
};

/**
 * Generates contributors.
 */
export const generateContributors: IGenerator<ContributorsTemplateArgs> = {
	name: "contributors",
	regex: placeholderRegexCallback("template:contributors"),
	template: contributorsTemplate,
	params: {
		contributors: "pkg.contributors"
	}
};

/**
 * Generates license.
 */
export const generateLicense: IGenerator<LicenseTemplateArgs> = {
	name: "license",
	regex: placeholderRegexCallback("template:license"),
	template: licenseTemplate,
	params: {
		license: "pkg.license"
	}
};

/**
 * Generates the titles.
 */
export const generateTitle: IGenerator<TitleTemplateArgs> = {
	name: "title",
	regex: () => /^([#]{1,2}) (.*)$/gm,
	template: titleTemplate,
	params: ({ config, match }) => {
		const hashes = match[1];
		const title = match[2];
		return { title, level: hashes.length, config };
	}
};

/**
 * Generates the interpolation.
 */
export const generateInterpolate: IGenerator<{ config: IConfig, text: string }> = {
	name: "interpolate",
	// * Will Match Text Not in This Generator, But will Return Null and Make the generateReadme Skip this match
	regex: placeholderRegexCallback(`[^\\s].*?`),
	template: ({ config, text }) => {
		// *Example text = asset.license.badge
		FormalLog(text,`Text input to Generator`);

		// * Read Value Obj from Input Text
		let value: any;
		let target_str = text
		let test_dict: Dict = config.ref_data.blueprint_data_obj.dict_;
		testlog(test_dict, `generateInterpolate-test_dict`, DEBUG_GENERATOR_IF_LOG)
		testlog(test_dict.config_list_, `test_dict.config_list_-after-extract: 0`, DEBUG_GENERATOR_IF_LOG)

		if (test_dict != null && IsObjectInstance({ obj: test_dict, type: Dict }) && test_dict.obj_.IsSet()) {
			// * : Extract String with Pipe
			let ref_cmd_obj = new Cmd({ text: target_str, pipe_list: [] })
			testlog(ref_cmd_obj, `test-pipe-process-ref-filter-export: ref_cmd_obj`, DEBUG_GENERATOR_IF_LOG)
			let ref_cmd_param_dict = ref_cmd_obj.ExportPipeListToDict()
			testlog(ref_cmd_param_dict, `test-pipe-process-ref-filter-export: ref_cmd_param_dict`, DEBUG_GENERATOR_IF_LOG)

			// *Get Cell From Path
			let extracted_path_list = ref_cmd_param_dict["__ref__"]
			testlog(extracted_path_list, `test-pipe-process-ref-filter-export: extracted_path_list`, DEBUG_GENERATOR_IF_LOG)
			// TODO: Update Path Extraction Algorithm in Cmd

			// * Extract Data Cell from Path
			let target_format_cell = test_dict.ExpandCellReference(new Cell("--test_root", extracted_path_list.join(REF_PATH_DELIMITER)))
			testlog(target_format_cell, `test-get-dict-value-by-path-list: target_format_cell`, DEBUG_GENERATOR_IF_LOG)

			// ~ Define Value
			value = ConvertNestedNumberedDictToList(target_format_cell.value_)
			testlog(value, `value after restore list`, DEBUG_GENERATOR_IF_LOG);

			// ~ Process Value if it is List or Null
			// * Handle Empty
			if (!target_format_cell.IsSet()) {
				FormalLog(text,`Ref NOT FOUND`);
				return null;
			}

			// * Format Array
			if (IsArray(value)) {
				testlog("", `value is list`, DEBUG_GENERATOR_IF_LOG);
				if (value.length > 0 && IsArray(value[0])) {
					value = tableTemplate({ rows: value, config: config });
				}

				else {
					//~ Monitor the Array String
					testlog(green(`TEST00 The Array input is: ${value}`));
					// ~ Make this template accept delimiter
					value = bulletsTemplate({ bullets: value, config: config });
				}
				testlog(value, `test-exporter-after-gen-string-as-list: value`, DEBUG_GENERATOR_IF_LOG)

			} else if(target_format_cell.IsSet()) {
				// * Generate Formatter Obj before filter: protect __formatter__
				let temp_formatter_obj = new Formatter()
				temp_formatter_obj.ReadCell(target_format_cell)

				// *Filter Cell
				let test_filter_obj = new Filter();
				let temp_filter_cell = new Cell("__filter__", ref_cmd_param_dict["__filter__"])
				testlog(temp_filter_cell, `test-filter-cell-by-value: temp_filter_cell`, DEBUG_GENERATOR_IF_LOG)

				test_filter_obj.ReadCell(temp_filter_cell)
				testlog(test_filter_obj, `test-filter-cell-by-value: test_filter_obj`, DEBUG_GENERATOR_IF_LOG)

				temp_formatter_obj.cell_ = test_filter_obj.FilterCell(temp_formatter_obj.cell_)
				testlog(temp_formatter_obj.cell_, `test-filter-cell-by-value: temp_formatter_obj.cell_`, DEBUG_GENERATOR_IF_LOG)

				testlog(temp_formatter_obj, `test-init-formatter: temp_formatter_obj`, DEBUG_GENERATOR_IF_LOG)
				//  *: Loop Through each `ref` in the format string, extract the value from each item of its obj, should support parent path? NO!
				//  *: it's a function with input: format_string, item_of_obj: find each key of the fmt-str in the value, if the ref-obj is obj, iterate: use cell's iterate process
				testlog(temp_formatter_obj.ToString(), `test-init-formatter: temp_formatter_obj.ToString()`, DEBUG_GENERATOR_IF_LOG)

				// TODO: export the formatted string to file
				// TODO: exporter extends formatter, new read-obj/cell, add class path to it. use __path__ and __data__ to refer to attr of the exporter obj
				let test_exporter = new Exporter()
				testlog(test_exporter, `test-init-exporter: test_exporter: before`, DEBUG_GENERATOR_IF_LOG)
				let extracted_exporter_param_dict = ref_cmd_param_dict["__export__"]
				testlog(extracted_exporter_param_dict, `test-init-exporter: extracted_exporter_param_dict: before`, DEBUG_GENERATOR_IF_LOG)
				test_exporter.Setup({
					data_dict: test_dict,
					export_formatter: temp_formatter_obj,
					pipe_cell: new Cell("__export__", extracted_exporter_param_dict)
				})

				testlog(test_exporter, `test-init-exporter: test_exporter: after`, DEBUG_GENERATOR_IF_LOG)
				
				value = test_exporter.Export()
				testlog(value, `test-exporter-after-gen-string-as-not-list: value`, DEBUG_GENERATOR_IF_LOG)
				testlog(test_exporter, `test-exporter-after-gen-string-as-not-list: test_exporter`, DEBUG_GENERATOR_IF_LOG)
			}

		} else {
			testlog(config.ref_data.blueprint_data_obj.dict_, `generateInterpolate-config.ref_data.blueprint_data_obj.dict_: `, DEBUG_GENERATOR_IF_LOG)
			testlog(config.ref_data.blueprint_data_obj.dict_, `generateInterpolate-config.ref_data.blueprint_data_obj.dict_: `, DEBUG_GENERATOR_IF_LOG)
		}

		// * Format Obj with Formatter

		return value || text;
	},
	params: ({ config, match }) => {
		const text = match[1];
		return { config, text: text.trim() };
	}
};

/**
 * Generates the toc.
 */
export const generateToc: IGenerator<TableOfContentsTemplateArgs> = {
	name: "toc",
	regex: placeholderRegexCallback("template:toc"),
	template: tocTemplate,
	params: ({ config, blueprint }) => {
		const titles = blueprint.match(/^[#]{1,6} .*$/gm);
		if (titles == null) {
			return { error: "it could not find any titles" };
		}
		return { titles, config };
	}
};

/**
 * Generates documentation.
 */
export const generateDocumentation: IGenerator<DocumentationTemplateArgs> = {
	name: "documentation",
	regex: placeholderRegexCallback("doc:(.+?)"),
	template: documentationTemplate,
	params: ({ match, config }: IGeneratorParamsArgs) => {
		const glob = match[2];
		if (glob.length === 0) {
			return { error: "it could not find the glob" };
		}
		return { glob, config };
	}
};
