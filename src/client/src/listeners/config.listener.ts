import { PipeEndpoint, Pipe } from "../../../lib/common/pipe/pipe";
import { ConfigRequest, ConfigResponse } from "../../../shared/pipes/config.pipe";
import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";
import { Appearance } from "../services/appearance/appearance";

export class ConfigListener {
  private endpoint: PipeEndpoint<ConfigRequest, ConfigResponse, 'config'>;

  constructor(
    private webviewEndpoint: WebviewEndpoint,
    private configPipe: Pipe<ConfigRequest, ConfigResponse, 'config'>,
    public appearance: Appearance,
  ) {
    this.endpoint = this.webviewEndpoint.createFromPipe(this.configPipe);
  }

  listen() {
    this.endpoint.listenSetRequest(
      _request => true,
      request => {
        const { appearance } = request;
        Object.assign(this.appearance, appearance);
      },
    );
  }

}

