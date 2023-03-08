/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const EXPORTED_SYMBOLS = ["schema"];

const schema =
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {

    "3rdparty": {
      "type": "object",
      "properties": {
        "Extensions" : {
          "type": "object",
          "patternProperties": {
            "^.*$": {
              "type": "JSON"
            }
          }
        }
      }
    },

    "AllowedDomainsForApps": {
      "type": "string"
    },

    "AppAutoUpdate": {
      "type": "boolean"
    },

    "AppUpdatePin": {
      "type": "string"
    },

    "AppUpdateURL": {
      "type": "URL"
    },

    "Authentication": {
      "type": "object",
      "properties": {
        "SPNEGO" : {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "Delegated" : {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "NTLM" : {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "AllowNonFQDN": {
          "type": "object",
          "properties": {
            "SPNEGO": {
              "type": "boolean"
            },

            "NTLM": {
              "type": "boolean"
            }
          }
        },
        "AllowProxies": {
          "type": "object",
          "properties": {
            "SPNEGO": {
              "type": "boolean"
            },

            "NTLM": {
              "type": "boolean"
            }
          }
        },
        "Locked": {
          "type": "boolean"
        },
        "PrivateBrowsing": {
          "type": "boolean"
        }
      }
    },

    "AutoLaunchProtocolsFromOrigins": {
      "type": ["array", "JSON"],
      "items": {
        "type": "object",
        "properties": {
          "allowed_origins": {
            "type": "array",
            "items": {
              "type": "origin"
            }
          },
          "protocol": {
            "type": "string"
          },
          "required": ["allowed_origins", "protocol"]
        }
      }
    },

    "BackgroundAppUpdate": {
      "type": "boolean"
    },

    "BlockAboutAddons": {
      "type": "boolean"
    },

    "BlockAboutConfig": {
      "type": "boolean"
    },

    "BlockAboutProfiles": {
      "type": "boolean"
    },

    "BlockAboutSupport": {
      "type": "boolean"
    },

    "Bookmarks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "Title": {
            "type": "string"
          },

          "URL": {
            "type": "URL"
          },

          "Favicon": {
            "type": "URLorEmpty"
          },

          "Placement": {
            "type": "string",
            "enum": ["toolbar", "menu"]
          },

          "Folder": {
            "type": "string"
          }
        },
        "required": ["Title", "URL"]
      }
    },

    "CaptivePortal": {
      "type": "boolean"
    },

    "Certificates": {
      "type": "object",
      "properties": {
        "ImportEnterpriseRoots": {
          "type": "boolean"
        },
        "Install": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },

    "Cookies": {
      "type": "object",
      "properties": {
        "Allow": {
          "type": "array",
          "strict": false,
          "items": {
            "type": "origin"
          }
        },

        "AllowSession": {
          "type": "array",
          "strict": false,
          "items": {
            "type": "origin"
          }
        },

        "Block": {
          "type": "array",
          "strict": false,
          "items": {
            "type": "origin"
          }
        },

        "Default": {
          "type": "boolean"
        },

        "AcceptThirdParty": {
          "type": "string",
          "enum": ["always", "never", "from-visited"]
        },

        "RejectTracker": {
          "type": "boolean"
        },

        "ExpireAtSessionEnd": {
          "type": "boolean"
        },

        "Locked": {
          "type": "boolean"
        },

        "Behavior": {
          "type": "string",
          "enum": ["accept", "reject-foreign", "reject", "limit-foreign", "reject-tracker", "reject-tracker-and-partition-foreign"]
        },

        "BehaviorPrivateBrowsing": {
          "type": "string",
          "enum": ["accept", "reject-foreign", "reject", "limit-foreign", "reject-tracker", "reject-tracker-and-partition-foreign"]
        }

      }
    },

    "DefaultDownloadDirectory": {
      "type": "string"
    },

    "DisableAppUpdate": {
      "type": "boolean"
    },

    "DisableBuiltinPDFViewer": {
      "type": "boolean"
    },

    "DisabledCiphers": {
      "type": "object",
      "properties": {
        "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256": {
          "type": "boolean"
        },
        "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256": {
          "type": "boolean"
        },
        "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256": {
          "type": "boolean"
        },
        "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256": {
          "type": "boolean"
        },
        "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384": {
          "type": "boolean"
        },
        "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384": {
          "type": "boolean"
        },
        "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA": {
          "type": "boolean"
        },
        "TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA": {
          "type": "boolean"
        },
        "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA": {
          "type": "boolean"
        },
        "TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA": {
          "type": "boolean"
        },
        "TLS_DHE_RSA_WITH_AES_128_CBC_SHA": {
          "type": "boolean"
        },
        "TLS_DHE_RSA_WITH_AES_256_CBC_SHA": {
          "type": "boolean"
        },
        "TLS_RSA_WITH_AES_128_GCM_SHA256": {
          "type": "boolean"
        },
        "TLS_RSA_WITH_AES_256_GCM_SHA384": {
          "type": "boolean"
        },
        "TLS_RSA_WITH_AES_128_CBC_SHA": {
          "type": "boolean"
        },
        "TLS_RSA_WITH_AES_256_CBC_SHA": {
          "type": "boolean"
        },
        "TLS_RSA_WITH_3DES_EDE_CBC_SHA": {
          "type": "boolean"
        }
      }
    },

    "DisableDefaultBrowserAgent": {
      "type": "boolean"
    },

    "DisableDeveloperTools": {
      "type": "boolean"
    },

    "DisableFeedbackCommands": {
      "type": "boolean"
    },

    "DisableFirefoxAccounts": {
      "type": "boolean"
    },

    "DisableFirefoxScreenshots": {
      "type": "boolean"
    },

    "DisableFirefoxStudies": {
      "type": "boolean"
    },

    "DisableForgetButton": {
      "type": "boolean"
    },

    "DisableFormHistory": {
      "type": "boolean"
    },

    "DisableMasterPasswordCreation": {
      "type": "boolean"
    },

    "DisablePasswordReveal": {
      "type": "boolean"
    },

    "DisablePocket": {
      "type": "boolean"
    },

    "DisablePrivateBrowsing": {
      "type": "boolean"
    },

    "DisableProfileImport": {
      "type": "boolean"
    },

    "DisableProfileRefresh": {
      "type": "boolean"
    },

    "DisableSafeMode": {
      "type": "boolean"
    },

    "DisableSecurityBypass": {
      "type": "object",
      "properties": {
        "InvalidCertificate": {
          "type": "boolean"
        },

        "SafeBrowsing": {
          "type": "boolean"
        }
      }
    },

    "DisableSetDesktopBackground": {
      "type": "boolean"
    },

    "DisableSystemAddonUpdate": {
      "type": "boolean"
    },

    "DisableTelemetry": {
      "type": "boolean"
    },

    "DisableThirdPartyModuleBlocking": {
      "type": "boolean"
    },

    "DisplayBookmarksToolbar": {
      "type": ["boolean", "string"],
      "enum": ["always", "never", "newtab"]
    },

    "DisplayMenuBar": {
      "type": ["boolean", "string"],
      "enum": ["always", "never", "default-on", "default-off"]
    },

    "DNSOverHTTPS": {
      "type": "object",
      "properties": {
        "Enabled": {
          "type": "boolean"
        },
        "ProviderURL": {
          "type": "URLorEmpty"
        },
        "ExcludedDomains": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "Locked": {
          "type": "boolean"
        }
      }
    },

    "DontCheckDefaultBrowser": {
      "type": "boolean"
    },

    "DownloadDirectory": {
      "type": "string"
    },

    "EnableTrackingProtection": {
      "type": "object",
      "properties": {
        "Value": {
          "type": "boolean"
        },
        "Locked": {
          "type": "boolean"
        },
        "Cryptomining": {
          "type": "boolean"
        },
        "Fingerprinting": {
          "type": "boolean"
        },
        "Exceptions": {
          "type": "array",
          "strict": false,
          "items": {
            "type": "origin"
          }
        }
      }
    },

    "EncryptedMediaExtensions": {
      "type": "object",
      "properties": {
        "Enabled": {
          "type": "boolean"
        },
        "Locked": {
          "type": "boolean"
        }
      }
    },

    "ExemptDomainFileTypePairsFromFileTypeDownloadWarnings": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "file_extension": {
            "type": "string"
          },
          "domains": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    },

    "Extensions": {
      "type": "object",
      "properties": {
        "Install" : {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "Uninstall" : {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "Locked" : {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },

    "ExtensionSettings": {
      "type": ["object", "JSON"],
      "properties": {
        "*": {
          "type": "object",
          "properties": {
            "installation_mode": {
              "type": "string",
              "enum": ["allowed", "blocked"]
            },
            "allowed_types": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": ["extension", "dictionary", "locale", "theme", "sitepermission"]
              }
            },
            "blocked_install_message": {
              "type": "string"
            },
            "install_sources": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "restricted_domains": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      },
      "patternProperties": {
        "^.*$": {
          "type": "object",
          "properties": {
            "installation_mode": {
              "type": "string",
              "enum": ["allowed", "blocked", "force_installed", "normal_installed"]
            },
            "install_url": {
              "type": "string"
            },
            "blocked_install_message": {
              "type": "string"
            },
            "updates_disabled": {
              "type": "boolean"
            }
          }
        }
      }
    },

    "ExtensionUpdate": {
      "type": "boolean"
    },

    "FirefoxHome": {
      "type": "object",
      "properties": {
        "Search": {
          "type": "boolean"
        },
        "TopSites": {
          "type": "boolean"
        },
        "SponsoredTopSites": {
          "type": "boolean"
        },
        "Highlights": {
          "type": "boolean"
        },
        "Pocket": {
          "type": "boolean"
        },
        "SponsoredPocket": {
          "type": "boolean"
        },
        "Snippets": {
          "type": "boolean"
        },
        "Locked": {
          "type": "boolean"
        }
      }
    },

    "FlashPlugin": {
      "type": "object",
      "properties": {
        "Allow": {
          "type": "array",
          "strict": false,
          "items": {
            "type": "origin"
          }
        },

        "Block": {
          "type": "array",
          "strict": false,
          "items": {
            "type": "origin"
          }
        },

        "Default": {
          "type": "boolean"
        },

        "Locked": {
          "type": "boolean"
        }
      }
    },

    "GoToIntranetSiteForSingleWordEntryInAddressBar": {
      "type": "boolean"
    },

    "Handlers": {
      "type": ["object", "JSON"],
      "patternProperties": {
        "^(mimeTypes|extensions|schemes)$": {
          "type": "object",
          "patternProperties": {
            "^.*$": {
              "type": "object",
              "properties": {
                "action": {
                  "type": "string",
                  "enum": ["saveToDisk", "useHelperApp", "useSystemDefault"]
                },
                "ask": {
                  "type": "boolean"
                },
                "handlers": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "name": {
                        "type": "string"
                      },
                      "path": {
                        "type": "string"
                      },
                      "uriTemplate": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },

    "HardwareAcceleration": {
      "type": "boolean"
    },

    "Homepage": {
      "type": "object",
      "properties": {
        "URL": {
          "type": "URL"
        },
        "Locked": {
          "type": "boolean"
        },
        "Additional": {
          "type": "array",
          "strict": false,
          "items": {
            "type": "URL"
          }
        },
        "StartPage": {
          "type": "string",
          "enum": ["none", "homepage", "previous-session", "homepage-locked"]
        }
      }
    },

    "InstallAddonsPermission": {
      "type": "object",
      "properties": {
        "Allow": {
          "type": "array",
          "strict": false,
          "items": {
            "type": "origin"
          }
        },
        "Default": {
          "type": "boolean"
        }
      }
    },

    "LegacyProfiles": {
      "type": "boolean"
    },

    "LegacySameSiteCookieBehaviorEnabled": {
      "type": "boolean"
    },

    "LegacySameSiteCookieBehaviorEnabledForDomainList": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },

    "LocalFileLinks": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },

    "ManagedBookmarks": {
      "items": {
        "properties": {
          "children": {
            "items": {
              "properties": {
                "name": {
                  "type": "string"
                },
                "toplevel_name": {
                  "type": "string"
                },
                "url": {
                  "type": "string"
                },
                "children": {
                  "items": {
                    "type": "JSON"
                  },
                  "type": "array"
                }
              },
              "type": "object"
            },
            "type": "array"
          },
          "name": {
            "type": "string"
          },
          "toplevel_name": {
            "type": "string"
          },
          "url": {
            "type": "string"
          }
        },
        "type": "object"
      },
      "type": ["array", "JSON"]
    },

    "ManualAppUpdateOnly": {
        "type": "boolean"
    },

    "NetworkPrediction": {
      "type": "boolean"
    },

    "NewTabPage": {
      "type": "boolean"
    },

    "NoDefaultBookmarks": {
      "type": "boolean"
    },

    "OfferToSaveLogins": {
      "type": "boolean"
    },

    "OfferToSaveLoginsDefault": {
      "type": "boolean"
    },

    "OverrideFirstRunPage": {
      "type": "string",
    },

    "OverridePostUpdatePage": {
      "type": "URLorEmpty"
    },

    "PasswordManagerEnabled": {
      "type": "boolean"
    },

    "PasswordManagerExceptions": {
      "type": "array",
      "strict": false,
      "items": {
        "type": "origin"
      }
    },

    "PDFjs": {
      "type": "object",
      "properties": {
        "Enabled": {
          "type": "boolean"
        },
        "EnablePermissions": {
          "type": "boolean"
        }
      }
    },

    "Permissions": {
      "type": "object",
      "properties": {
        "Camera": {
          "type": "object",
          "properties": {
            "Allow": {
              "type": "array",
              "strict": false,
              "items": {
                "type": "origin"
              }
            },

            "Block": {
              "type": "array",
              "strict": false,
              "items": {
                "type": "origin"
              }
            },

            "BlockNewRequests": {
              "type": "boolean"
            },

            "Locked": {
              "type": "boolean"
            }
          }
        },

        "Microphone": {
          "type": "object",
          "properties": {
            "Allow": {
              "type": "array",
              "strict": false,
              "items": {
                "type": "origin"
              }
            },

            "Block": {
              "type": "array",
              "strict": false,
              "items": {
                "type": "origin"
              }
            },

            "BlockNewRequests": {
              "type": "boolean"
            },

            "Locked": {
              "type": "boolean"
            }
          }
        },

        "Autoplay": {
          "type": "object",
          "properties": {
            "Default": {
              "type": "string",
              "enum": ["allow-audio-video", "block-audio", "block-audio-video"]
            },

            "Allow": {
              "type": "array",
              "strict": false,
              "items": {
                "type": "origin"
              }
            },

            "Block": {
              "type": "array",
              "strict": false,
              "items": {
                "type": "origin"
              }
            },

            "Locked": {
              "type": "boolean"
            }
          }
        },

        "Location": {
          "type": "object",
          "properties": {
            "Allow": {
              "type": "array",
              "strict": false,
              "items": {
                "type": "origin"
              }
            },

            "Block": {
              "type": "array",
              "strict": false,
              "items": {
                "type": "origin"
              }
            },

            "BlockNewRequests": {
              "type": "boolean"
            },

            "Locked": {
              "type": "boolean"
            }
          }
        },

        "Notifications": {
          "type": "object",
          "properties": {
            "Allow": {
              "type": "array",
              "strict": false,
              "items": {
                "type": "origin"
              }
            },

            "Block": {
              "type": "array",
              "strict": false,
              "items": {
                "type": "origin"
              }
            },

            "BlockNewRequests": {
              "type": "boolean"
            },

            "Locked": {
              "type": "boolean"
            }
          }
        },

        "VirtualReality": {
          "type": "object",
          "properties": {
            "Allow": {
              "type": "array",
              "strict": false,
              "items": {
                "type": "origin"
              }
            },

            "Block": {
              "type": "array",
              "strict": false,
              "items": {
                "type": "origin"
              }
            },

            "BlockNewRequests": {
              "type": "boolean"
            },

            "Locked": {
              "type": "boolean"
            }
          }
        }
      }
    },

    "PictureInPicture": {
      "type": "object",
      "properties": {
        "Enabled": {
          "type": "boolean"
        },
        "Locked": {
          "type": "boolean"
        }
      }
    },

    "PopupBlocking": {
      "type": "object",
      "properties": {
        "Allow": {
          "type": "array",
          "strict": false,
          "items": {
            "type": "origin"
          }
        },

        "Default": {
          "type": "boolean"
        },

        "Locked": {
          "type": "boolean"
        }
      }
    },

    "Preferences": {
      "type": ["object", "JSON"],
      "patternProperties": {
        "^.*$": {
          "type": ["number", "boolean", "string", "object"],
          "properties": {
            "Value": {
              "type": ["number", "boolean", "string"]
            },
            "Status": {
              "type": "string",
              "enum": ["default", "locked", "user", "clear"]
            }
          }
        }
      }
    },

    "PrimaryPassword": {
      "type": "boolean"
    },

    "PromptForDownloadLocation": {
      "type": "boolean"
    },

    "Proxy": {
      "type": "object",
      "properties": {
        "Mode": {
          "type": "string",
          "enum": ["none", "system", "manual", "autoDetect", "autoConfig"]
        },

        "Locked": {
          "type": "boolean"
        },

        "AutoConfigURL": {
          "type": "URLorEmpty"
        },

        "FTPProxy": {
          "type": "string"
        },

        "HTTPProxy": {
          "type": "string"
        },

        "SSLProxy": {
          "type": "string"
        },

        "SOCKSProxy": {
          "type": "string"
        },

        "SOCKSVersion": {
          "type": "number",
          "enum": [4, 5]
        },

        "UseHTTPProxyForAllProtocols": {
          "type": "boolean"
        },

        "Passthrough": {
          "type": "string"
        },

        "UseProxyForDNS": {
          "type": "boolean"
        },

        "AutoLogin": {
          "type": "boolean"
        }
      }
    },

    "RequestedLocales": {
      "type": ["string", "array"],
      "items": {
        "type": "string"
      }
    },

    "SanitizeOnShutdown": {
      "type": ["boolean", "object"],
      "properties": {
        "Cache": {
          "type": "boolean"
        },
        "Cookies": {
          "type": "boolean"
        },
        "Downloads": {
          "type": "boolean"
        },
        "FormData": {
          "type": "boolean"
        },
        "History": {
          "type": "boolean"
        },
        "Sessions": {
          "type": "boolean"
        },
        "SiteSettings": {
          "type": "boolean"
        },
        "OfflineApps": {
          "type": "boolean"
        },
        "Locked": {
          "type": "boolean"
        }
      }
    },

    "SearchBar": {
      "type": "string",
      "enum": ["unified", "separate"]
    },

    "SearchEngines": {
      "enterprise_only": true,

      "type": "object",
      "properties": {
        "Add": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["Name", "URLTemplate"],

            "properties": {
              "Name": {
                "type": "string"
              },
              "IconURL": {
                "type": "URLorEmpty"
              },
              "Alias": {
                "type": "string"
              },
              "Description": {
                "type": "string"
              },
              "Encoding": {
                "type": "string"
              },
              "Method": {
                "type": "string",
                "enum": ["GET", "POST"]
              },
              "URLTemplate": {
                "type": "string"
              },
              "PostData": {
                "type": "string"
              },
              "SuggestURLTemplate": {
                "type": "string"
              }
            }
          }
        },
        "Default": {
          "type": "string"
        },
        "DefaultPrivate": {
          "type": "string"
        },
        "PreventInstalls": {
          "type": "boolean"
        },
        "Remove": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },

    "SearchSuggestEnabled": {
      "type": "boolean"
    },

    "SecurityDevices": {
      "type": "object",
      "patternProperties": {
        "^.*$": { "type": "string" }
      }
    },

    "ShowHomeButton": {
      "type": "boolean"
    },

    "SSLVersionMax": {
      "type": "string",
      "enum": ["tls1", "tls1.1", "tls1.2", "tls1.3"]
    },

    "SSLVersionMin": {
      "type": "string",
      "enum": ["tls1", "tls1.1", "tls1.2", "tls1.3"]
    },

    "StartDownloadsInTempDirectory": {
      "type": "boolean"
    },

    "SupportMenu": {
      "type": "object",
      "properties": {
        "Title": {
          "type": "string"
        },
        "URL": {
          "type": "URL"
        },
        "AccessKey": {
          "type": "string"
        }
      },
      "required": ["Title", "URL"],
    },

    "UserMessaging": {
      "type": "object",
      "properties": {
        "WhatsNew": {
          "type": "boolean"
        },
        "ExtensionRecommendations": {
          "type": "boolean"
        },
        "FeatureRecommendations": {
          "type": "boolean"
        },
        "UrlbarInterventions": {
          "type": "boolean"
        },
        "SkipOnboarding": {
          "type": "boolean"
        },
        "MoreFromMozilla": {
          "type": "boolean"
        },
        "Locked": {
          "type": "boolean"
        }
      }
    },

    "UseSystemPrintDialog": {
      "type": "boolean"
    },

    "WebsiteFilter": {
      "type": "object",
      "properties": {
        "Block": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },

        "Exceptions": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },

    "WindowsSSO": {
      "type": "boolean"
    }
  }
}
