import { App } from '@slack/bolt';
// import { WebClient } from '@slack/web-api';

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// const api = new WebClient(process.env.SLACK_OAUTH_TOKEN);

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

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();
