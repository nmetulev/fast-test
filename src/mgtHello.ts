import {customElement, attr, html, observable, when} from '@microsoft/fast-element';
import { MgtBase } from './mgtBase';

const loadingTemplate = html<MgtBase>`
    <div>Loading</div>
`

const noDataTemplate = html`
    <div>Not signed in!</div>
`;

const dataTemplate = html<mgtHello>`
    <div>Hello ${x => x.me.displayName}</div>
`;

// const template = html<mgtHello>`
// <div>
//     ${when(x => x.isLoading, loadingTemplate)}
//     ${when(x => !x.isLoading && typeof(x.me) === 'undefined', noDataTemplate)}
//     ${when(x => !x.isLoading && typeof(x.me) !== 'undefined', dataTemplate)}
// </div>
// `


function getTemplate(x) {
    if (x.isLoading) {
        return loadingTemplate;
    } else if (typeof(x.me) === 'undefined') {
        return noDataTemplate;
    } else {
        return dataTemplate;
    }
}

const template = html<mgtHello>`
<div>
    ${x => getTemplate(x)}
</div>
`


@customElement({
    name: 'mgt-hello',
    template
})
export class mgtHello extends MgtBase {

    @observable me;

    protected async loadState() {
        const client = this.getGraphClient();
        console.log(client);
        if (client) {
            this.me = await client.api('/me').get();
        }
    }

}