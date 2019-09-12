import { App } from '@slack/bolt';
import { WebClient, LogLevel } from '@slack/web-api';
import { v4 as uuid } from 'uuid';
import { extractURL } from './lib';
import { isNull } from 'util';

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    logLevel: LogLevel.DEBUG,
});

const api = new WebClient(process.env.SLACK_OAUTH_TOKEN);

app.event('app_mention', ({ say }) => {
    say({
        text: 'こんにちは',
        attachments: [
            {
                text: 'このメッセージに返信するとサービスに登録されます',
                fallback: `このメッセージに返信するとサービスに登録されます link[https://example.com/api/id/${uuid()}]`,
            },
        ],
    });
});

app.message(async ({ message }) => {
    if (message.thread_ts) {
        console.log('Thread is created');
        const thread_messages = await api.channels.replies({
            thread_ts: message.thread_ts,
            channel: message.channel,
        });
        if (!thread_messages.ok) {
            console.error('thread messages are not found');
            return void 0;
        }

        const attachments: any[] = (thread_messages.messages as any[])
            .filter(s => s.subtype && s.subtype === 'bot_message')
            .reduce(
                (attachments, bot_message) =>
                    attachments.concat(bot_message.attachments),
                [],
            );
        const apiEndpoint = extractURL(
            attachments.map(attachment => attachment.fallback),
        );
        if (isNull(apiEndpoint)) {
            console.log('API endpoint is not found');
            return;
        }
        // E.g. request(apiEndpoint, cb);
        console.log(`call ${apiEndpoint}`);
    }
});

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();
