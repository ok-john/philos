/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const EXPORTED_SYMBOLS = ["AboutWelcomeDefaults"];

const { XPCOMUtils } = ChromeUtils.importESModule(
  "resource://gre/modules/XPCOMUtils.sys.mjs"
);
const { AppConstants } = ChromeUtils.importESModule(
  "resource://gre/modules/AppConstants.sys.mjs"
);

const lazy = {};

ChromeUtils.defineESModuleGetters(lazy, {
  BrowserUtils: "resource://gre/modules/BrowserUtils.sys.mjs",
});

XPCOMUtils.defineLazyModuleGetters(lazy, {
  AddonRepository: "resource://gre/modules/addons/AddonRepository.jsm",
  AttributionCode: "resource:///modules/AttributionCode.jsm",
});

XPCOMUtils.defineLazyPreferenceGetter(
  lazy,
  "usesFirefoxSync",
  "services.sync.username"
);

XPCOMUtils.defineLazyPreferenceGetter(
  lazy,
  "mobileDevices",
  "services.sync.clients.devices.mobile",
  0
);

// Message to be updated based on finalized MR designs
const MR_ABOUT_WELCOME_DEFAULT = {
  id: "MR_WELCOME_DEFAULT",
  template: "multistage",
  // Allow tests to easily disable transitions.
  transitions: Services.prefs.getBoolPref(
    "browser.aboutwelcome.transitions",
    true
  ),
  backdrop:
    "var(--mr-welcome-background-color) var(--mr-welcome-background-gradient)",
  screens: [
    {
      id: "AW_PIN_FIREFOX",
      content: {
        position: "split",
        split_narrow_bkg_position: "-155px",
        image_alt_text: {
          string_id: "mr2022-onboarding-pin-image-alt",
        },
        background:
          "url('chrome://activity-stream/content/data/content/assets/mr-pintaskbar.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
        progress_bar: true,
        logo: {},
        title: {
          string_id: "mr2022-onboarding-welcome-pin-header",
        },
        subtitle: {
          string_id: "mr2022-onboarding-welcome-pin-subtitle",
        },
        primary_button: {
          label: {
            string_id: "mr2022-onboarding-pin-primary-button-label",
          },
          action: {
            navigate: true,
            type: "PIN_FIREFOX_TO_TASKBAR",
          },
        },
        secondary_button: {
          label: {
            string_id: "mr2022-onboarding-secondary-skip-button-label",
          },
          action: {
            navigate: true,
          },
          has_arrow_icon: true,
        },
        secondary_button_top: {
          label: {
            string_id: "mr1-onboarding-sign-in-button-label",
          },
          action: {
            data: {
              entrypoint: "activity-stream-firstrun",
              where: "tab",
            },
            type: "SHOW_FIREFOX_ACCOUNTS",
            addFlowParams: true,
          },
        },
      },
    },
    {
      id: "AW_LANGUAGE_MISMATCH",
      content: {
        position: "split",
        background: "var(--mr-screen-background-color)",
        progress_bar: true,
        logo: {},
        title: {
          string_id: "mr2022-onboarding-live-language-text",
        },
        subtitle: {
          string_id: "mr2022-language-mismatch-subtitle",
        },
        hero_text: {
          string_id: "mr2022-onboarding-live-language-text",
          useLangPack: true,
        },
        languageSwitcher: {
          downloading: {
            string_id: "onboarding-live-language-button-label-downloading",
          },
          cancel: {
            string_id: "onboarding-live-language-secondary-cancel-download",
          },
          waiting: { string_id: "onboarding-live-language-waiting-button" },
          skip: { string_id: "mr2022-onboarding-secondary-skip-button-label" },
          action: {
            navigate: true,
          },
          switch: {
            string_id: "mr2022-onboarding-live-language-switch-to",
            useLangPack: true,
          },
          continue: {
            string_id: "mr2022-onboarding-live-language-continue-in",
          },
        },
      },
    },
    {
      id: "AW_SET_DEFAULT",
      content: {
        position: "split",
        split_narrow_bkg_position: "-60px",
        image_alt_text: {
          string_id: "mr2022-onboarding-default-image-alt",
        },
        background:
          "url('chrome://activity-stream/content/data/content/assets/mr-settodefault.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
        progress_bar: true,
        logo: {},
        title: {
          string_id: "mr2022-onboarding-set-default-title",
        },
        subtitle: {
          string_id: "mr2022-onboarding-set-default-subtitle",
        },
        primary_button: {
          label: {
            string_id: "mr2022-onboarding-set-default-primary-button-label",
          },
          action: {
            navigate: true,
            type: "SET_DEFAULT_BROWSER",
          },
        },
        secondary_button: {
          label: {
            string_id: "mr2022-onboarding-secondary-skip-button-label",
          },
          action: {
            navigate: true,
          },
          has_arrow_icon: true,
        },
      },
    },
    {
      id: "AW_IMPORT_SETTINGS",
      content: {
        position: "split",
        split_narrow_bkg_position: "-42px",
        image_alt_text: {
          string_id: "mr2022-onboarding-import-image-alt",
        },
        background:
          "url('chrome://activity-stream/content/data/content/assets/mr-import.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
        progress_bar: true,
        logo: {},
        title: {
          string_id: "mr2022-onboarding-import-header",
        },
        subtitle: {
          string_id: "mr2022-onboarding-import-subtitle",
        },
        primary_button: {
          label: {
            string_id:
              "mr2022-onboarding-import-primary-button-label-no-attribution",
          },
          action: {
            type: "SHOW_MIGRATION_WIZARD",
            data: {},
            navigate: true,
          },
        },
        secondary_button: {
          label: {
            string_id: "mr2022-onboarding-secondary-skip-button-label",
          },
          action: {
            navigate: true,
          },
          has_arrow_icon: true,
        },
      },
    },
    {
      id: "AW_MOBILE_DOWNLOAD",
      content: {
        position: "split",
        split_narrow_bkg_position: "-160px",
        image_alt_text: {
          string_id: "mr2022-onboarding-mobile-download-image-alt",
        },
        background:
          "url('chrome://activity-stream/content/data/content/assets/mr-mobilecrosspromo.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
        progress_bar: true,
        logo: {},
        title: {
          string_id: "mr2022-onboarding-mobile-download-title",
        },
        subtitle: {
          string_id: "mr2022-onboarding-mobile-download-subtitle",
        },
        hero_image: {
          url:
            "chrome://activity-stream/content/data/content/assets/mobile-download-qr-new-user.svg",
        },
        cta_paragraph: {
          text: {
            string_id: "mr2022-onboarding-mobile-download-cta-text",
            string_name: "download-label",
          },
          action: {
            type: "OPEN_URL",
            data: {
              args:
                "https://www.mozilla.org/firefox/mobile/get-app/?utm_medium=firefox-desktop&utm_source=onboarding-modal&utm_campaign=mr2022&utm_content=new-global",
              where: "tab",
            },
          },
        },
        secondary_button: {
          label: {
            string_id: "mr2022-onboarding-secondary-skip-button-label",
          },
          action: {
            navigate: true,
          },
          has_arrow_icon: true,
        },
      },
    },
    {
      id: "AW_GRATITUDE",
      content: {
        position: "split",
        split_narrow_bkg_position: "-228px",
        image_alt_text: {
          string_id: "mr2022-onboarding-gratitude-image-alt",
        },
        background:
          "url('chrome://activity-stream/content/data/content/assets/mr-gratitude.svg') var(--mr-secondary-position) no-repeat var(--mr-screen-background-color)",
        progress_bar: true,
        logo: {},
        title: {
          string_id: "mr2022-onboarding-gratitude-title",
        },
        subtitle: {
          string_id: "mr2022-onboarding-gratitude-subtitle",
        },
        primary_button: {
          label: {
            string_id: "mr2022-onboarding-gratitude-primary-button-label",
          },
          action: {
            type: "OPEN_FIREFOX_VIEW",
            navigate: true,
          },
        },
        secondary_button: {
          label: {
            string_id: "mr2022-onboarding-gratitude-secondary-button-label",
          },
          action: {
            navigate: true,
          },
        },
      },
    },
  ],
};

async function getAddonFromRepository(data) {
  const [addonInfo] = await lazy.AddonRepository.getAddonsByIDs([data]);
  if (addonInfo.sourceURI.scheme !== "https") {
    return null;
  }

  return {
    name: addonInfo.name,
    url: addonInfo.sourceURI.spec,
    iconURL: addonInfo.icons["64"] || addonInfo.icons["32"],
    type: addonInfo.type,
    screenshots: addonInfo.screenshots,
  };
}

async function getAddonInfo(attrbObj) {
  let { content, source } = attrbObj;
  try {
    if (!content || source !== "addons.mozilla.org") {
      return null;
    }
    // Attribution data can be double encoded
    while (content.includes("%")) {
      try {
        const result = decodeURIComponent(content);
        if (result === content) {
          break;
        }
        content = result;
      } catch (e) {
        break;
      }
    }
    // return_to_amo embeds the addon id in the content
    // param, prefixed with "rta:".  Translating that
    // happens in AddonRepository, however we can avoid
    // an API call if we check up front here.
    if (content.startsWith("rta:")) {
      return await getAddonFromRepository(content);
    }
  } catch (e) {
    console.error("Failed to get the latest add-on version for Return to AMO");
  }
  return null;
}

async function getAttributionContent() {
  let attribution = await lazy.AttributionCode.getAttrDataAsync();
  if (attribution?.source === "addons.mozilla.org") {
    let addonInfo = await getAddonInfo(attribution);
    if (addonInfo) {
      return {
        ...addonInfo,
        template: "return_to_amo",
      };
    }
  }
  if (attribution?.ua) {
    return {
      ua: decodeURIComponent(attribution.ua),
    };
  }
  return null;
}

// Return default multistage welcome content
function getDefaults() {
  return Cu.cloneInto(MR_ABOUT_WELCOME_DEFAULT, {});
}

let gSourceL10n = null;

// Localize Firefox download source from user agent attribution to show inside
// import primary button label such as 'Import from <localized browser name>'.
// no firefox as import wizard doesn't show it
const allowedUAs = ["chrome", "edge", "ie"];
function getLocalizedUA(ua) {
  if (!gSourceL10n) {
    gSourceL10n = new Localization(["browser/migration.ftl"]);
  }
  if (allowedUAs.includes(ua)) {
    return gSourceL10n.formatValue(`source-name-${ua.toLowerCase()}`);
  }
  return null;
}

// Helper to find screens and remove them where applicable.
function removeScreens(check, screens) {
  for (let i = 0; i < screens?.length; i++) {
    if (check(screens[i])) {
      screens.splice(i--, 1);
    }
  }
}

// Function to evalute the appropriate string for the welcome screen button label
function evaluateWelcomeScreenButtonLabel(removeDefault) {
  return removeDefault
    ? "mr2022-onboarding-get-started-primary-button-label"
    : "mr2022-onboarding-set-default-primary-button-label";
}

function prepareMobileDownload(screens) {
  let mobileContent = screens?.find(
    screen => screen.id === "AW_MOBILE_DOWNLOAD"
  )?.content;

  if (!mobileContent) {
    return;
  }
  if (!lazy.BrowserUtils.sendToDeviceEmailsSupported()) {
    // If send to device emails are not supported for a user's locale,
    // remove the send to device link and update the screen text
    delete mobileContent.cta_paragraph.action;
    mobileContent.cta_paragraph.text = {
      string_id: "mr2022-onboarding-no-mobile-download-cta-text",
    };
  }
  // Update CN specific QRCode url
  if (AppConstants.isChinaRepack()) {
    mobileContent.hero_image.url = `${mobileContent.hero_image.url.slice(
      0,
      mobileContent.hero_image.url.indexOf(".svg")
    )}-cn.svg`;
  }
}

function prepareMRContent(content) {
  // Expand with logic for finalized MR designs
  const { screens } = content;

  // Do not show the screen to users who are already using firefox sync
  // and syncing to a mobile device
  if (lazy.usesFirefoxSync && lazy.mobileDevices > 0) {
    removeScreens(screen => screen.id === "AW_MOBILE_DOWNLOAD", screens);
  } else {
    prepareMobileDownload(screens);
  }

  return content;
}

async function prepareContentForReact(content) {
  const { screens } = content;

  if (content?.template === "return_to_amo") {
    return content;
  }

  // Change content for Windows 7 because non-light themes aren't quite right.
  if (AppConstants.isPlatformAndVersionAtMost("win", "6.1")) {
    removeScreens(
      screen => ["theme"].includes(screen.content?.tiles?.type),
      screens
    );
  }

  // Set the primary import button source based on attribution.
  if (content?.ua) {
    // If available, add the browser source to action data
    // and localized browser string args to primary button label
    const { label, action } =
      content?.screens?.find(
        screen =>
          screen?.content?.primary_button?.action?.type ===
          "SHOW_MIGRATION_WIZARD"
      )?.content?.primary_button ?? {};

    if (action) {
      action.data = { ...action.data, source: content.ua };
    }

    let browserStr = await getLocalizedUA(content.ua);

    if (label?.string_id) {
      label.string_id = browserStr
        ? "mr1-onboarding-import-primary-button-label-attribution"
        : "mr1-onboarding-import-primary-button-label-no-attribution";

      label.args = browserStr ? { previous: browserStr } : {};
    }
  }

  // If already pinned, convert "pin" screen to "welcome" with desired action.
  let removeDefault = !content.needDefault;
  if (!content.needPin) {
    const pinScreen = content.screens?.find(screen =>
      screen.id?.startsWith("AW_PIN_FIREFOX")
    );
    if (pinScreen?.content) {
      pinScreen.id = removeDefault ? "AW_GET_STARTED" : "AW_ONLY_DEFAULT";
      pinScreen.content.title = {
        string_id: "mr2022-onboarding-welcome-pin-header",
      };

      pinScreen.content.subtitle = {
        string_id: removeDefault
          ? "mr2022-onboarding-get-started-primary-subtitle"
          : "mr2022-onboarding-set-default-only-subtitle",
      };

      pinScreen.content.primary_button = {
        label: {
          string_id: evaluateWelcomeScreenButtonLabel(removeDefault, content),
        },
        action: {
          navigate: true,
        },
      };
      // Get started content will navigate without action, so remove "Not now."
      if (!removeDefault) {
        // The "pin" screen will now handle "default" so remove other "default."
        pinScreen.content.primary_button.action.type = "SET_DEFAULT_BROWSER";
        removeDefault = true;
      }
    }
  }
  if (removeDefault) {
    removeScreens(screen => screen.id?.startsWith("AW_SET_DEFAULT"), screens);
  }

  // Remove Firefox Accounts related UI and prevent related metrics.
  if (!Services.prefs.getBoolPref("identity.fxaccounts.enabled", false)) {
    delete content.screens?.find(
      screen =>
        screen.content?.secondary_button_top?.action?.type ===
        "SHOW_FIREFOX_ACCOUNTS"
    )?.content.secondary_button_top;
    content.skipFxA = true;
  }

  // Remove the English-only image caption.
  if (Services.locale.appLocaleAsBCP47.split("-")[0] !== "en") {
    delete content.screens?.find(
      screen => screen.content?.help_text?.deleteIfNotEn
    )?.content.help_text;
  }

  let shouldRemoveLanguageMismatchScreen = true;
  if (content.languageMismatchEnabled) {
    const screen = content?.screens?.find(s => s.id === "AW_LANGUAGE_MISMATCH");
    if (screen && content.appAndSystemLocaleInfo.canLiveReload) {
      // Add the display names for the OS and Firefox languages, like "American English".
      function addMessageArgs(obj) {
        for (const value of Object.values(obj)) {
          if (value?.string_id) {
            value.args = content.appAndSystemLocaleInfo.displayNames;
          }
        }
      }

      addMessageArgs(screen.content.languageSwitcher);
      addMessageArgs(screen.content);
      shouldRemoveLanguageMismatchScreen = false;
    }
  }

  if (shouldRemoveLanguageMismatchScreen) {
    removeScreens(screen => screen.id === "AW_LANGUAGE_MISMATCH", screens);
  }

  return prepareMRContent(content);
}

const AboutWelcomeDefaults = {
  prepareContentForReact,
  getDefaults,
  getAttributionContent,
};
