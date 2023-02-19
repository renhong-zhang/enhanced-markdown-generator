import { green, red } from "colors";
import { existsSync, outputFile, readFileSync } from "fs-extra";
import { resolve } from "path";
import { githubBadges, npmBadges, webcomponentsBadges } from "./generate/badges";
import checkLinks from "check-links";
import { IBadge, IConfig, IPackage } from "./model";

export const URL_PATTERN = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.​\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[​6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1​,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00​a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u​00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;

/**
 * Returns whether the URL is valid.
 * @param url
 */
export function isValidURL (url: string): boolean {
	return URL_PATTERN.test(url);
}

/**
 * Determines whether an object has the specified key.
 * @param obj
 * @param key
 */
export function hasKey (obj: Object, key: string): boolean {
	return getValue(obj, key) != null;
}

/**
 * Returns the license url.
 * @param license
 */
export function getLicenseUrl (license: string): string {
	return `https://opensource.org/licenses/${license}`;
}

/**
 * Returns a key from from an object for a key path.
 * @param obj
 * @param keyPath
 */
export function getValue<T> (obj: {[key: string]: any}, keyPath: string): T | null {
	let keys = keyPath.split(".");
	while (keys.length > 0 && obj != null) {
		keyPath = keys.shift()!;
		obj = obj[keyPath];
	}

	return <T | null>obj;
}

/**
 * Sets a value for a key path (".")
 * @param obj
 * @param keyPath
 * @param value
 */
export function setValue<T> (obj: any, keyPath: string, value: T) {
	let keys = keyPath.split(".");
	while (keys.length > 0) {

		// Set value for the last key
		if (keys.length === 1) {
			obj[keys.shift()!] = value;
			return;
		}

		const key = keys.shift()!;
		if (obj[key] != null) {
			obj = obj[key];
		} else {
			obj = (obj[key] = {});
		}
	}
}

/**
 * Validates the package.
 * @param obj
 * @param fileName
 */
export function validateObject ({obj, requiredFields}: {obj: Object, requiredFields: string[]}): boolean {
	for (const key of requiredFields) {
		if (!hasKey(obj, key)) {
			return false;
		}
	}

	return true;
}

/**
 * Returns whether the func is a function.
 * @param func
 */
export function isFunction (func: unknown): boolean {
	return typeof func === "function";
}

/**
 * Returns whether the obj is an object.
 * @param obj
 */
export function isObject (obj: unknown): boolean {
	if (obj == null) {
		return false;
	}

	return typeof obj === "object" && !Array.isArray(obj);
}

/**
 * Extracts values from an object.
 * @param map
 * @param obj
 */
export function extractValues ({map, obj}: {map: {[key: string]: any}, obj: Object}) {
	const newObj = {};
	for (const [k, v] of (<any>Object).entries(map)) {
		(<any>newObj)[k] = getValue(obj, v);
	}

	return newObj;
}

/**
 * Returns available badges.
 * @param pkg
 */
export function getBadges ({config}: {config: IConfig}): IBadge[] {
	const badges: IBadge[] = [];

	const npmId = getValue<string>(config, "ids.npm");
	const githubId = getValue<string>(config, "ids.github");
	const webcomponentsId = getValue<string>(config, "ids.webcomponents");

	// Add NPM badges
	if (npmId != null) {
		badges.push(...npmBadges({npmId}));
	}

	// Add Github badges
	if (githubId != null) {
		badges.push(...githubBadges({githubId}));
	}

	// Add webcomponents badges
	if (webcomponentsId != null) {
		badges.push(...webcomponentsBadges({webcomponentsId}));
	}

	// Add user badges
	badges.push(...(config.badges || []));

	return badges;
}

/**
 * Reads a file.
 * @param name
 */
export function readFile (name: string): string | null {

	// Checks whether the file exists
	if (!fileExists(name)) {
		return null;
	}

	return readFileSync(resolve(process.cwd(), name)).toString("utf8");
}

/**
 * Reads the contents of a json text.
 * @param name
 */
export function readJSONText (file: string | null): Object | null {
	return file != null ? JSON.parse(file) : file;
}


/**
 * Reads the contents of a json file.
 * @param name
 */
export function readJSONFile (name: string): Object | null {
	// console.log(`TEST0010 To Read JSON File: ${name}`)
	const file = readFile(name);
	// return file != null ? JSON.parse(file) : file;
	return readJSONText(file);
}


/**
 * Escapes a regex.
 * @param text
 */
export function escapeRegex (text: string): string {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/**
 * Returns a placeholder regex.
 * @param text
 */
export function placeholderRegexCallback (text: string): (({config}: {config: IConfig}) => RegExp) {
	return (({config}: {config: IConfig}) => {
		const {placeholder} = config;
		return new RegExp(`${escapeRegex(placeholder[0])}\\s*(${text})\\s*${escapeRegex(placeholder[1])}`, "gm");
	});
}

/**
 * Writes a file to a path.
 * @param target
 * @param content
 */
export async function writeFile ({target, content}: {target: string, content: string}) {
	try {
		await outputFile(target, content);
	} catch (err) {
		console.error(err);
	}
}

/**
 * Returns the title for a level.
 * @param title
 * @param level
 * @param config
 */
export function getTitle ({title, level, config}: {title: string, level: number, config: IConfig}): string {
	const prefix = config.headingPrefix[level] || "";
	return `${prefix}${title}`;
}

/**
 * Cleans the title from weird symbols.
 * @param title
 */
export function getCleanTitle (title: string): string {
	return title.replace(/[^a-zA-Z0-9-_ ]/g, "");
}

/**
 * Returns the title link.
 * @param title
 * @param index
 */
export function getTitleLink (title: string, index: number = 0): string {
	return `#${getCleanTitle(title).replace(/ /g, "-").toLowerCase()}${index > 0 ? `-${index}` : ""}`;
}

/**
 * Determines whether the file at the path exists.
 * @param absolutePath
 */
export function fileExists (absolutePath: string): boolean {
	if (absolutePath == null || absolutePath == "") return false;
	return existsSync(absolutePath);
}

/**
 * Splits an array into smaller arrays.
 * @param arr
 * @param count
 */
export function splitArrayIntoArrays<T> (arr: T[], count: number): T[][] {
	arr = [...arr];
	const arrs: T[][] = [];
	while (arr.length) {
		arrs.push(arr.splice(0, count));
	}

	return arrs;
}

/**
 * Replaces content in string between two indicies.
 * @param string
 * @param start
 * @param end
 * @param content
 */
export function replaceInString (string: string, content: string, {start, end}: {start: number, end: number}): string {
	return string.substring(0, start) + content + string.substring(end);
}

/**
 * Loads the package file.
 * @param pkgPath
 */
export function loadPackage (pkgPath: string): IPackage | null {
	return <IPackage>readJSONFile(pkgPath) || null;
}

/**
 * Loads the config file.
 * @param configPath
 */
export function loadConfig (configPath: string): IConfig | null {
	return <IConfig>readJSONFile(configPath) || null;
}

/**
 * Loads the config file.
 * @param configText
 */
export function loadConfigText (configText: string): IConfig | null {
	return <IConfig>readJSONText(configText) || null;
}

/**
 * Returns links from a text.
 * @param text
 */
export function getLinks (text: string): string[] {
	return Array.from(text.match(/(http|www)[A-Za-z\d-\._~:\/?#\[\]@!\$&\+;=]+/gm) || []);
}

/**
 * Checks all links in the text for aliveness.
 * @param text
 */
export async function checkLinksAliveness (text: string) {
	const links = getLinks(text);
	console.log(green(`[readme] - Found "${links.length}" link${links.length === 1 ? "" : `s`}. Checking all of them now!`));

	// Check all links
	const results = await checkLinks(links);

	// Go through the results and notify the user about broken links
	for (const [link, {status, statusCode}] of Object.entries(results)) {
		if (status === "dead") {
			console.log(red(`[readme] - The link "${link}" is dead. Responded with status code "${statusCode}".`));
		}
	}
}

/** @param {string} text */
const regex_specials = [
	// order matters for these
	  "-"
	, "["
	, "]"
	// order doesn't matter for any of these
	, "/"
	, "{"
	, "}"
	, "("
	, ")"
	, "*"
	, "+"
	, "?"
	, "."
	, "\\"
	, "^"
	, "$"
	, "|"
  ];
  const escape_regex = RegExp('[' + regex_specials.join('\\') + ']', 'g');
  export function EscapeRegexp(text:string) {
	// return text.replace(/[[\]*|(){}\\]/g, m => `\\${m}`); //* Has Bug that not escape '?'
	return text.replace(escape_regex, "\\$&");
  }
