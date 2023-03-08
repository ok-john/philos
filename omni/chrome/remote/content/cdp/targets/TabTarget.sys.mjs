/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { XPCOMUtils } from "resource://gre/modules/XPCOMUtils.sys.mjs";

import { Target } from "chrome://remote/content/cdp/targets/Target.sys.mjs";

const lazy = {};

ChromeUtils.defineESModuleGetters(lazy, {
  RemoteAgent: "chrome://remote/content/components/RemoteAgent.sys.mjs",
  TabManager: "chrome://remote/content/shared/TabManager.sys.mjs",
  TabSession: "chrome://remote/content/cdp/sessions/TabSession.sys.mjs",
});

XPCOMUtils.defineLazyServiceGetter(
  lazy,
  "Favicons",
  "@mozilla.org/browser/favicon-service;1",
  "nsIFaviconService"
);

/**
 * Target for a local tab or a remoted frame.
 */
export class TabTarget extends Target {
  /**
   * @param TargetList targetList
   * @param BrowserElement browser
   */
  constructor(targetList, browser) {
    super(targetList, lazy.TabSession);

    this.browser = browser;

    // The tab target uses a unique id as shared with WebDriver to reference
    // a specific tab.
    this.id = lazy.TabManager.getIdForBrowser(browser);

    // Define the HTTP path to query this target
    this.path = `/devtools/page/${this.id}`;

    Services.obs.addObserver(this, "message-manager-disconnect");
  }

  destructor() {
    Services.obs.removeObserver(this, "message-manager-disconnect");
    super.destructor();
  }

  get browserContextId() {
    return parseInt(this.browser.getAttribute("usercontextid"));
  }

  get browsingContext() {
    return this.browser.browsingContext;
  }

  get mm() {
    return this.browser.messageManager;
  }

  get window() {
    return this.browser.ownerGlobal;
  }

  get tab() {
    return this.window.gBrowser.getTabForBrowser(this.browser);
  }

  /**
   * Determines if the content browser remains attached
   * to its parent chrome window.
   *
   * We determine this by checking if the <browser> element
   * is still attached to the DOM.
   *
   * @return {boolean}
   *     True if target's browser is still attached,
   *     false if it has been disconnected.
   */
  get closed() {
    return !this.browser || !this.browser.isConnected;
  }

  get description() {
    return "";
  }

  get frontendURL() {
    return null;
  }

  /** @return {Promise.<String=>} */
  get faviconUrl() {
    return new Promise((resolve, reject) => {
      lazy.Favicons.getFaviconURLForPage(this.browser.currentURI, url => {
        if (url) {
          resolve(url.spec);
        } else {
          resolve(null);
        }
      });
    });
  }

  get title() {
    return this.browsingContext.currentWindowGlobal.documentTitle;
  }

  get type() {
    return "page";
  }

  get url() {
    return this.browser.currentURI.spec;
  }

  get wsDebuggerURL() {
    const { host, port } = lazy.RemoteAgent;
    return `ws://${host}:${port}${this.path}`;
  }

  toString() {
    return `[object Target ${this.id}]`;
  }

  toJSON() {
    return {
      description: this.description,
      devtoolsFrontendUrl: this.frontendURL,
      // TODO(ato): toJSON cannot be marked async )-:
      faviconUrl: "",
      id: this.id,
      // Bug 1680817: Fails to encode some UTF-8 characters
      // title: this.title,
      type: this.type,
      url: this.url,
      webSocketDebuggerUrl: this.wsDebuggerURL,
    };
  }

  // nsIObserver

  observe(subject, topic, data) {
    if (subject === this.mm && subject == "message-manager-disconnect") {
      // disconnect debugging target if <browser> is disconnected,
      // otherwise this is just a host process change
      if (this.closed) {
        this.disconnect();
      }
    }
  }

  // XPCOM

  get QueryInterface() {
    return ChromeUtils.generateQI(["nsIHttpRequestHandler", "nsIObserver"]);
  }
}
