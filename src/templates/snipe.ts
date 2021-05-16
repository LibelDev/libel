import { displayName, homepage } from '../../package.json';

export const snipeBody = `
會員編號：{{ user.user_id }}
會員名稱：{{ user.nickname }}
註冊日期：{{ user.registrationDate }}
{{ #labels }}
{{ >snipeLabelItem }}
{{ /labels }}

{{ #subscriptions.length }}
-------------
{{ #subscriptions }}
{{ >subscriptionItem }}
{{ /subscriptions }}
{{ /subscriptions.length }}
[right][size=2]
{{ >snipeFooter }}
[/size=2][/right]
`.trim();

export const snipeLabelItem = `
-------------【{{ text }}】-------------
{{ #reason }}
[size=3]原因：{{ reason }}[/size=3]
{{ /reason }}
{{ #sourceURL }}
[size=3]來源：{{{ sourceURL }}}[/size=3]
{{ /sourceURL }}
{{ #subscription }}
[size=2]由 [b][orange]{{ subscription.name }}[/orange][/b] 提供[/size=2]
{{ /subscription }}
`;

export const subscriptionItem = `
{{ #homepage }}
[size=2][b][orange]{{ name }}[/orange][/b]
{{{ homepage }}}[/size=2]
{{ /homepage }}
`.trim();

export const snipeFooter = `
[orange]【[b]${displayName}[/b]】 - LIHKG 會員標籤插件[/orange]
${homepage}
`.trim();
