import { PipeEndpoint, Pipe } from "@/common/pipe/pipe";
import { Appearance } from "@/webview/services/appearance/appearance";

import { ConfigRequest, ConfigResponse } from "../../../shared/pipes/config.pipe";
import { WebviewEndpoint } from "../services/endpoint/webview-endpoint";

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

