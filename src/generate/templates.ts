import glob from "glob";
import { analyzeText, transformAnalyzerResult } from "web-component-analyzer";
import { getCleanTitle, getLicenseUrl, getTitle, getTitleLink, isValidURL, splitArrayIntoArrays } from "../helpers";
import { BadgesTemplateArgs, BulletsTemplateArgs, ContributorsTemplateArgs, DemoTemplateArgs, DescriptionTemplateArgs, DocumentationTemplateArgs, LicenseTemplateArgs, LineColor, LineTemplateArgs, LogoTemplateArgs, MainTitleTemplateArgs, TableOfContentsTemplateArgs, TableTemplateArgs, TitleTemplateArgs } from "../model";
import { ALIAS_DELIMITER_KEY, ALIAS_FORMATTER_OBJ_KEY, ALIAS_FORMAT_KEY, Cell, Formatter, testlog } from "./classes";

// * My Templates
// import { FormatString } from "./formatters";
const DEBUG_TEMPLATE_IF_LOG = true;

const fs = require("fs");

/**
 * Creates the template for the logo.
 * @param logo
 */
export function logoTemplate ({logo}: LogoTemplateArgs): string {
	const {src, width = "auto", height = "auto", alt = "Logo"} = logo;
	return `<p align="center">
  <img src="${src}" alt="${alt}" width="${width}" height="${height}" />
</p>`;
}

/**
 * Creates the template for the title.
 * @param name
 */
export function mainTitleTemplate ({name}: MainTitleTemplateArgs): string {
	return `<h1 align="center">${name}</h1>`;
}

/**
 * Creates a line template.
 * @param config
 */
export function lineTemplate ({config}: LineTemplateArgs) {
	let url = "";
	const {line} = config;

	// If the line should not be there we just return an empty string.
	if (line === LineColor.NONE) {
		return ``;
	}

	// Construct the URL.
	if (isValidURL(line)) {
		url = line;
	} else {
		// url = `assets/${line}.png`;
		// * Use svg as cutline
		url = `assets/${line}.svg`;
		
		// url = `https://raw.githubusercontent.com/renhong-zhang/enhanced-markdown-generator/master/assets/lines/${line}.png`;
	}

	// return `![-----------------------------------------------------](${url})`;
	// return `<img align=\"center\" width="100%" height="5px" src="${url}"/>`
	return `<img align=\"center\" width="100%" src="${url}"/>`
}

/**
 * Creates a template for the title.
 * @param title
 * @param level
 * @param config
 */
export function titleTemplate ({title, level, config}: TitleTemplateArgs) {
	let temp_cutline = `<p align=\"center\"><a href=\"${getTitleLink(title)}\">${lineTemplate({config})}</a></p>`
	const beforeTitleContent = level <= 2 ? `${config.lineBreak}${temp_cutline}${config.lineBreak}${config.lineBreak}` : "";
	return `${beforeTitleContent}${(<any>Array(level)).fill("#").join("")} ${getTitle({title, level, config})}`;
}

export function myTitleText ({title, level, config}: TitleTemplateArgs) {

	return `${getTitle({title, level, config})}`;
}

export function myTitlePrefix ({title, level, config}: TitleTemplateArgs) {
	// const beforeTitleContent = level <= 2 ? `${config.lineBreak}[${lineTemplate({config})}](${getTitleLink(title)})${config.lineBreak}${config.lineBreak}` : "";
	let temp_cutline = `<p align=\"center\"><a href=\"${getTitleLink(title)}\">${lineTemplate({config})}</a></p>`
	const beforeTitleContent = level <= 2 ? `${config.lineBreak}${temp_cutline}${config.lineBreak}${config.lineBreak}` : "";
	return `${beforeTitleContent}`;
}

/**
 * Creates a template for the badges.
 * @param badges
 * @param config
 */
export function badgesTemplate ({badges, config}: BadgesTemplateArgs): string {
	return `<p align="center">
		${badges.map(badge => `<a href="${badge.url}"><img alt="${badge.alt}" src="${badge.img}" height="20"/></a>`)
	            .join(config.lineBreak)}
	</p>
`;
}

/**
 * Creates a template for the license.
 * @param license
 * @returns {string}
 */
export function licenseTemplate ({license}: LicenseTemplateArgs) {
	return `## License
	
Licensed under [${license}](${getLicenseUrl(license)}).`;
}

/**
 * Creates a template for the demo link.
 * @param url
 */
export function demoTemplate ({url}: DemoTemplateArgs) {
	return `Go here to see a demo <a href="${url}">${url}</a>.`;
}

/**
 * Creates a description template.
 * @param description
 * @param text
 * @param demo
 */
export function descriptionTemplate ({description, text, demo}: DescriptionTemplateArgs): string {
	return `<p align="center">
  <b>${description}</b></br>
  <sub>${text != null ? text : ""}${demo != null ? ` ${demoTemplate({url: demo})}` : ""}<sub>
</p>

<br />
`;
}

/**
 * Creates a bullets template.
 * @param bullets
 * @param pkg
 */
export function bulletsTemplate ({bullets, config}: BulletsTemplateArgs): string {
	return bullets.map(bullet => `* ${bullet}`).join(config.lineBreak);
}

/**
 * Creates a table template.
 * @param rows
 * @param config
 * @param centered
 */
export function tableTemplate ({rows, config, centered}: TableTemplateArgs): string {
	/**
	 * Fills the width of the cell.
	 * @param text
	 * @param width
	 * @param paddingStart
	 */
	function fillWidth (text: string, width: number, paddingStart: number): string {
		return " ".repeat(paddingStart) + text + " ".repeat(Math.max(1, width - text.length - paddingStart));
	}

	/**
	 * Escape a text so it can be used in a markdown table
	 * @param text
	 */
	function markdownEscapeTableCell (text: string): string {
		return text.replace(/\n/g, "<br />").replace(/\|/g, "\\|");
	}

	// Filter away the rows that have no content
	rows = rows.filter(row => row.map(r => r.trim()).join("").length > 0);

	// Count the amount of columns
	const columnCount = Math.max(...rows.map(r => r.length));

	// Escape all cells in the markdown output
	rows = rows.map(r => r.map(markdownEscapeTableCell));


	const MIN_WIDTH = 3;
	const MAX_WIDTH = 50;
	const PADDING = 1;
	const tableColPrefix = centered ? ":" : "";

	const columnWidths = Array(columnCount)
		.fill(0)
		.map((c, i) => Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, ...rows.map(r => (r[i] || "").length)) + PADDING * 2));

	return `
|${rows[0].map((r, i) => fillWidth(r, columnWidths[i], PADDING)).join("|")}|
|${columnWidths.map(c => `${tableColPrefix}${"-".repeat(c)}${tableColPrefix}`).join("|")}|
${rows
		.slice(1)
		.map(r => `|${r.map((r, i) => fillWidth(r, columnWidths[i], PADDING)).join("|")}|`)
		.join(config.lineBreak)}
`;
}

/**
 * Creates the table of contents.
 * @param titles
 * @param pkg
 */
export function tocTemplate ({titles, config}: TableOfContentsTemplateArgs): string {

	// Create a clean titles array.
	// We are going to use it to figure out the index of each title (there might be more titles with the same name).
	const tempCleanTitles = titles.map(title => getCleanTitle(title));

	// Create a map, mapping each clean title to the amount of times it occurs in the titles array
	const countForTitle: {[key: string]: number} = <any>tempCleanTitles.reduce((acc: {[key: string]: number},
	                                                                            title) => {
		acc[title] = (acc[title] || 0) + 1;
		return acc;
	}, {});

	// Map the titles to relevant info.
	const titlesInfo = titles.map(title => {
		const cleanTitle = getCleanTitle(title);
		const titlesWithSameName = tempCleanTitles.filter(t => t === cleanTitle);

		// Remove title from the temp array and compute the index
		tempCleanTitles.splice(tempCleanTitles.indexOf(cleanTitle), 1);

		// Compute the index (the first will be 0 and so on)
		const index = ((countForTitle[cleanTitle] || 1) - titlesWithSameName.length);

		// Compute the level of the title
		const level = (title.match(/#/g) || []).length;

		// Remove the "# " from the titles so eg. "## Hello" becomes "Hello"
		title = title.replace(/^#*\s?/, "");

		// Compute the title link
		const titleLink = getTitleLink(title, index);

		return {title, cleanTitle, index, titleLink, level};
	});

	// Find the lowest level of heading (# is lower than ##)
	const lowestLevel = titlesInfo.reduce((acc, {title, level}) => Math.min(acc, level), Infinity);

	// * TOC Format
	let toc_title_key = "toctitle"
	let toc_key = "toc";
	let title_key = "title";
	let titlelink_key = "titlelink";
	let title_formatted_key = "titleformatted";

	const toc_format = `
<details open>
	<summary><big><b>{--${toc_title_key}--}</big></b></summary>
	<ol>
		{--${toc_key}--}
	</ol>
</details>`
	const toc_item_format = `<li><a href="{--${titlelink_key}--}">{--${title_key}--}</a></li>`
	const toc_indent_format = `<ul>{--${title_formatted_key}--}</ul>`

	// *Format TOC
	let toc_lines_formatted = `${titlesInfo.map(({level, titleLink, title}) => {
		// Subtract the lowest level from the level to ensure that the lowest level will have 0 tabs in front
		// We can't make any assumptions about what level of headings the readme uses.
		// const tabs = (<any>Array(level - lowestLevel)).fill(config.tab).join("");
		// return `${tabs}* [${title}](${titleLink})`;

		let toc_line_formatter_dict = {
			[ALIAS_FORMATTER_OBJ_KEY]: {
				[ALIAS_FORMAT_KEY]: toc_item_format,
			},
			"temp_line": {
				[titlelink_key]: titleLink,
				[title_key]: title
			}
		}
		let toc_line_formatted:string = "";
		toc_line_formatted = Formatter.ProcessCellToString(new Cell("temp_line",toc_line_formatter_dict));
		testlog(toc_line_formatted,"tocTemplate-toc_lines_formatted-toc_line_formatted: after generation",DEBUG_TEMPLATE_IF_LOG)

		// let toc_line_formatted = toc_item_format;
		// toc_line_formatted = FormatString(toc_line_formatted, titlelink_key, titleLink);
		// toc_line_formatted = FormatString(toc_line_formatted, title_key, title);

		for (let temp_index = 0; temp_index < (level - lowestLevel); temp_index++) {
			let toc_indent_formatter_dict = {
				[ALIAS_FORMATTER_OBJ_KEY]: {
					[ALIAS_FORMAT_KEY]: toc_indent_format,
				},
				"temp_line": {
					[title_formatted_key]: toc_line_formatted,
				}
			}
			toc_line_formatted = Formatter.ProcessCellToString(new Cell("temp_line_indent",toc_indent_formatter_dict))
			// toc_line_formatted = FormatString(toc_indent_format, title_formatted_key, toc_line_formatted);
			
		}
		testlog(toc_line_formatted,"tocTemplate-toc_lines_formatted-toc_line_formatted: after indent",DEBUG_TEMPLATE_IF_LOG)

		return toc_line_formatted

	}).join(config.lineBreak)}`;

	let toc_formatter_dict = {
		[ALIAS_FORMATTER_OBJ_KEY]: {
			[ALIAS_FORMAT_KEY]: toc_format,
		},
		"temp_line": {
			[toc_title_key]: `${myTitleText({title: "Table of Contents", level: 2, config: config})}`,
			[toc_key]: toc_lines_formatted,
		}
	}

	let toc_formatted = Formatter.ProcessCellToString(new Cell("temp_toc",toc_formatter_dict));
	// let toc_formatted = toc_format;
	// toc_formatted = FormatString(toc_formatted, toc_key, toc_lines_formatted);
	// toc_formatted = FormatString(toc_formatted, toc_title_key, `${myTitleText({title: "Table of Contents", level: 2, config: config})}`);
	testlog(toc_formatted,"tocTemplate-toc_formatted: after generation",DEBUG_TEMPLATE_IF_LOG)
	return `${myTitlePrefix({title: "Table of Contents", level: 2, config: config})}
	${toc_formatted}
	`;
// 	// Format the table of contents title because it is applied after the title template
// 	return `${titleTemplate({title: "Table of Contents", level: 2, config: config})}

// ${titlesInfo.map(({level, titleLink, title}) => {
// 		// Subtract the lowest level from the level to ensure that the lowest level will have 0 tabs in front
// 		// We can't make any assumptions about what level of headings the readme uses.
// 		const tabs = (<any>Array(level - lowestLevel)).fill(config.tab).join("");
// 		return `${tabs}* [${title}](${titleLink})`;
// 	}).join(config.lineBreak)}`;
}

/**
 * Creates the authors template.
 * @param contributors
 * @param config
 */
export function contributorsTemplate ({contributors, config}: ContributorsTemplateArgs): string {
	const {contributorsPerRow} = config;
	const imageSize = 100;

	// Split the contributors into multiple arrays (one for each row)
	const rows = splitArrayIntoArrays(contributors, contributorsPerRow);

	return `## Contributors
	
${rows.map(row => {

		// Compile the rows
		const imgs = row.map(({img, url, name}) => img != null ? `[<img alt="${name}" src="${img}" width="${imageSize}">](${url})` : " ");
		const names = row.map(({url, email, name}) => `[${name}](${url})`);
		const emails = row.map(({url, email}) => email != null ? `[${email}](mailto:${email})` : "");

		// Find the maximum amount of info lines for the row!
		const maxInfoLinesCount = row.reduce((acc, {info}) => info != null ? Math.max(acc, info.length) : acc, 0);

		// For each line we go through the row and find the correct info
		const infos = Array(maxInfoLinesCount).fill(0).map((_, i) => {
			return row.map(({info}) => info != null && i < info.length ? info[i] : "");
		});

		const content: string[][] = [
			imgs,
			names,
			emails,
			...infos
		];

		return tableTemplate({rows: content, config, centered: true});
	}).join(config.lineBreak)}`;
}

/**
 * Generates documentation for a glob.
 * @param glob
 * @param config
 */
export async function documentationTemplate ({glob: globString, config}: DocumentationTemplateArgs): Promise<string> {

	// Resolve all paths
	const paths: string[] = await (new Promise((res, rej) => {
		glob(globString, (err, paths) => {
			err != null ? rej(err) : res(paths);
		});
	}));

	// Read all files
	const files = paths.map(path => ({
		fileName: path,
		text: fs.readFileSync(path, {encoding: "utf8"})
	}));

	// Analyze the text
	const {results, program} = analyzeText(files);

	// Turn the result into markdown
	const format = "markdown";
	return transformAnalyzerResult(format, results, program, config.documentationConfig);
}

