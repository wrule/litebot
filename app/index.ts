import yargs from 'yargs/yargs';
import { hideBin }  from 'yargs/helpers';

export
abstract class App {
  private params_command_line_view(params: any) {
    const cp = { ...params };
    delete cp['_'];
    const script_name = cp['$0'];
    delete cp['$0'];
    return `./${script_name} ${Object.entries(cp).map(([key, value]) => `--${key} ${value}`).join(' ')}`;
  }

  private params_view(params: any) {
    const cp = { ...params };
    delete cp['_'];
    delete cp['$0'];
    return cp;
  }

  protected fill_params(params: any) {
    Object.entries(yargs(hideBin(process.argv)).argv).forEach(([key, value]) => {
      if (key !== '_' && key !== '$0' && params[key] == null) throw `unknown param ${key}`;
      params[key] = value;
    });
    console.log(this.params_command_line_view(params));
    console.log(this.params_view(params));
  }

  public abstract Run(): void;
}
