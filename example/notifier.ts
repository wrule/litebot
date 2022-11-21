import { DingTalk } from '../notifier/dingtalk';

const config = require('../.secret.json');

function main() {
  const notifier = new DingTalk(config.notifier);
  notifier.SendMessage('你好，世界');
}

main();
