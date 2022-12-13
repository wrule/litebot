// 2022年12月08日23:42:46
import * as args from '@wrule/args';

function params_command_line_view(params: any) {
  const cp = { ...params };
  delete cp['_'];
  const script_name = cp['$0'];
  delete cp['$0'];
  return `./${script_name} ${Object.entries(cp).map(([key, value]) => `--${key} ${value}`).join(' ')}`;
}

function params_view(params: any) {
  const cp = { ...params };
  delete cp['_'];
  delete cp['$0'];
  return cp;
}

export
function FillParams(params: any) {
  Object.entries(args.parse(process.argv)).forEach(([key, value]) => {
    if (!(key in params)) throw `unknown param ${key}`;
    params[key] = value;
  });
  console.log(params_command_line_view(params));
  console.log(params_view(params));
}
