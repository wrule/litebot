import { DingTalk } from '../notifier/dingtalk';

const config = require('../.dingtalk.json');

function main() {
  const notifier = new DingTalk(config);
  notifier.SendMessage('你好，世界');
}

main();
