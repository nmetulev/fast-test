import {FastElement, customElement, attr, html, observable} from '@microsoft/fast-element';
import {Providers, ProviderState} from '@microsoft/mgt';

export abstract class MgtBase extends FastElement {
    @observable isLoading: boolean;

    private _currentLoadStatePromise: Promise<unknown>

    constructor(){
        super();

        this.setupProviders();
    }

    setupProviders(){
        Providers.onProviderUpdated(e => this.onProviderUpdated());
        this.onProviderUpdated();
    }

    private get isProviderSignedIn(): boolean {
        return Providers.globalProvider && Providers.globalProvider.state === ProviderState.SignedIn;
    }

    private onProviderUpdated() {
        if (this.isProviderSignedIn) {
            this.requestStateUpdate();
        }
    }

    protected loadState(): Promise<void> {
        return Promise.resolve();
    }

    protected getGraphClient() {
        if (this.isProviderSignedIn) {
            return Providers.globalProvider.graph.client;
        }
    }

    protected async requestStateUpdate(force: boolean = false) {
          // Wait for the current load promise to complete (unless forced).
    if (this.isLoading && !force) {
        await this._currentLoadStatePromise;
      }
  
      const loadStatePromise = new Promise(async (resolve, reject) => {
        try {
          this.isLoading = true;
          this.$emit('loadingInitiated');
  
          await this.loadState();
  
          this.isLoading = false;
          this.$emit('loadingCompleted');
          resolve();
        } catch (e) {
          this.isLoading = false;
          this.$emit('loadingFailed');
          reject(e);
        }
      });
  
      // Return the load state promise.
      // If loading + forced, chain the promises.
      return (this._currentLoadStatePromise =
        this.isLoading && force ? this._currentLoadStatePromise.then(() => loadStatePromise) : loadStatePromise);
    }
}