import { FMT_PROC_KEY_SNAKE_PASCAL_CASE, FMT_PROC_KEY_TITLE_CASE, IfExistConverter, convertIdentifierCase } from './ext/identifier';
import path_0 from "path"
import lodash_0, { replace } from 'lodash'
import * as helper_0 from "../helpers"
import { green, red, yellow, blue } from "colors";

// `Thought of the JSON Processing:
// `Preprocess: Use key-value to define the ref, and postprocess of the ref
// `Ref in MD and Process: read the value of diff property of each cell, Pipe process the cells

// TODO: TEst 
// `Function Param: must at the top, before any other functions
// * If Show Log
export const DEFAULT_IF_TESTLOG_SILENT = true;
const DEBUG_CLASSES_IF_LOG_SILENT = true
const DEBUG_TEMP_IF_LOG_SILENT = false

// `Time Calculate
const START_TIME = performance.now()
testlog(START_TIME, `start-time`)
// `Test Data
// ~ CONST for External Setup
export const ALIAS_FORMAT_KEY = "format"
export const ALIAS_DELIMITER_KEY = "delimiter"
export const ALIAS_PREFIX_KEY = "prefix"
export const ALIAS_SUFFIX_KEY = "suffix"
export const ALIAS_PATH_KEY = "path"
export const ALIAS_LOGIC_KEY = "logic"
export const ALIAS_KEY_KEY = "key"

export const ALIAS_CONFIG_OBJ_KEY = "__config__"
export const ALIAS_FORMATTER_OBJ_KEY = "__formatter__"

// ~ Other Const
// * CONST for REF
export const REF_DATA_MAIN_DICT_KEY = "_MAIN_";
export const REF_DATA_REF_DICT_KEY = "_REF_";
export const REF_DATA_REF_PREFIX_KEY = "_prefix";
export const REF_DATA_REF_SUFFIX_KEY = "_suffix";
export const REF_DATA_REF_PATH_LIST_KEY = "__ref__";
export const REF_DATA_REF_FILTER_KEY = "__filter__"
export const REF_DATA_REF_EXPORTER_KEY = "__export__"

export const REF_PATH_DELIMITER = ".";
export const REF_SIBLING_PATH_KEY = "@";
export const REF_PARENT_PATH_KEY = "<";
// * CONST for Formatter
export const FMT_DELIMITER_KEY = "delim";
export const FMT_FORMAT_KEY = "fmt";
export const FORMAT_PREFIX = "{--";
export const FORMAT_SUFFIX = "--}";
export const FORMAT_PREFIX_ESCAPED = helper_0.EscapeRegexp(FORMAT_PREFIX);
export const FORMAT_SUFFIX_ESCAPED = helper_0.EscapeRegexp(FORMAT_SUFFIX);
export const FORMATTER_IF_STRICT = false;
// * CONST for Exporter
const EXPORTER_ATTR_KEY = "in_text_attr";
const EXPORTER_DATA_KEY = "_data_"
const EXPORTER_FILE_KEY = "_file_"
const EXPORTER_PATH_KEY = "_path_"
export const DEFAULT_RELATVIE_DIR_PATH = "assets"
export const DEFAULT_EXPORT_FORMAT = `${FORMAT_PREFIX_ESCAPED}${EXPORTER_DATA_KEY}${FORMAT_SUFFIX_ESCAPED}` //* Pass Through Data and Make no Change
export const DEFAULT_EXPORT_DEMILITER = ""

var dict_to_append = <any>{
    "attr-x0": "has-x",
    "<-attr-x1->": "attr0",
};
var data_dict = <any>{

    "test_iterate": {
        [ALIAS_CONFIG_OBJ_KEY]: {
            "_prefix": "$$",
            "_suffix": ""
        },
        "$$test_ref": "ref2.ref3.ref4.ref5",
        "$$ref2": "ref2_2",
        "ref2_2": {
            "$$ref3": "ref3_2"
        },
        "ref3_2": {
            "ref4": {
                "ref5": "final_result"
            }
        }
    },
    [REF_DATA_MAIN_DICT_KEY]: {
        __config__: {
            [REF_DATA_REF_PREFIX_KEY]: "<+",
            [REF_DATA_REF_SUFFIX_KEY]: "+>"
        },
        name: "Renhong Zhang",
        "<<attr0>>": "attr1.sub0",
        "<<attr0_test_parent>>": "attr1.sub0.<.sub1",
        "<<attr1>>": "attr1.sub1.1",
        "<<attr2>>": "attr1.sub2",
        "**attr3": "pkg1.attr1.sub2",
        "--attr4_test_sibling": "@.name",
        "--attr4_test_sibling_parent": "@.<._REF_.pkg1.attr0",

    },
    [REF_DATA_REF_DICT_KEY]: {
        __config__: {
            [REF_DATA_REF_PREFIX_KEY]: "**"
        },
        pkg1: {
            __config__: {
                [REF_DATA_REF_PREFIX_KEY]: "<<",
                [REF_DATA_REF_SUFFIX_KEY]: ">>"
            },
            attr0: "has",
            "<-attr1->": "attr0",
        },
        pkg2: {
            __config__: {
                [REF_DATA_REF_PREFIX_KEY]: "<-",
                [REF_DATA_REF_SUFFIX_KEY]: "->"
            },
            attr0: {
                sub0: "power",
                sub1: ["a", "b"],
                sub2: {
                    ss0: {
                        sss0: "TEST_VALUE",
                    },
                },
            },
        },
        pkg3: {
            __formatter__: {
                _format: `{-- path.rela:upper --}[{-- name --}]({--url:encode--})`,
                _delimiter: `, `,
            },
            obj1: {
                path: {
                    rela: "rela_path_0"
                },
                name: {
                    __formatter__: {
                        _format: `{-- temp_name:title:id --}`,
                        _delimiter: ` ++ `,
                    },
                    "sub1": {
                        temp_name: "author name is apple"
                    },
                    "sub2": {
                        temp_name: {
                            __formatter__: {
                                _format: `author name is {-- temp_sub_name:uppercase --}`,
                                _delimiter: ` & `,
                            },
                            "subsub1": {
                                temp_sub_name: "author 3"
                            },
                            "subsub2": {
                                "<+temp_sub_name+>": "name"
                            }
                        }
                    }
                },
                url: "url to encode 0",
            },
            obj2: {
                path: {
                    rela: "path 2"
                },
                name: "name 2",
                url: "url to encode 2",
            },
            OBJ3: {
                path: {
                    rela: "PATH 3"
                },
                name: "name 3",
                url: "url to encode 3",
            }
        }
    },
    format: {
        __config__: {
            [REF_DATA_REF_PREFIX_KEY]: "<=",
            [REF_DATA_REF_SUFFIX_KEY]: "=>"
        },
        link: `{--obj2.name--}[{--export:camel--}]({--_path_.rela--}), Data: \n {--_data_--}`
    },
    import: {
        "->markdown": "test_import.md"
    }
};

testlog(data_dict)

// ~When go through a table, the prefix-suffix of a key are used to match a Config class, then use this to Process Its value
// * Function to Update the Cell
type CellProcessor = (temp_cell: Cell) => Cell
type CellConfigPair = { cell: Cell, config: Config }
type ConfigProcessor = (input: CellConfigPair) => CellConfigPair
type GeneralProcessor = <T>(temp_obj: T) => T
// * Class to read cell
export class Config {
    private _prefix: string = "";
    private _suffix: string = "";
    // * When Cell Matched a Config, Process it with the Processor
    private _processor: ConfigProcessor = (input: CellConfigPair) => input;
    private _path?: string[] = [];
    private _key_map: KeyMapDict = {
        [ALIAS_PREFIX_KEY]: (v: any) => (this.prefix_ = v),
        [ALIAS_SUFFIX_KEY]: (v: any) => (this.suffix_ = v),
        [ALIAS_PATH_KEY]: (v: any) => (this.path_ = Pipe.ExtractPathList(v))
    }

    constructor(path: [string?] = [], prefix: string = "", suffix: string = "", processor: ConfigProcessor = (input: CellConfigPair) => input) {
        this.prefix_ = prefix;
        this.suffix_ = suffix;
        this.processor_ = processor;
        this.path_ = path;
    }
    set prefix_(v: any) {
        this._prefix = v.trim();
    }
    get prefix_() {
        return this._prefix.trim();
    }
    set suffix_(v: any) {
        this._suffix = v.trim();
    }
    get suffix_() {
        return this._suffix.trim();
    }

    set processor_(v: ConfigProcessor) {
        this._processor = v;
    }
    get processor_() {
        return this._processor
    }

    set path_(v: any) {
        this._path = v;
    }
    get path_() {
        return this._path
    }

    IsSet() {
        return (this.prefix_ || this.suffix_)
    }

    ReadObj(temp_obj: any) {
        for (const [temp_key, temp_value] of Object.entries(temp_obj)) {
            if (Obj.HasPropertyOrMethod(this, temp_key)) {
                this[temp_key as keyof Config] = temp_value;
            } else if (this._key_map.hasOwnProperty(temp_key)) {
                this._key_map[temp_key](temp_value)
            }
        }
    }

    // * Judge if a string matches this Config
    Match(test_string: string) {

        return IfKeyMatchXxxfix(test_string, this.prefix_, this.suffix_)
    }
    // * Extract Value from Prefix and Suffix
    Extract(test_string: string) {
        let temp_key = String(test_string).trim()
        let temp_prefix = String(this.prefix_).trim()
        let temp_suffix = String(this.suffix_).trim()

        temp_key = temp_key.slice(temp_prefix.length);
        temp_key = temp_key.substring(0, temp_key.length - temp_suffix.length);

        return temp_key
    }

    // * Extract Value by remove symbol at front and end
    static GeneralExtract(test_string: string) {

        let temp_key = test_string.replace(/^\W*(.*?)\W*?$/gm, "$1")
        return temp_key
    }

    static ImportFile(input: CellConfigPair): CellConfigPair {
        let target_rela_path: string;
        let temp_cell = Cloneable.DeepCopy(input.cell)
        let temp_config = Cloneable.DeepCopy(input.config)
        if (IsString(temp_cell.value_)) {
            target_rela_path = temp_cell.value_;
            temp_cell.value_ = helper_0.readFile(target_rela_path);
            temp_cell.key_ = temp_config.Extract(temp_cell.key_)
        }
        return { cell: temp_cell, config: temp_config }

    }

    static ImportJSONFile(input: CellConfigPair): CellConfigPair {
        let target_rela_path: string;
        let temp_cell = Cloneable.DeepCopy(input.cell)
        let temp_config = Cloneable.DeepCopy(input.config)
        if (IsString(temp_cell.value_)) {
            target_rela_path = temp_cell.value_;
            temp_cell.value_ = helper_0.readJSONFile(target_rela_path);
            temp_cell.key_ = temp_config.Extract(temp_cell.key_)
        }
        return { cell: temp_cell, config: temp_config }

    }

}
// * From : https://plainenglish.io/blog/deep-clone-an-object-and-preserve-its-type-with-typescript-d488c35e5574
export class Cloneable {
    public static DeepCopy<T>(source: T): T {
        return Array.isArray(source)
            ? source.map(item => this.DeepCopy(item))
            : source instanceof Date
                ? new Date(source.getTime())
                : source && typeof source === 'object'
                    ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
                        Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!);
                        o[prop] = this.DeepCopy((source as { [key: string]: any })[prop]);
                        return o;
                    }, Object.create(Object.getPrototypeOf(source)))
                    : source as T;
    }

    public static DeepProcess<T>(source: T, processor: GeneralProcessor): T {
        source = processor(source);
        return Array.isArray(source)
            ? source.map(item => this.DeepCopy(item))
            : source instanceof Date
                ? new Date(source.getTime())
                : source && typeof source === 'object'
                    ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
                        Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!);
                        o[prop] = this.DeepCopy((source as { [key: string]: any })[prop]);
                        return o;
                    }, Object.create(Object.getPrototypeOf(source)))
                    : source as T;
    }
}
type PathList = string[];
export class Obj {
    _key: any;
    _value: any;
    _data: any;

    constructor(key: any, value: any) {
        this.key_ = key;
        this.value_ = value;
    }
    set value_(v: any) {
        this._value = v;
    }
    get value_() {
        return this._value
    }
    set key_(v: any) {
        this._key = String(v);
    }
    get key_() {
        return this._key
    }
    set_data_obj(path_list: PathList, value: any) {

    }
    get_data_obj(path_list: PathList, if_strict: boolean = true) {
        // TODO: If not found, return Null
        function RefReducer(accumulator: any, currentValue: any, index: any) {
            //* Use in .reduce
            let temp_ref_key = currentValue;
            let temp_ref_dict = accumulator;
            let temp_ref_value = <any>null;

            // ! Error Occurs if the result is a blank string, use !=null instead
            if (((temp_ref_dict && temp_ref_dict[temp_ref_key] != null))) {
                temp_ref_value = temp_ref_dict[temp_ref_key];
            }

            // * If no key, see if has ref
            return temp_ref_value;
        }

        //   * Ref to item iterately
        const get_data_by_path_list_reduce = (obj: any, path: any) =>
            path.reduce(RefReducer, obj);

        let temp_key_list = path_list.slice(-1);
        let temp_key = (temp_key_list.length > 0) ? temp_key_list[0] : ""

        let temp_value: any = null;
        if (IsString(this.value_)) {
            if (path_list.length > 0 && if_strict) {
                temp_value = null;
            } else {
                temp_value = this.value_
            }
        } else {
            temp_value = get_data_by_path_list_reduce(this.value_, path_list)
        }

        return (new Obj(temp_key, temp_value))
    }

    static HasPropertyOrMethod(temp_obj: any, temp_key: any) {
        testlog((temp_obj.hasOwnProperty(temp_key)), `has-property`)
        testlog((typeof temp_obj[temp_key] === 'function'), `has-function: ${typeof temp_obj[temp_key]}: '${temp_obj[temp_key]}': ${temp_key}`)
        return ((temp_obj.hasOwnProperty(temp_key)) || (typeof temp_obj[temp_key] === 'function'))
    }

    IsEmpty() {
        var bool_not_empty = false
        function IsObjEmpty(obj: Obj) {
            if (!bool_not_empty) {
                if (!(IsArray(obj.value_) || IsObject(obj.value_) || IsFunction(obj.value_))) {
                    testlog(bool_not_empty, `IsEmpty-IsObjEmpty-bool_not_empty-before`)
                    bool_not_empty = bool_not_empty || ((obj.value_) ? true : false);
                    testlog(bool_not_empty, `IsEmpty-IsObjEmpty-bool_not_empty-after`)

                } else {
                    for (const [temp_key, temp_value] of Object.entries(obj.value_)) {
                        IsObjEmpty(new Obj(temp_key, temp_value));
                    }
                }
            }
            return obj
        }
        IsObjEmpty(this)
        return !(bool_not_empty)
    }

    IsSet() {
        return !((this.value_ == null) || (Object.keys(this.value_).length === 0))
    }

    ToJSON_Text() {
        return JSON.stringify(this.value_, null, 4);
    }

    ToJSON_TextProcessed() {
        let temp_cell_value = Cloneable.DeepCopy(this.value_)
        temp_cell_value = ConvertNestedNumberedDictToList(temp_cell_value)
        return JSON.stringify(temp_cell_value, null, 4);
    }

}

export class Cell extends Obj {

    __config__: Config = new Config();

    private _root_obj: any = {};
    private _path_: [] = <any>[];
    private _key_map: KeyMapDict = {
        [ALIAS_CONFIG_OBJ_KEY]: (v: any) => (this.__config__.ReadObj(v))
    }

    constructor(key: any = "", value: any = {}) {
        super(key, value)
    }

    set value_(v: any) {
        this._value = v;
    }
    get value_() {
        return this._value
    }
    set key_(v: any) {
        this._key = v;
    }
    get key_() {
        return this._key
    }

    set root_obj_(v: any) {
        this._root_obj = v;
    }
    get root_obj_() {
        return this._root_obj
    }

    set path_(v: any) {
        this._path_ = v;
    }
    get path_() {
        return this._path_
    }

    set config_(v: any) {
        this.__config__ = v;
    }
    get config_() {
        return this.__config__
    }

    get_data_cell(path_list: PathList, if_strict: boolean = true) {
        // * Strict Mode Return Null when Data is a String or Not Found
        let temp_cell = new Cell()
        temp_cell.ReadObj(this.get_data_obj(path_list, if_strict))
        temp_cell.path_ = path_list;
        return temp_cell
    }

    set_data_cell(path_list: PathList, value: any) {

    }

    ReadObj(obj: Obj) {
        let value = obj.value_;
        let key = obj.key_;
        this.key_ = key
        this.value_ = {}
        if (IsObject(value) || IsArray(value)) {
            for (const [temp_key, temp_value] of Object.entries(value)) {

                if (this._key_map.hasOwnProperty(temp_key)) {
                    this._key_map[temp_key](temp_value)
                } else {
                    this.value_[temp_key] = temp_value;
                }
            }
        } else {
            this.value_ = value;
        }

    }
    WriteObj() {
        var temp_obj_key = Cloneable.DeepCopy(this.key_)
        var temp_obj_value = Cloneable.DeepCopy(this.value_)
        if ((IsObject(temp_obj_value) || IsArray(temp_obj_value))) {

            // * Add __config__ to origin position, only when it is set
            for (const [temp_key, temp_value] of Object.entries(this)) {
                if (IfKeyMatchXxxfix(temp_key, "__", "__")) {

                    testlog(`match: ${temp_key}`)
                    testlog(temp_value, `WriteObj-temp_value`)
                    // * Make sure the value is not empty
                    let is_empty_bool = (new Obj(temp_key, temp_value)).IsEmpty()
                    testlog(is_empty_bool, `is this dict empty?`)
                    if (!is_empty_bool) {
                        temp_obj_value[temp_key] = temp_value
                    }
                }
            }
        }
        return new Obj(temp_obj_key, temp_obj_value)

    }

    // * Abstract Method: Process, with Operator of Both Key and Value
    Process(processor: CellProcessor) {

        let result_cell = Cloneable.DeepCopy(this);

        return processor(result_cell);

    }
    // * Abstract Method: Process, with Operator of Both Key and Value
    IterateProcess(processor: CellProcessor) {
        function addValue(store_obj: any, temp_cell: Cell) {
            let new_cell = Cloneable.DeepCopy(temp_cell)
            let new_obj = new_cell.WriteObj()
            store_obj[new_obj.key_] = new_obj.value_;
            return store_obj;
        }

        let temp_target = this.value_;
        let current_path = this.path_;

        var cache_dict_data = <any>{};

        testlog(temp_target, `IterateProcess-temp_target`);

        let result_cell = <any>Cloneable.DeepCopy(this);
        testlog(result_cell, `IterateProcess-result_cell`);

        if (IsObject(temp_target) || IsArray(temp_target)) {
            for (const [temp_key, temp_value] of Object.entries(temp_target)) {

                let temp_path_list = current_path.concat([temp_key]);

                let temp_cell = new Cell();
                temp_cell.ReadObj(new Obj(temp_key, temp_value))
                temp_cell.path_ = temp_path_list;

                addValue(
                    cache_dict_data,
                    temp_cell.IterateProcess(processor)
                );
            }
            result_cell.value_ = cache_dict_data;
        } else {
            testlog(result_cell, `string-found`)
        }

        result_cell = processor(result_cell);

        return result_cell;

    }
}
export function ConvertNumberedDictToList(obj: any) {
    function FilterNumberList(list:(number|null)[]){
        let temp_list:number[] = []
        for (let temp_item of list) {
            if (temp_item!=null) {
                temp_list.push(temp_item)
            }
        }
        return temp_list
    }
    // * Judge if is a Numbered Key Dict
    let temp_result: any = obj;

    if (IsObject(obj)) {
        let temp_key_list = Object.keys(obj);
        let temp_numbered_key_list = FilterNumberList(temp_key_list.map((v: any) => ObjectToNumber(v)));
        temp_numbered_key_list.sort((a, b) => (a - b));
        let if_numbered_dict: boolean = false;
        if (temp_numbered_key_list.length > 0 && temp_numbered_key_list.length==temp_key_list.length && temp_numbered_key_list[0] === 0) {
            let temp_previous:any = -1;
            if_numbered_dict = true;
            for (let temp_value of temp_numbered_key_list) {
                if_numbered_dict = if_numbered_dict && (temp_value === (temp_previous + 1));
                temp_previous = temp_value
            }
        }
        if (if_numbered_dict) {
            temp_result = temp_numbered_key_list.map((k: any) => obj[String(k)]);
        }
    }
    return temp_result

}
export function ConvertNestedNumberedDictToList(input_obj:any){
    
    function ProcessToRestoreCellList(cell:Cell){
        let temp_cell:Cell = Cloneable.DeepCopy(cell)
        temp_cell.value_ = ConvertNumberedDictToList(temp_cell.value_)
        return temp_cell
    }
    let result_cell = new Cell("",input_obj);
    let result_obj = ConvertNumberedDictToList(result_cell.IterateProcess(ProcessToRestoreCellList).value_)
    return result_obj
}
// `Process a Dict
export class Dict {
    // * Store the Dict
    private _obj: Obj;
    // * Default Config
    private _default_config_list: Config[] = [
        new Config([], "--", ""), //* Indicate this is a config cell
        new Config([], "->", "", Config.ImportFile),
        new Config([], "=>", "", Config.ImportJSONFile),

    ];
    // * Init Config List
    private _config_list: [Config?] = [];

    constructor(dict: any, default_config_list?: [Config]) {
        this.obj_ = new Obj("", dict)
        default_config_list ? this.default_config_list_ = default_config_list : this.default_config_list_ = this.default_config_list_
        this.config_list_ = this.config_list_.concat((
            this.default_config_list_
        ))
    }

    set obj_(v: Obj) {
        this._obj = v;
    }
    get obj_() {
        return this._obj
    }

    set config_list_(v: any) {
        this._config_list = v;
    }
    get config_list_() {
        return this._config_list
    }

    set default_config_list_(v: any) {
        this._default_config_list = v;
    }
    get default_config_list_() {
        return this._default_config_list
    }

    // * Write Dict to JSON File
    async WriteJSON(file_path: string) {
        // * Judge if is Relative Path
        if (!(file_path.startsWith('/'))) {
            file_path = `${process.cwd()}/${file_path}`
        }
        let temp_json_text = this.obj_.ToJSON_Text();
        await helper_0.writeFile({ target: file_path, content: temp_json_text });
        testlog(temp_json_text, `WriteJSON: text exported to ${file_path}`)
        return temp_json_text
    }

    // * add config to list: if not in, push; if in, update path
    static AddConfig(config: Config, config_list: Config[]) {
        for (let temp_config of config_list) {
            if (config.prefix_ === temp_config.prefix_ && config.suffix_ === temp_config.suffix_) {
                temp_config.path_ = config.path_;
                return config_list
            }

        }
        config_list.push(config)
        return config_list
    }
    // * For Cell,
    // * 1st: if Exist Config, add to config list, 
    ExtractConfig() {
        //! Config Might Lose in the Process, don't initial as default every time
        let temp_config_list = Cloneable.DeepCopy(this.config_list_)
        testlog(temp_config_list, `ExtractConfig-temp_config_list: before-extract`, DEBUG_CLASSES_IF_LOG_SILENT)

        testlog(this.obj_.value_, `ExtractConfig: dict to extract: before-extract`)

        function ProcessConfig(temp_cell: Cell) {
            testlog(temp_cell, `cell-when-ExtractConfig`)
            let temp_config = new Config();
            temp_config.ReadObj(temp_cell.__config__)
            testlog(temp_cell, `ExtractConfig-temp_cell: before-extract`)
            testlog(temp_cell.__config__, `ExtractConfig-temp_cell.__config__: before-extract`)

            if (temp_config.IsSet()) {

                temp_config.path_ = temp_cell.path_
                temp_config_list = Dict.AddConfig(temp_config, temp_config_list)
                testlog(temp_config, `ExtractConfig-temp_config`)
            }
            return temp_cell
        }
        let temp_self_cell = new Cell()
        temp_self_cell.ReadObj(this.obj_)
        temp_self_cell.IterateProcess(ProcessConfig)
        this.config_list_ = temp_config_list;
        testlog(this.config_list_, `ExtractConfig-this.config_list_: after-extract`, DEBUG_CLASSES_IF_LOG_SILENT)
        testlog(this.obj_.value_, `ExtractConfig: dict to extract: after-extract`)

    }

    // * 2st: if match config, process with config
    ExpandCellReference(target_ref_cell: Cell = new Cell()) {
        let ref_cell: Cell = new Cell();
        let if_update_self: boolean = false;

        function HasRef(v: any) {
            return IsObject(v) && v.hasOwnProperty(REF_DATA_REF_PATH_LIST_KEY)
        }

        function HasSubRef(cell: Cell) {
            let temp_has_sub_ref: boolean = false;
            function CheckSubRef(temp_cell: Cell) {
                temp_has_sub_ref = temp_has_sub_ref || HasRef(temp_cell.value_)
                return temp_cell
            }
            cell.IterateProcess(CheckSubRef)
            return temp_has_sub_ref
        }

        function MatchConfig(cell: Cell) {
            var temp_matched_list = <any>[]
            for (const temp_value of temp_config_list) {
                let temp_config_obj = new Config();
                temp_config_obj.ReadObj(temp_value)
                if (temp_config_obj.Match(cell.key_)) {
                    testlog(temp_value, `MatchConfig-temp_value`)
                    Dict.AddConfig(Cloneable.DeepCopy(temp_value), temp_matched_list)
                } else {
                    testlog(temp_value, `MatchConfig-temp_value: Config not match '${cell.key_}'`)

                }
            }
            return temp_matched_list
        }
        function PreprocessCell(cell: Cell) {
            testlog(cell, `PreprocessCell-cell-to-match`)
            testlog(temp_config_list, `ExtractConfig-this.config_list_'s copy-temp_config_list: after-extract`)
            let temp_matched_config_list = <Config[]>MatchConfig(cell)
            testlog(temp_matched_config_list, `PreprocessCell-temp_matched_config_list`)

            for (let temp_matched_config_item of temp_matched_config_list) {
                testlog(temp_matched_config_item, `PreprocessCell-temp_matched_config_item`)
                let temp_config_obj = Cloneable.DeepCopy(temp_matched_config_item);
                // * Process Cell With Config.Processor Before Next Step
                cell = temp_config_obj.processor_({ cell: cell, config: temp_config_obj }).cell
                // * After Process, Check if Match Again
                if (!(temp_config_obj.Match(cell.key_))) {
                    continue;
                }
                cell = ProcessIndex({ cell: cell, config: temp_config_obj })
                testlog(cell.key_, `processed-key-ProcessCellForRef`)
                testlog(cell.value_, `processed-value-ProcessCellForRef`)
            }

            return cell
        }

        // * Ref Cell: Replace the Value of the cell
        // * If has __ref__ attr, treat as ref, repeatedly find its value
        function ProcessCellExtractRef(cell: Cell) {

            function RefReducer(accumulator: Cell, currentValue: any, index: any) {
                //* Use in .reduce
                let temp_ref_key = currentValue;
                let temp_ref_cell: Cell;
                let temp_cell = Cloneable.DeepCopy(accumulator);
                let temp_while_cache: any = null;
                while (!(temp_cell.IsSet() && temp_cell.value_[temp_ref_key])) {
                    //! testlog(temp_cell.IsSet(),`ProcessCellExtractRef-RefReducer: Ref key '${temp_ref_key}': temp_cell.IsSet()`, DEBUG_CLASSES_IF_LOG)
                    //! testlog(temp_cell.value_[temp_ref_key],`ProcessCellExtractRef-RefReducer: Ref key '${temp_ref_key}': temp_cell.value_[temp_ref_key]`, DEBUG_CLASSES_IF_LOG)
                    temp_cell = ProcessCellExtractRef(temp_cell);
                    if (lodash_0.isEqual(temp_cell, temp_while_cache)) {
                        temp_cell = new Cell();
                        break;
                    }
                    temp_while_cache = Cloneable.DeepCopy(temp_cell)
                }
                (temp_cell.IsSet()) ? temp_ref_cell = temp_cell.get_data_cell([temp_ref_key]) : temp_ref_cell = temp_cell

                // * If no key, see if has ref
                return temp_ref_cell;
            }

            //   * Ref to item iterately
            function get_data_cell_by_path_list_reduce(obj: Cell, path: any) {
                let temp_data_cell: Cell = obj;
                testlog("temp_data_cell", `get_data_cell_by_path_list_reduce-temp_data_cell: before`, DEBUG_CLASSES_IF_LOG_SILENT)

                temp_data_cell = path.reduce(RefReducer, temp_data_cell);

                testlog(HasSubRef(temp_data_cell), `get_data_cell_by_path_list_reduce-HasSubRef(temp_data_cell): before`, DEBUG_CLASSES_IF_LOG_SILENT)

                return temp_data_cell;
            }
            testlog(cell, `ProcessCellExtractRef-cell`)
            let v: any;
            if (cell.IsSet()) {
                v = cell.value_;
                testlog(v, `ProcessCellExtractRef-v`)

                // * Use __ref__ to extract data
                if (HasRef(v)) {
                    testlog(v, `ProcessCellExtractRef-v-with-Ref`, DEBUG_CLASSES_IF_LOG_SILENT);
                    testlog(v[REF_DATA_REF_PATH_LIST_KEY], `v has ref: v.${REF_DATA_REF_PATH_LIST_KEY}:`, DEBUG_CLASSES_IF_LOG_SILENT);
                    let temp_path_obj = Pipe.ProcessPathList(v[REF_DATA_REF_PATH_LIST_KEY]);
                    testlog(temp_path_obj, `ProcessCellExtractRef-temp_path_obj`, DEBUG_CLASSES_IF_LOG_SILENT)

                    // * If not found, is a null cell
                    let temp_cell_found = get_data_cell_by_path_list_reduce(self_cell, temp_path_obj);
                    if (temp_cell_found.IsSet()) {
                        v = temp_cell_found.value_
                        testlog(IsObject(v), `ProcessCellExtractRef-v-after-extract-ref: IsObject(v)`, DEBUG_CLASSES_IF_LOG_SILENT)
                        testlog(v.hasOwnProperty(REF_DATA_REF_PATH_LIST_KEY), `ProcessCellExtractRef-v-after-extract-ref: v.hasOwnProperty(${REF_DATA_REF_PATH_LIST_KEY})`, DEBUG_CLASSES_IF_LOG_SILENT)
                    } else {
                        v = null
                    };
                    testlog(v, `ProcessCellExtractRef-v-after-extract-ref`, DEBUG_CLASSES_IF_LOG_SILENT)

                }

                // TODO: Process `v` with the __filter__ and __export__
                // * Other Postprocessor Could be added here: Filter(), Export

                // * Export result
                cell.value_ = v;
            }
            return cell;
        }
        let self_cell = new Cell()
        self_cell.ReadObj(this.obj_)

        if (target_ref_cell.IsSet()) {
            if_update_self = false;
            ref_cell = target_ref_cell
        } else {
            if_update_self = true;
        }

        // * Refresh Config List before Extraction
        this.ExtractConfig()
        testlog(this.config_list_, `this.config_list_-after-extract: 0`, DEBUG_CLASSES_IF_LOG_SILENT)

        // * Match the Sublist of the config-list: return a list: use as "pipe processor"
        let temp_config_list = Cloneable.DeepCopy(this.config_list_) //! Not too early, must before Extract Config

        testlog(if_update_self, `if_update_self`, DEBUG_CLASSES_IF_LOG_SILENT)

        // * Prepare Cell for Ref, Filter, etc
        if (if_update_self) {
            self_cell = self_cell.IterateProcess(PreprocessCell)
        } else {
            ref_cell = ref_cell.IterateProcess(PreprocessCell)

        }
        testlog(this.config_list_, `this.config_list_-after-extract: 1`, DEBUG_CLASSES_IF_LOG_SILENT)

        testlog(ref_cell, `ExpandReference-ref_cell-after-PreprocessCell`, DEBUG_CLASSES_IF_LOG_SILENT)
        testlog(self_cell, `ExpandReference-self_cell-after-PreprocessCell`, DEBUG_CLASSES_IF_LOG_SILENT)
        // * Extract Ref
        function ExtractAllRef(target_cell: Cell) {// * Make Sure No Ref is left
            let iter_counter = 0;
            while (HasSubRef(target_cell)) {
                testlog(iter_counter, `iter_counter`, DEBUG_CLASSES_IF_LOG_SILENT)
                // * If not found, null cell, has no ref
                target_cell = target_cell.IterateProcess(ProcessCellExtractRef)
                iter_counter += 1;
            }
            return target_cell
        }
        testlog(this.config_list_, `this.config_list_-after-extract: 2`, DEBUG_CLASSES_IF_LOG_SILENT)

        if (if_update_self) {
            self_cell = ExtractAllRef(self_cell)
        } else {
            ref_cell = ExtractAllRef(ref_cell)

        }
        testlog(ref_cell, `ExpandReference-self-cell-after-ProcessCellExtractRef`, DEBUG_CLASSES_IF_LOG_SILENT)
        testlog(this.config_list_, `this.config_list_-after-extract: 3`, DEBUG_CLASSES_IF_LOG_SILENT)

        if (if_update_self) {
            // * Write Data Back
            this.obj_.value_ = self_cell.WriteObj().value_;
            // * Update the config_list, for future reference
            this.ExtractConfig()
            testlog(this.config_list_, `Expand: this.config_list_`)
            testlog(this.config_list_, `this.config_list_-after-extract: 4`, DEBUG_CLASSES_IF_LOG_SILENT)

        } else {
            if (!ref_cell.IsSet()) {
                testlog(target_ref_cell, `target_ref_cell: nothing found`, DEBUG_CLASSES_IF_LOG_SILENT)
            }
            target_ref_cell.ReadObj(ref_cell.WriteObj())
        }
        return target_ref_cell

    }
    ExpandReference() {
        this.ExpandCellReference()
    }

}

// `Ref's Postprocessor: Cmd
type PipeProcessor = (input: any) => any;
type PipeExtractor = (input: string | null) => any;
class Pipe {
    private _delimiter: string | RegExp;
    private _processor: PipeProcessor;
    private _extractor: PipeExtractor;
    private _cmd_dict: Dict;
    private _key: string;
    constructor(input: { key: string, delimiter: string | RegExp, processor: PipeProcessor, extractor: PipeExtractor }) {
        this.key_ = input.key;
        this.delimiter_ = input.delimiter;
        this.processor_ = input.processor;
        this.extractor_ = input.extractor;
    }
    set delimiter_(v: any) {
        this._delimiter = v;
    }
    get delimiter_() {
        return this._delimiter;
    }
    set processor_(v: any) {
        this._processor = v;
    }
    get processor_() {
        return this._processor;
    }
    set cmd_dict_(v: any) {
        this._cmd_dict = v;
    }
    get cmd_dict_() {
        return this._cmd_dict;
    }
    set extractor_(v: any) {
        this._extractor = v;
    }
    get extractor_() {
        return this._extractor;
    }
    set key_(v: any) {
        this._key = v;
    }
    get key_() {
        return this._key;
    }

    static PassThrough(input: any) {
        return input
    }
    static ExtractPathList(input: string | null) {
        if (input) {
            return String(input).trim().split(REF_PATH_DELIMITER)
        } else {
            return []
        }
    }
    static ProcessPathList(temp_path_obj: any) {
        if (IsObject(temp_path_obj)) {
            testlog(temp_path_obj);
            let temp_path_list = Array(Object.keys(temp_path_obj).length).fill("");
            testlog(temp_path_list);
            // * Get items with number index
            for (let k in temp_path_obj) {
                let v = temp_path_obj[k];
                let k_int = ObjectToInt(k);
                if (k_int != null) {
                    temp_path_list[k_int] = v;
                }
            }
            // * Remove Empty path items
            temp_path_list = temp_path_list.filter(temp_str => temp_str);

            temp_path_obj = temp_path_list;
        }
        return temp_path_obj
    }
    static ExtractAsJSON(input: string | null): Object | null {
        testlog(input, `extract-json-text`)
        let temp_json_text = `{${input}}`;
        testlog(temp_json_text, `extract-json-text--temp_json_text`);
        return input != null ? JSON.parse(temp_json_text) : input;
    }

    WriteDict() {
        var temp_dict = <any>{
            [this.key_]: this.cmd_dict_
        }
        return temp_dict
    }

}

export class Cmd {
    private _text: string;
    private _input: any;
    private _pipe_list: [Pipe?];
    private _default_pipe_list = [
        new Pipe({
            key: REF_DATA_REF_PATH_LIST_KEY,
            delimiter: /$/g,
            processor: (input: any) => input,
            extractor: Pipe.ExtractPathList
        }),
        new Pipe({
            key: "__filter__",
            delimiter: "||",
            processor: (input: any) => input,
            extractor: Pipe.ExtractAsJSON
        }),
        new Pipe({
            key: "__export__",
            delimiter: ">>",
            processor: (input: any) => input,
            extractor: Pipe.ExtractAsJSON
        }),
    ]

    constructor(input: { text: string, pipe_list: [Pipe?] }) {
        this.text_ = input.text;
        this.pipe_list_ = ((IsArray(input.pipe_list)) && input.pipe_list.length > 0) ? input.pipe_list : this._default_pipe_list;

        // * Run the Update Pipe List after init
        this.UpdatePipeList()
    }

    set text_(v: any) {
        this._text = v.trim();
    }
    get text_() {
        return this._text.trim();
    }

    set input_(v: any) {
        this._input = v;
    }
    get input_() {
        return this._input;
    }

    set pipe_list_(v: any) {
        this._pipe_list = v;
    }
    get pipe_list_() {
        return this._pipe_list;
    }

    UpdatePipeList() {

        function SplitTextByPipeList(command_text: any, temp_pipe_list: Pipe[]) {
            testlog(temp_pipe_list, `pipe-list-before-extract-cmd`)

            function IsRegExp(temp_obj: any) {
                return (temp_obj instanceof RegExp)
            }

            function IfFoundInText(ori_text: string, obj_to_search: any) {
                if (IsRegExp(obj_to_search)) {
                    return obj_to_search.test(ori_text)
                } else {
                    return ori_text.includes(obj_to_search)
                }
            }
            var command_dict = <any>{}
            let temp_1 = ""
            temp_1 = command_text;

            for (let temp_pipe_obj of temp_pipe_list) {
                let temp_splitter1 = temp_pipe_obj.delimiter_;

                (temp_1 != null) ? temp_1 = temp_1.split(temp_splitter1)[0] : temp_1 = temp_1;
                let temp_2 = command_text.split(temp_splitter1).slice(-1)[0];

                for (let temp_pipe_obj of temp_pipe_list) {
                    let temp_splitter2 = temp_pipe_obj.delimiter_
                    temp_2 = temp_2.split(temp_splitter2)[0]

                }

                // * Remove not found splitter
                if (!IfFoundInText(command_text, temp_splitter1)) {
                    testlog(`NOT FOUND: '${temp_splitter1}', Set as 'null'`)
                    temp_2 = null
                }
                // * Extract Text
                let temp_extracted_text = temp_2
                // * Post Process with Extractor
                temp_pipe_obj.cmd_dict_ = temp_pipe_obj.extractor_(temp_extracted_text)

            }

            testlog(temp_pipe_list, `pipe-list-after-extract-cmd`)

            return temp_pipe_list
        }
        this.pipe_list_ = SplitTextByPipeList(this.text_, this.pipe_list_)
        return Cloneable.DeepCopy(this.pipe_list_)
    }

    ExportPipeListToDict() {
        var temp_dict = <any>{}
        for (const temp_pipe_item of this.pipe_list_) {
            temp_dict = Object.assign({}, temp_dict, temp_pipe_item.WriteDict())
        }
        return temp_dict
    }

}

// `Processors for both key and value
// * Referencer

// * Importer
export class Filter {
    private _cell: Cell = new Cell(); //* Store Attribute for Filtering
    private _logic_text: string;
    private _logic_is_AND: boolean = false;
    private _key: any[] = [];
    private _key_map: { [key: string]: string } = {
        [ALIAS_LOGIC_KEY]: "_logic_text",
        [ALIAS_KEY_KEY]: "_key"
    }
    set cell_(v: Cell) {
        this._cell = v;
    }
    get cell_() {
        return this._cell;
    }
    set logic_(v: string) {
        let temp_str = String(v).toLowerCase().trim()
        switch (temp_str) {
            case "and":
                this._logic_is_AND = true
                break;
            case "or":
                this._logic_is_AND = false
                break;
            default:
                break;
        }
        this._logic_text = temp_str
    }
    get logic_() {
        return (this._logic_is_AND) ? "AND" : "OR"
    }

    constructor() {

    }

    IsSet() {
        return ((this._key.length > 0) || (this.cell_.IsSet()))
    }

    ReadObj(temp_obj: Obj) {
        this.cell_ = new Cell();
        this.cell_.ReadObj(new Obj(temp_obj.key_, {}));
        if (IsObject(temp_obj.value_)) {
            for (const [temp_key, temp_value] of Object.entries(temp_obj.value_)) {
                if (this._key_map.hasOwnProperty(temp_key)) {
                    let temp_mapped_key: keyof Filter = (this._key_map[temp_key]) as keyof Filter
                    this[temp_mapped_key] = temp_value as any
                } else {
                    this.cell_.value_[temp_key] = temp_value
                }
            }
        } else {
            this.cell_.value_ = temp_obj.value_
        }
        this.logic_ = this._logic_text
    }

    ReadCell(temp_cell: Cell) {
        this.ReadObj(temp_cell.WriteObj());
        this.cell_.path_ = temp_cell.path_;
    }

    FilterCell(cell: Cell) {
        const logic_is_AND = this._logic_is_AND
        function ProcessStringForMatch(str: any) {
            return String(str).toLowerCase().trim()
        }
        // * Input cell, filter it with this.cell: as path & value match
        function IfIncludeString(container_obj: any, str: string) {
            let temp_if_include: boolean = false;

            function ProcessCellIfIncludeString(temp_cell: Cell) {
                temp_cell.key_ = ProcessStringForMatch(temp_cell.key_)
                if (!(IsArray(temp_cell.value_) || IsObject(temp_cell.value_))) {
                    temp_cell.value_ = ProcessStringForMatch(temp_cell.value_)
                    temp_if_include = temp_if_include || (temp_cell.value_ === ProcessStringForMatch(str))
                }
                return temp_cell
            }

            if (IsArray(container_obj)) {
                temp_if_include = container_obj.includes(str)
            } else if (IsObject(container_obj)) {
                // * If string is key or a value
                let temp_cell = (new Cell("", container_obj))

                temp_cell.IterateProcess(ProcessCellIfIncludeString)

            } else if (IsString(str)) {
                temp_if_include = container_obj === str;
            } else {
                temp_if_include = String(container_obj) == String(str);
            }
            return temp_if_include
        }
        function DataReducer(accumulator: any, currentValue: any, index: any) {
            function FilterReducer(accumulator: any, currentValue: any, index: any) {
                testlog(accumulator, `FilterReducer[${index}]-accumulator`)
                testlog(currentValue, `FilterReducer[${index}]-currentValue`)

                let temp_key = currentValue;
                let temp_value = <any[]>temp_filter_cell.value_[temp_key]
                testlog(temp_value, `FilterReducer[${index}]-temp_value`)

                let if_found_in_cell: boolean = false
                // * Loop Through Filter, see if data's path's value in filter's cell
                let temp_path_list = Pipe.ExtractPathList(temp_key)
                testlog(temp_path_list, `FilterReducer[${index}]-temp_path_list`)

                let temp_matched_cell = temp_sub_cell.get_data_cell(temp_path_list)
                testlog(temp_matched_cell, `FilterReducer[${index}]-temp_matched_cell`)

                if (temp_matched_cell.value_ != null) {
                    // * Means Path Exist
                    if_found_in_cell = IfIncludeString(temp_value, temp_matched_cell.value_);
                }
                testlog(if_found_in_cell, `FilterReducer[${index}]-if_found_in_cell-before`)
                if_found_in_cell = (logic_is_AND) ? (accumulator && if_found_in_cell) : (accumulator || if_found_in_cell);
                testlog(if_found_in_cell, `FilterReducer[${index}]-if_found_in_cell-after`)
                return if_found_in_cell

            }

            let temp_sub_cell = new Cell(currentValue, temp_data_cell.value_[currentValue])
            let temp_if_found_in_cell: boolean = false;
            let temp_if_found_in_key: boolean = false;

            testlog(logic_is_AND, `DataReducer[${index}]-logic_is_AND`)
            testlog(currentValue, `DataReducer[${index}]-currentValue`)

            temp_if_found_in_key = IfIncludeString(temp_filter_keys, currentValue);
            testlog(temp_if_found_in_key, `DataReducer[${index}]-temp_if_found_in_key`)

            // * Loop Through Filter, see if data's path's value in filter's cell
            temp_if_found_in_cell = Object.keys(temp_filter_cell.value_).reduce(FilterReducer, logic_is_AND)
            testlog(temp_if_found_in_cell, `DataReducer[${index}]-temp_if_found_in_cell`)

            let temp_if_found: boolean = (logic_is_AND) ? (temp_if_found_in_key && temp_if_found_in_cell) : (temp_if_found_in_key || temp_if_found_in_cell)
            testlog(temp_if_found, `DataReducer[${index}]-temp_if_found`)

            if (temp_if_found) {
                let temp_ori_key = Object.keys(cell.value_)[index]
                accumulator[temp_ori_key] = cell.value_[temp_ori_key]
            }
            return accumulator
        }
        function ProcessCellForMatch(temp_cell: Cell) {

            temp_cell.key_ = ProcessStringForMatch(temp_cell.key_)
            if (!(IsArray(temp_cell.value_) || IsObject(temp_cell.value_))) {
                temp_cell.value_ = ProcessStringForMatch(temp_cell.value_)
            }
            return temp_cell
        }
        let result_cell = Cloneable.DeepCopy(cell)
        let temp_filter_keys = this._key.map(ProcessStringForMatch)
        let temp_filter_cell = this.cell_.IterateProcess(ProcessCellForMatch)
        let temp_data_cell = cell.IterateProcess(ProcessCellForMatch)
        if (this.IsSet()) {//* Only Run when set
            let filtered_value = Object.keys(temp_data_cell.value_).reduce(DataReducer, {})
            result_cell.value_ = filtered_value;
        }

        return result_cell
    }

}
// * Exporter
class Path {
    private _full: string;
    private _project: string = process.cwd();
    private _rela_dir: string = DEFAULT_RELATVIE_DIR_PATH;
    constructor() {

    }
    set_path(input: { filename: string, project_root: string }) {
        (input.project_root != null) ? this._project = input.project_root : this._project = this._project;
        if (input.filename != null) {
            let filename_processed = input.filename.trim()
            if (filename_processed[0] != "/" && filename_processed.length > 0) {
                this._full = `${this._project}/${this._rela_dir}/${filename_processed}`
            } else if (filename_processed.length > 0) {
                this._full = filename_processed
            }
        }
    }

    WriteCell() {
        let temp_dict = {
            "full": this.full_,
            "rela": this.rela_,
            "filename": this._full.split(/(\\|\/)/g).pop(), //* With Ext
            "name": path_0.parse(this._full).name, //* Without Ext
            "dir": path_0.dirname(this._full),
            "ext": path_0.extname(this._full),
            "rela_dir": this.rela_dir_
        }
        let temp_key = EXPORTER_PATH_KEY
        return (new Cell(temp_key, temp_dict))
    }

    IsSet() {
        return (this._full != null) && (IsString(this._full)) && (this._full.length > 0) && (this._full[0] == "/")
    }
    get rela_() {
        return path_0.relative(this._project, this._full)
    }
    get full_() {
        return this._full
    }
    get project_root_() {
        return this._project
    }
    get rela_dir_() {
        return path_0.dirname(path_0.relative(this.project_root_, this.full_))
    }
}
export type KeyMapDict = { [k: string]: (v: any) => any };
export class Exporter {
    private _export_text_formatter: Formatter = new Formatter();
    private _text_formatter: Formatter = new Formatter();
    private _path_text: string;
    private _path: Path;
    private _dict_obj: Dict;
    private _key_map: KeyMapDict = {
        [ALIAS_FORMAT_KEY]: (v: any) => (this._text_formatter.format_ = v),
        [ALIAS_DELIMITER_KEY]: (v: any) => (this._text_formatter.delimiter_ = v),
        [ALIAS_PATH_KEY]: (v: any) => (this._path_text = v)
    }
    constructor() {

    }

    Setup(input: { data_dict: Dict, export_formatter: Formatter, pipe_cell: Cell }) {
        this._dict_obj = input.data_dict
        this.export_text_formatter_ = input.export_formatter;
        this.ReadCell(input.pipe_cell)
    }

    set export_text_formatter_(v: Formatter) {
        this._export_text_formatter = v
    }
    get export_text_formatter_() {
        return this._export_text_formatter
    }
    private set_text_attr(key: string, value: any) {
        if (!(this._text_formatter.cell_.value_.hasOwnProperty(EXPORTER_ATTR_KEY))) {
            this._text_formatter.cell_.value_[EXPORTER_ATTR_KEY] = <any>{}
        }
        if (key) {
            this._text_formatter.cell_.value_[EXPORTER_ATTR_KEY][key] = value

        } else { //* Overwrite the Value if key is empty
            this._text_formatter.cell_.value_[EXPORTER_ATTR_KEY] = value

        }
    }
    private get_text_attr(key: string) {
        let temp_result: any;
        if ((this._text_formatter.cell_.value_.hasOwnProperty(EXPORTER_ATTR_KEY))) {
            if (key) {
                if (this._text_formatter.cell_.value_[EXPORTER_ATTR_KEY].hasOwnProperty(key)) {
                    temp_result = this._text_formatter.cell_.value_[EXPORTER_ATTR_KEY][key]
                } else {
                    temp_result = null
                }

            } else { //* Overwrite the Value if key is empty
                temp_result = this._text_formatter.cell_.value_[EXPORTER_ATTR_KEY]

            }
        } else {
            temp_result = null
        }
        return temp_result

    }
    ReadCell(cell: Cell) {
        testlog(cell, `Exporter-ReadCell-cell: before-ref`, DEBUG_CLASSES_IF_LOG_SILENT)
        // * Ref Cell
        let temp_cell: Cell = new Cell("", {});
        if (this._dict_obj != null) {
            testlog(this._dict_obj, `Exporter-ReadCell-this._dict_obj: before-ref`, DEBUG_CLASSES_IF_LOG_SILENT)
            temp_cell = this._dict_obj.ExpandCellReference(cell)
        }
        testlog(temp_cell, `Exporter-ReadCell-temp_cell: after-ref`, DEBUG_CLASSES_IF_LOG_SILENT)
        if (temp_cell.IsSet()) {
            for (const [temp_key, temp_value] of Object.entries(temp_cell.value_)) {
                if (this._key_map.hasOwnProperty(temp_key)) {
                    this._key_map[temp_key](temp_value)
                } else {
                    this.set_text_attr(temp_key, temp_value)
                }
            }
        }
        // * Merge Formatter's Properties into the Text Formatter
        this.set_text_attr("", Object.assign(
            {},
            this.get_text_attr(""),
            this.export_text_formatter_.cell_.value_
        ))
        this.UpdatePath()

    }
    UpdatePath() {
        this._path = new Path();
        this._path.set_path({ filename: this._path_text, project_root: process.cwd() })
        if (this._path.IsSet()) {
            let temp_path_cell = this._path.WriteCell()
            this.set_text_attr(temp_path_cell.key_, temp_path_cell.value_)
        }
    }

    IsSet() {
        // * Export-formatter is not necessary to be set
        let if_self_set = (this._path.IsSet()) && (this._text_formatter.IsSet())
        testlog(if_self_set, "if exporter is set")
        return if_self_set
    }

    ToString() {
        // * if path is set, use exporter data, else, just formatter's
        let result_str: string = "";
        if (this.IsSet()) {
            this.set_text_attr(EXPORTER_DATA_KEY, this.export_text_formatter_.ToString())
            testlog(this.get_text_attr(EXPORTER_DATA_KEY), "Exporter-ToString-_data_")
            result_str = this._text_formatter.ToString()
            // TODO: Write text to file
        } else {
            result_str = this.export_text_formatter_.ToString()
        }
        return result_str
    }

    async Export() {
        // * Update Path
        this.UpdatePath()
        // * Generate String in File and Data to Export
        let temp_in_text_str = this.ToString()
        if (this.IsSet()) {    // * WriteFile
            let file_content = this.get_text_attr(EXPORTER_DATA_KEY);
            let file_path = this._path.full_
            testlog(this._path, `Exporter-Export-this._path`)
            let if_overwrite = (this._path.rela_dir_ == DEFAULT_RELATVIE_DIR_PATH) || (!helper_0.fileExists(file_path));
            if (if_overwrite) {
                await helper_0.writeFile({ target: file_path, content: file_content });
                testlog(file_content, `Exporter-Export: to '${file_path}'`)
            }
        }
        return temp_in_text_str
    }

}
// * Formatter
export class Formatter {
    private _format: string = "";
    private _delimiter: string = "";
    private _cell: Cell = new Cell();
    private _key_map: KeyMapDict = {
        [ALIAS_FORMAT_KEY]: (v: any) => (this.format_ = String(v)),
        [ALIAS_DELIMITER_KEY]: (v: any) => (this.delimiter_ = String(v)),
    }
    constructor() {
    }
    set format_(v: string) {
        this._format = v;
    }
    get format_() {
        return this._format;
    }
    set delimiter_(v: string) {
        this._delimiter = v;
    }
    get delimiter_() {
        return this._delimiter;
    }

    set cell_(v: Cell) {
        this._cell = v;

    }
    get cell_() {
        return this._cell;
    }

    ReadObj(temp_obj: Obj) {
        this.cell_ = new Cell();
        this.cell_.ReadObj(new Obj(temp_obj.key_, {}));
        if (IsObject(temp_obj.value_)) {
            for (const [temp_key, temp_value] of Object.entries(temp_obj.value_)) {
                if (temp_key === ALIAS_FORMATTER_OBJ_KEY && IsObject(temp_value)) {
                    for (const [temp_formatter_key, temp_formatter_value] of Object.entries(temp_value as any)) {
                        if (Obj.HasPropertyOrMethod(this, temp_formatter_key)) {
                            this[temp_formatter_key as keyof Formatter] = temp_formatter_value as any;
                        } else if (this._key_map.hasOwnProperty(temp_formatter_key)) {
                            this._key_map[temp_formatter_key](temp_formatter_value)
                        }
                    }
                } else {
                    this.cell_.value_[temp_key] = temp_value
                }
            }
        } else {
            this.cell_.value_ = temp_obj.value_
        }
    }

    ReadCell(temp_cell: Cell) {
        this.ReadObj(temp_cell.WriteObj());
        this.cell_.path_ = temp_cell.path_;
    }

    IsSet() {
        return (this.format_.length > 0)
    }

    static ProcessCellToString(cell: Cell) {
        let temp_value = <any>cell.value_;
        let result_string = <string>"";
        if (IsObject(temp_value)) {
            let temp_formatter = new Formatter()
            temp_formatter.ReadCell(cell)
            if (temp_formatter.IsSet()) {
                result_string = temp_formatter.ToString()
            } else {
                result_string = cell.ToJSON_TextProcessed() //! Temp Solution
            }
        } else if (IsArray(temp_value)) {
            // TODO: Process Array to Text
            result_string = cell.ToJSON_TextProcessed() //! Temp Solution
        } else if (IsString(temp_value)) {
            result_string = temp_value
        } else {
            result_string = String(temp_value)
        }
        return result_string;
    }

    ToString() {
        let temp_formatted_str: string = "";
        let temp_formatted_list = []
        if (this.IsSet()) {//* if not set, return ""
            for (const [temp_key, temp_value] of Object.entries(this._cell.value_)) {
                let temp_sub_cell = new Cell(temp_key, temp_value);
                temp_sub_cell.path_ = this._cell.path_.concat([temp_key])
                testlog(temp_sub_cell, "Formatter-ToString-temp_sub_cell", DEBUG_CLASSES_IF_LOG_SILENT)
                temp_formatted_list.push(this.FormatSubCell(temp_sub_cell))
            }
            temp_formatted_str = temp_formatted_list.join(this.delimiter_)
        } else {
            temp_formatted_str = Formatter.ProcessCellToString(this.cell_)
        }
        return temp_formatted_str
    }

    FormatSubCell(sub_cell: Cell) {
        // * RegExp Function for Re-formatting Each Replacement, eg. ori to UPPER, CamelCase, etc
        function Reformatter(match: any, p1: any, p2: any, offset: any, string: any) {
            // * to camel form
            function Camelize(str: string) {
                return str
                    .replace(/\s(.)/g, function (a) {
                        return a.toUpperCase();
                    })
                    .replace(/\s/g, '')
                    .replace(/^(.)/, function (b) {
                        return b.toLowerCase();
                    });
            }
            // * to title case
            function Titlize(temp_string: string, keep_upper_case: boolean = true) {
                var i, j, str, lowers, uppers;
                str = convertIdentifierCase(temp_string, FMT_PROC_KEY_TITLE_CASE, keep_upper_case);
                lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
                    'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
                for (i = 0, j = lowers.length; i < j; i++)
                    str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
                        function (txt: string) {
                            return txt.toLowerCase();
                        });

                uppers = ['Id', 'Tv'];
                for (i = 0, j = uppers.length; i < j; i++)
                    str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'),
                        uppers[i].toUpperCase());

                return str;
            }
            // * Remove Special Char, keeps Chinese?
            function RemoveSpecial(temp_string: string, if_keep_chinese: boolean = false) {
                let result_string = temp_string;
                if (if_keep_chinese) {
                    result_string = result_string.replace(/[^a-zA-Z0-9\-_\u4E00-\u9FFF]/g, ' ');
                } else {
                    result_string = result_string.replace(/[^a-zA-Z0-9\-_]/g, ' ');
                }

                result_string = result_string.replace(/ {2,}/g, ' ');
                return result_string
            }

            // * Escape Double Quote
            function EscapeDoubleQuote(str:any) {
                let temp_replace_text = String(str);
                temp_replace_text = JSON.stringify(temp_replace_text);
                temp_replace_text = temp_replace_text.slice(1, temp_replace_text.length-1)
                return temp_replace_text
            }

            // ~Loop through each instruction
            // * p1 is the path of target, p2 is the post process pipe of the text
            testlog(`match: ${match}; p1: ${p1}; p2: ${p2};`);
            let target_path_str = p1;
            let process_pipe_str = p2;

            // TODO: get value from obj's attr
            let replace_text = <any>null;
            // * Get Cell From Path
            let target_path_list = Pipe.ExtractPathList(target_path_str);
            testlog(sub_cell, "FormatSubCell-sub_cell", DEBUG_CLASSES_IF_LOG_SILENT)
            testlog(target_path_list, "FormatSubCell-target_path_list", DEBUG_CLASSES_IF_LOG_SILENT)
            let replace_cell = sub_cell.get_data_cell(target_path_list, FORMATTER_IF_STRICT);
            testlog(replace_cell, "FormatSubCell-replace_cell", DEBUG_CLASSES_IF_LOG_SILENT)
            // TODO: ProcessCellToString
            replace_text = Formatter.ProcessCellToString(replace_cell)
            testlog(replace_text, "FormatSubCell-replace_text", DEBUG_CLASSES_IF_LOG_SILENT)

            testlog(`\nTEST0010 replace_text: "${replace_text}"`,DEBUG_CLASSES_IF_LOG_SILENT);
            replace_text = String(replace_text);
            // * check if a configuration string found
            let has_configuration = (process_pipe_str != null);
            testlog(has_configuration);
            if (has_configuration) {
                // * Preprocess the configuration, to a list of instruction text
                let config_text = process_pipe_str.trim().toLowerCase().replace(/^\W|\W$/gi, '');
                testlog(config_text);
                let config_list = config_text.split(":")
                testlog(config_list);
                // *Run instructions One by One
                for (var config_instruction of config_list) {
                    testlog(`current instruction: "${config_instruction}"`)
                    // * If use the converter directly in ./identifier
                    if (IfExistConverter(config_instruction)) {
                        testlog(config_instruction, `config_instruction: use default converter`)
                        replace_text = convertIdentifierCase(replace_text, config_instruction, true);
                        continue;
                    }

                    switch (config_instruction) {
                        case "upper": {
                            replace_text = replace_text.toUpperCase();
                            break;
                        }
                        case "lower": {
                            replace_text = replace_text.toLowerCase();
                            break;
                        }
                        case "camel": {
                            replace_text = Camelize(replace_text);
                            break;
                        }
                        case "title": {
                            replace_text = Titlize(replace_text);
                            break;
                        }
                        case "standard": {
                            replace_text = RemoveSpecial(replace_text, true);
                            break;
                        }
                        case "id": {
                            // *Convert to be used as GitHub id, and also in filename
                            // TODO: if all uppercase, not preserve
                            replace_text = RemoveSpecial(replace_text, false).trim();
                            replace_text = replace_text.replace(/ /g, '-');
                            break;
                        }
                        case "color-hex-code": {
                            // *Convert to be used as GitHub id, and also in filename
                            // TODO: if all uppercase, not preserve
                            testlog(`TEST0011 color-hex-code for ${replace_text}`)
                            replace_text = RemoveSpecial(replace_text, false);
                            replace_text = replace_text.replace(/ /g, '');
                            replace_text = replace_text.trim();
                            testlog(`TEST0011 final color-hex-code for ${replace_text}`)
                            break;
                        }
                        case "encode": {
                            replace_text = encodeURIComponent(replace_text);
                            break;
                        }
                        case "decode": {
                            replace_text = decodeURIComponent(replace_text);
                            break;
                        }
                        case "encode-base64": {
                            replace_text = Buffer.from(replace_text).toString('base64');
                            break;
                        }
                        case "decode-base64": {
                            replace_text = Buffer.from(replace_text,'base64');
                            break;
                        }
                        case "escape": {
                            replace_text = EscapeDoubleQuote(replace_text);
                            break;
                        }
                        default: {
                            replace_text = replace_text;
                            break;
                        }
                    }
                }

            }
            testlog(replace_text);
            return replace_text
        }

        let replace_key = '.*?';

        let replace_ori_string = `${FORMAT_PREFIX_ESCAPED} *(${replace_key.trim()})(:[:_\\w-]*)* *?${FORMAT_SUFFIX_ESCAPED}`;
        testlog(`TEST00 Replace Ori String: ${replace_ori_string}`);
        testlog(`TEST0000 format_string: ${this.format_}`);
        let replace_ori_string_regex_obj = new RegExp(replace_ori_string, "g");
        let formatted_string = this.format_.replace(replace_ori_string_regex_obj, Reformatter)
        return formatted_string
    }

}

// `Preprocessor
function ProcessIndex(input: { cell: Cell, config: Config }) {
    // * Get key from pre-key-sur
    input.cell.key_ = input.config.Extract(input.cell.key_)
    testlog(input.config, `ProcessIndex-input.config`)
    // * Get value from pipe list
    let temp_cmd_text = input.cell.value_;
    let temp_cmd_obj = new Cmd({ text: temp_cmd_text, pipe_list: [] })
    temp_cmd_obj.UpdatePipeList()

    // * Switch Path Between Sibling and other Relative Path
    let temp_pipe_dict = temp_cmd_obj.ExportPipeListToDict()
    let cell_path = Cloneable.DeepCopy(input.cell.path_);
    let config_abs_path = Cloneable.DeepCopy(input.config.path_);
    let ref_rela_path = Cloneable.DeepCopy(temp_pipe_dict[REF_DATA_REF_PATH_LIST_KEY]);
    testlog(cell_path, `ProcessIndex-cell_path`)
    testlog(config_abs_path, `ProcessIndex-config_abs_path`)
    testlog(ref_rela_path, `ProcessIndex-ref_rela_path`)

    function PathReducer(accumulator: any, currentValue: any, index: any) {
        let temp_path_str = <any>String(currentValue).trim()
        var temp_path_list = accumulator;
        testlog(temp_path_str, `ProcessIndex-PathReducer-temp_path_str`)
        testlog(temp_path_list, `ProcessIndex-PathReducer-temp_path_list`)

        switch (temp_path_str) {
            case REF_SIBLING_PATH_KEY:
                temp_path_list = cell_path.slice(0, -1);
                temp_path_str = ""
                break;
            case REF_PARENT_PATH_KEY:
                testlog(temp_path_list,"PathReducer-REF_PARENT_PATH_KEY==true: current temp_path_list-before",DEBUG_CLASSES_IF_LOG_SILENT);
                testlog(cell_path,"PathReducer-REF_PARENT_PATH_KEY==true: current temp_path_list",DEBUG_CLASSES_IF_LOG_SILENT);
                temp_path_list = temp_path_list.slice(0, -1);
                temp_path_str = ""
                testlog(temp_path_list,"PathReducer-REF_PARENT_PATH_KEY==true: current temp_path_list-after",DEBUG_CLASSES_IF_LOG_SILENT);

                break;
            default:
                temp_path_list = temp_path_list.concat([temp_path_str])
                break;
        }
        return temp_path_list
    }

    // * Convert Extracted Dict's path to full path
    let temp_raw_path = config_abs_path.concat(ref_rela_path);
    testlog(temp_raw_path, `ProcessIndex-temp_raw_path`)

    temp_pipe_dict[REF_DATA_REF_PATH_LIST_KEY] = temp_raw_path.reduce(PathReducer, []).map((key: string) => Config.GeneralExtract(key))
    testlog(temp_pipe_dict[REF_DATA_REF_PATH_LIST_KEY], `ProcessIndex-temp_pipe_dict[REF_DATA_REF_PATH_LIST_KEY]`)

    input.cell.value_ = temp_pipe_dict
    return input.cell
}

// `Support Functions
// * Match Prefix and Suffix
function IfKeyMatchXxxfix(key: any, prefix: any, suffix: any) {
    let temp_key = String(key).trim()
    let temp_prefix = String(prefix).trim()
    let temp_suffix = String(suffix).trim()

    return (temp_key.startsWith(temp_prefix) && temp_key.endsWith(temp_suffix))
}

// * Log When Test
export function testlog(obj: any, intro_text: any = "", if_silent: boolean = DEFAULT_IF_TESTLOG_SILENT) {
    if (!if_silent) {
        console.log(blue(`\n-${(performance.now() - START_TIME).toFixed(3)}-> ${String(intro_text)}:`))
        console.log(IsString(obj) ? obj : JSON.stringify(obj, null, 4));
        console.log(yellow(`\n${"-".repeat(40)}\n`))

    }
}
export function FormalLog(obj: any, intro_text: any) {
    testlog(obj, intro_text, false);
}

// * Split Pipe Command: main and pipe

// `Ref FUNCTIONS
export function IsObject(obj: unknown): boolean {
    if (obj == null) {
        return false;
    }
    return typeof obj === "object" && !Array.isArray(obj);
}

export function IsArray(obj: unknown): boolean {
    return Array.isArray(obj);
}

export function IsFunction(obj: unknown): boolean {
    return (typeof obj === 'function');
}

export function IsString(obj: unknown): boolean {
    return typeof obj === "string" || obj instanceof String;
}

export function IsNumeric(obj: any) {
    if (!IsString(obj)) return false;
    return (
        !isNaN(obj) && !isNaN(parseFloat(obj))
    );
}

export function ObjectToInt(obj: any) {
    if (IsNumeric(obj)) {
        return parseInt(obj);
    } else {
        return null;
    }
}

export function ObjectToNumber(obj: any) {
    if (IsNumeric(obj)) {
        return +obj;
    } else {
        return null;
    }
}

export function NormalizeKey(key: any, value: any = null, path_list: any = null) {
    if (IsString(key) || IsNumeric(String(key))) {
        return String(key).trim();
    } else {
        return null;
    }
}

export function NormalizeValue(key: any, value: any = null, path_list: any = null) {
    if (IsString(value) || IsNumeric(String(value))) {
        return String(value);
    } else {
        return value;
    }
}

// * Src: https://stackoverflow.com/questions/7893776/the-most-accurate-way-to-check-js-objects-type
export function Type(target: any) {
    return typeof target
}

export function IsObjectInstance(input: { obj: any, type: any }) {
    if (Type(input.obj) === 'object') {
        return (input.obj instanceof input.type)
    } else {
        return false
    }
}

// ` for Text Generation
export class TextData {
    private _text = "";
    private _raw_obj: Obj;
    private _dict_obj: Dict;
    set obj_(v: Obj) {
        this._raw_obj = v
    }
    get obj_() {
        return this._raw_obj
    }
    set dict_(v: Dict) {
        this._dict_obj = v
    }
    get dict_() {
        return this._dict_obj
    }
    set text_(v: any) {
        this._text = String(v)
    }
    get text_() {
        return this._text
    }
    constructor(obj: Obj) {
        this.Setup(obj)
    }
    Setup(obj: Obj) {
        this.obj_ = obj;
        this.UpdateData()
    }
    UpdateData() {
        this.dict_ = new Dict(this.obj_.value_)

        this.text_ = this.obj_.ToJSON_Text()
    }
    ExpandData() {
        this.dict_.ExpandReference()
    }
    WriteObj(){
        return new Obj(this.obj_.key_,this.dict_.obj_.value_)
    }
}
type RefDataInput = { src_raw_obj: any, blueprint_raw_obj: any };
export class RefData {
    src_data_obj: TextData;
    blueprint_data_obj: TextData;
    constructor(input: RefDataInput) {
        this.Setup(input)
    }
    Setup(input: RefDataInput) {
        this.src_data_obj = new TextData(new Obj("src", input.src_raw_obj))
        this.blueprint_data_obj = new TextData(new Obj("blueprint", input.blueprint_raw_obj))
        // this.Expand()
    }
    Expand() {
        // * Order of Expand Matters, first src, then blueprint
        this.src_data_obj.ExpandData()

        testlog(this.src_data_obj.dict_.config_list_, `RefData-Expand-this.src_data_obj.dict_.config_list_: start-cross-expand`)
        // * Ref to Data
        let temp_cell = new Cell()
        temp_cell.ReadObj(this.blueprint_data_obj.dict_.obj_)
        let temp_expand_cell = this.src_data_obj.dict_.ExpandCellReference(temp_cell)
        this.blueprint_data_obj = new TextData(temp_expand_cell.WriteObj())
    }
}