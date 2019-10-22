import { PipeEndpoint, Pipe } from "@/common/pipe/pipe";
import { Appearance } from "@/webview/services/appearance/appearance";
import { webviewEndpoint } from "@/webview/services/webview-endpoint";

import { ConfigRequest, ConfigResponse } from "../../shared/pipes/config.pipe";

export class ConfigListener {
  private endpoint: PipeEndpoint<ConfigRequest, ConfigResponse, 'config'>;

  constructor(
    private configPipe: Pipe<ConfigRequest, ConfigResponse, 'config'>,
    public appearance: Appearance,
  ) {
    this.endpoint = webviewEndpoint.createFromPipe(this.configPipe);
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

