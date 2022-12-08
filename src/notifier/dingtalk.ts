import axios from 'axios';
import crypto from 'crypto';

export
class DingTalk {
  public constructor(private readonly config: {
    accessToken: string;
    secret: string;
    atMobiles?: string[];
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
            atMobiles: this.config.atMobiles,
            isAtAll: false,
          },
        },
        {
          params: {
            access_token: this.config.accessToken,
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
