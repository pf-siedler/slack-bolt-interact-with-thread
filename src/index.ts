import { App } from '@slack/bolt';
import { WebClient } from '@slack/web-api';

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const api = new WebClient(process.env.SLACK_OAUTH_TOKEN);

app.event('app_mention', ({ say }) => {
    say({
        text: 'こんにちは',
        attachments: [
            {
                text: 'このメッセージに返信するとサービスに登録されます',
                fallback:
                    'このメッセージに返信するとサービスに登録されます link[https://example.com/api/endpoint]',
            },
        ],
    });
});

app.message(async ({ message }) => {
    if (message.thread_ts) {
        console.log('スレッドが作られました');
        const thread_messages = await api.channels.replies({
            thread_ts: message.thread_ts,
            channel: message.channel,
        });
        if (!thread_messages.ok) {
            console.error('スレッドを取得できませんでした');
            return void 0;
        }

        const attachments: any[] = (thread_messages.messages as any[])
            .filter(s => s.subtype && s.subtype === 'bot_message')
            .reduce(
                (attachments, bot_message) =>
                    attachments.concat(bot_message.attachments),
                [],
            );
        console.log(attachments);
    }
});

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();
