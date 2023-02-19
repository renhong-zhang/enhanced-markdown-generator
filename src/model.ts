import { AnalyzerOptions, TransformerConfig } from "web-component-analyzer";
import { RefData } from "./generate/classes";

export enum LineColor {
	AQUA = "aqua",
	CLOUDY = "cloudy",
	COLORED = "colored",
	CUT = "cut",
	DARK = "dark",
	FIRE = "fire",
	GRASS = "grass",
	RAINBOW = "rainbow",
	SOLAR = "solar",
	VINTAGE = "vintage",
	WATER = "water",
	NONE = "none",
	LINE = "line"
}

export interface IBadge {
	alt: string;
	url: string;
	img: string;
}

export interface IGeneratorParamsError {
	error: string;
}

export interface IUserTemplate {
	name: string;
	template: string;
	params?: Params;
}

export type PlaceholderSyntax = [string, string];

export interface IConfig {
	input: string;
	input_json: string;
	jsonIterationDepth: number;
	output: string;
	data: string;
	package: string;
	help: boolean;
	text?: string;
	demo?: string;
	lineBreak: string;
	checkLinks: boolean;
	tab: string;
	silent: boolean;
	dry: boolean;
	logo?: ILogo;
	placeholder: PlaceholderSyntax;
	line: LineColor;
	templates?: IUserTemplate[];
	headingPrefix: {[key: number]: string}
	badges?: IBadge[];
	contributorsPerRow: number;
	pkg: IPackage;
	documentationConfig: Partial<TransformerConfig>;
	extend?: string;
	ref_data: RefData;//* Ref to raw and expanded data here
}

export interface IPackage {
	name?: string;
	contributors?: IContributor[];
	license?: License;
}

export interface IGeneratorArgs {
	config: IConfig;
	blueprint: string;
	configPath: string;
	generateReadme: GenerateReadmeFunction;
}

export type Params = {[key: string]: string} | {optional?: {[key: string]: string}}
export type GenerateReadmeFunction = ({config, blueprint, generators, configPath}: {config: IConfig, blueprint: string, generators: IGenerator<any>[], configPath: string}) => Promise<string>;

export interface IGeneratorParamsArgs extends IGeneratorArgs {
	match: RegExpMatchArray;
}
export interface IGenerator<T> {
	name: string;
	regex: (args: IGeneratorArgs) => RegExp;
	template: (args: T) => string | Promise<string>;
	params?: Params | ((args: IGeneratorParamsArgs) => T | IGeneratorParamsError | Promise<T | IGeneratorParamsError>);
}

export interface ILogo {
	src: string;
	alt?: string;
	width?: number;
	height?: number;
}

export interface IContributor {
	name: string;
	url?: string;
	email?: string;
	img?: string;
	info?: string[];
}

export type Options = {[key: string]: any};

export type Bullet = string;
export type License = string;

export type LoadTemplateArgs = {content: string; generateReadme: GenerateReadmeFunction; configPath: string; config: IConfig};
export type LogoTemplateArgs = {logo: ILogo};
export type LineTemplateArgs = {config: IConfig};
export type TitleTemplateArgs = {title: string; level: number; config: IConfig};
export type MainTitleTemplateArgs = {name: string};
export type BadgesTemplateArgs = {badges: IBadge[]; config: IConfig};
export type DocumentationTemplateArgs = {glob: string; config: IConfig};
export type DescriptionTemplateArgs = {description: string; text?: string; demo?: string};
export type BulletsTemplateArgs = {bullets: Bullet[]; config: IConfig};
export type TableTemplateArgs = {rows: string[][]; config: IConfig, centered?: boolean};
export type TableOfContentsTemplateArgs = {titles: string[]; config: IConfig};
export type ContributorsTemplateArgs = {contributors: IContributor[]; config: IConfig};
export type LicenseTemplateArgs = {license: License};
export type DemoTemplateArgs = {url: string};