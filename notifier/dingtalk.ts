import axios from 'axios';
import crypto from 'crypto';
import { INotifier } from '.';

export
class DingTalk
implements INotifier {
  public constructor(private readonly config: {
    access_token: string;
    secret: string;
    at_mobiles?: string[];
  }) { }

  public async SendMessage(message: string) {
    try {
      const timestamp = Number(new Date());
      const sign_string = `${timestamp}\n${this.config.secret}`;
      const sign = encodeURIComponent(
        crypto
          .createHmac('sha256', this.config.secret)
          .update(sign_string)
          .digest('base64')
      );
      await axios.post(
        'https://oapi.dingtalk.com/robot/send',
        {
          msgtype: 'text',
          text: {
            content: message,
          },
          at: {
            atMobiles: this.config.at_mobiles,
            isAtAll: false,
          },
        },
        {
          params: {
            access_token: this.config.access_token,
            timestamp,
            sign,
          },
        },
      );
    } catch (e) {
      console.log(e);
    }
  }
}
