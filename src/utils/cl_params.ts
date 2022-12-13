// 2022年12月08日23:42:46
import * as args from '@wrule/args';

export
function FillParams(params: any) {
  Object.entries(args.parse(process.argv)).forEach(([key, value]) => {
    if (!(key in params)) throw `unknown param ${key}`;
    params[key] = value;
  });
  console.log(`./${args.file_name(process.argv[1])} ${args.unparse_str(params)}`);
  console.log(params);
}
