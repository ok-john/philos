
webauthn-pin-invalid-prompt =
    { $retriesLeft ->
        [0] Wrong PIN! Please enter the correct PIN for your device.
        [one] Wrong PIN! Please enter the correct PIN for your device. You have { $retriesLeft } attempt left.
       *[other] Wrong PIN! Please enter the correct PIN for your device. You have { $retriesLeft } attempts left.
    }
webauthn-pin-required-prompt = Please enter the PIN for your device.
