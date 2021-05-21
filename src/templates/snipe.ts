import { displayName, homepage } from '../../package.json';

export const snipeBody = `
{{ >snipeHeader }}

{{ #labels }}

{{ >snipeLabelItem }}
{{ /labels }}
[size=2][right]
{{ #subscriptions.length }}
-------------
{{ #subscriptions }}
{{ >subscriptionItem }}
{{ /subscriptions }}
{{ /subscriptions.length }}
-------------
{{ >snipeFooter }}
[/right][/size=2]
`.trim();

export const snipeHeader = `
會員編號：{{ user.user_id }}
會員名稱：{{ user.nickname }}
註冊日期：{{ user.registrationDate }}
`.trim();

export const snipeLabelItem = `
-------------【{{ text }}】-------------
{{ #reason }}
[size=3]事蹟：{{ reason }}[/size=3]
{{ /reason }}
{{ #sourceURL }}
[size=3]詳情：{{{ sourceURL }}}[/size=3]
{{ /sourceURL }}
{{ #image }}
[img]{{{ image }}}[/img]
{{ /image }}
{{ #subscription }}
[size=2]由 [b][orange]{{ subscription.name }}[/orange][/b] 提供[/size=2]
{{ /subscription }}
`.trim();

export const subscriptionItem = `
{{ #homepage }}
[orange][b]{{ name }}[/b][/orange]
{{{ homepage }}}
{{ /homepage }}
`.trim();

export const snipeFooter = `
[orange]【[b]${displayName}[/b]】LIHKG 會員標籤插件[/orange]
${homepage}
討論：https://lih.kg/2536496
`.trim();
