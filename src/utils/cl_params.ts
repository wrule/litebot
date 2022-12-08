// 2022年12月08日23:42:46
import yargs from 'yargs/yargs';
import { hideBin }  from 'yargs/helpers';

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
  Object.entries(yargs(hideBin(process.argv)).argv).forEach(([key, value]) => {
    if (key !== '_' && key !== '$0' && params[key] == null) throw `unknown param ${key}`;
    params[key] = value;
  });
  console.log(params_command_line_view(params));
  console.log(params_view(params));
}
