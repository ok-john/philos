


menu-application-preferences =
    .label = Preferences
menu-application-services =
    .label = Services
menu-application-hide-this =
    .label = Hide { -brand-shorter-name }
menu-application-hide-other =
    .label = Hide Others
menu-application-show-all =
    .label = Show All
menu-application-touch-bar =
    .label = Customize Touch Bar…


menu-quit =
    .label =
        { PLATFORM() ->
            [windows] Exit
           *[other] Quit
        }
    .accesskey =
        { PLATFORM() ->
            [windows] x
           *[other] Q
        }

menu-quit-mac =
    .label = Quit { -brand-shorter-name }

menu-about =
    .label = About { -brand-shorter-name }
    .accesskey = A


menu-file =
    .label = File
    .accesskey = F
menu-file-new-tab =
    .label = New Tab
    .accesskey = T
menu-file-new-container-tab =
    .label = New Container Tab
    .accesskey = b
menu-file-new-window =
    .label = New Window
    .accesskey = N
menu-file-new-private-window =
    .label = New Private Window
    .accesskey = W
menu-file-open-location =
    .label = Open Location…
menu-file-open-file =
    .label = Open File…
    .accesskey = O
menu-file-close-tab =
    .label =
        { $tabCount ->
            [1] Close Tab
           *[other] Close { $tabCount } Tabs
        }
    .accesskey = C
menu-file-close-window =
    .label = Close Window
    .accesskey = d
menu-file-save-page =
    .label = Save Page As…
    .accesskey = A
menu-file-email-link =
    .label = Email Link…
    .accesskey = E
menu-file-share-url =
    .label = Share
    .accesskey = h
menu-file-print-setup =
    .label = Page Setup…
    .accesskey = u
menu-file-print =
    .label = Print…
    .accesskey = P
menu-file-import-from-another-browser =
    .label = Import From Another Browser…
    .accesskey = I
menu-file-go-offline =
    .label = Work Offline
    .accesskey = k


menu-edit =
    .label = Edit
    .accesskey = E
menu-edit-find-in-page =
    .label = Find in Page…
    .accesskey = F
menu-edit-find-again =
    .label = Find Again
    .accesskey = g
menu-edit-bidi-switch-text-direction =
    .label = Switch Text Direction
    .accesskey = w


menu-view =
    .label = View
    .accesskey = V
menu-view-toolbars-menu =
    .label = Toolbars
    .accesskey = T
menu-view-customize-toolbar2 =
    .label = Customize Toolbar…
    .accesskey = C
menu-view-sidebar =
    .label = Sidebar
    .accesskey = e
menu-view-bookmarks =
    .label = Bookmarks
menu-view-history-button =
    .label = History
menu-view-synced-tabs-sidebar =
    .label = Synced Tabs
menu-view-full-zoom =
    .label = Zoom
    .accesskey = Z
menu-view-full-zoom-enlarge =
    .label = Zoom In
    .accesskey = I
menu-view-full-zoom-reduce =
    .label = Zoom Out
    .accesskey = O
menu-view-full-zoom-actual-size =
    .label = Actual Size
    .accesskey = A
menu-view-full-zoom-toggle =
    .label = Zoom Text Only
    .accesskey = T
menu-view-page-style-menu =
    .label = Page Style
    .accesskey = y
menu-view-page-style-no-style =
    .label = No Style
    .accesskey = n
menu-view-page-basic-style =
    .label = Basic Page Style
    .accesskey = B
menu-view-repair-text-encoding =
    .label = Repair Text Encoding
    .accesskey = c


menu-view-enter-full-screen =
    .label = Enter Full Screen
    .accesskey = F
menu-view-exit-full-screen =
    .label = Exit Full Screen
    .accesskey = F
menu-view-full-screen =
    .label = Full Screen
    .accesskey = F


menu-view-enter-readerview =
    .label = Enter Reader View
    .accesskey = R
menu-view-close-readerview =
    .label = Close Reader View
    .accesskey = R


menu-view-show-all-tabs =
    .label = Show All Tabs
    .accesskey = A
menu-view-bidi-switch-page-direction =
    .label = Switch Page Direction
    .accesskey = D


menu-history =
    .label = History
    .accesskey = s
menu-history-show-all-history =
    .label = Show All History
menu-history-clear-recent-history =
    .label = Clear Recent History…
menu-history-synced-tabs =
    .label = Synced Tabs
menu-history-restore-last-session =
    .label = Restore Previous Session
menu-history-hidden-tabs =
    .label = Hidden Tabs
menu-history-undo-menu =
    .label = Recently Closed Tabs
menu-history-undo-window-menu =
    .label = Recently Closed Windows
menu-history-reopen-all-tabs = Reopen All Tabs
menu-history-reopen-all-windows = Reopen All Windows


menu-bookmarks-menu =
    .label = Bookmarks
    .accesskey = B
menu-bookmarks-manage =
    .label = Manage Bookmarks
menu-bookmark-tab =
    .label = Bookmark Current Tab…
menu-edit-bookmark =
    .label = Edit This Bookmark…
menu-bookmarks-all-tabs =
    .label = Bookmark All Tabs…
menu-bookmarks-toolbar =
    .label = Bookmarks Toolbar
menu-bookmarks-other =
    .label = Other Bookmarks
menu-bookmarks-mobile =
    .label = Mobile Bookmarks


menu-tools =
    .label = Tools
    .accesskey = T
menu-tools-downloads =
    .label = Downloads
    .accesskey = D
menu-tools-addons-and-themes =
    .label = Add-ons and Themes
    .accesskey = A
menu-tools-fxa-sign-in2 =
    .label = Sign In
    .accesskey = g
menu-tools-turn-on-sync2 =
    .label = Turn on Sync…
    .accesskey = n
menu-tools-sync-now =
    .label = Sync Now
    .accesskey = o
menu-tools-fxa-re-auth =
    .label = Reconnect to { -brand-product-name }…
    .accesskey = R
menu-tools-browser-tools =
    .label = Browser Tools
    .accesskey = B
menu-tools-task-manager =
    .label = Task Manager
    .accesskey = M
menu-tools-page-source =
    .label = Page Source
    .accesskey = o
menu-tools-page-info =
    .label = Page Info
    .accesskey = I
menu-settings =
    .label = Settings
    .accesskey =
        { PLATFORM() ->
            [windows] S
           *[other] n
        }
menu-tools-layout-debugger =
    .label = Layout Debugger
    .accesskey = L


menu-window-menu =
    .label = Window
menu-window-bring-all-to-front =
    .label = Bring All to Front



menu-help =
    .label = Help
    .accesskey = H
menu-get-help =
    .label = Get Help
    .accesskey = H
menu-help-more-troubleshooting-info =
    .label = More Troubleshooting Information
    .accesskey = T
menu-help-report-site-issue =
    .label = Report Site Issue…
menu-help-share-ideas =
    .label = Share Ideas and Feedback…
    .accesskey = S
menu-help-enter-troubleshoot-mode2 =
    .label = Troubleshoot Mode…
    .accesskey = M
menu-help-exit-troubleshoot-mode =
    .label = Turn Troubleshoot Mode Off
    .accesskey = M
menu-help-report-deceptive-site =
    .label = Report Deceptive Site…
    .accesskey = D
menu-help-not-deceptive =
    .label = This Isn’t a Deceptive Site…
    .accesskey = D