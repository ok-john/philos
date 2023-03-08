
cert-error-intro = { $hostname } uses an invalid security certificate.

cert-error-mitm-intro = Websites prove their identity via certificates, which are issued by certificate authorities.

cert-error-mitm-mozilla = { -brand-short-name } is backed by the non-profit Mozilla, which administers a completely open certificate authority (CA) store. The CA store helps ensure that certificate authorities are following best practices for user security.

cert-error-mitm-connection = { -brand-short-name } uses the Mozilla CA store to verify that a connection is secure, rather than certificates supplied by the user’s operating system. So, if an antivirus program or a network is intercepting a connection with a security certificate issued by a CA that is not in the Mozilla CA store, the connection is considered unsafe.

cert-error-trust-unknown-issuer-intro = Someone could be trying to impersonate the site and you should not continue.

cert-error-trust-unknown-issuer = Websites prove their identity via certificates. { -brand-short-name } does not trust { $hostname } because its certificate issuer is unknown, the certificate is self-signed, or the server is not sending the correct intermediate certificates.

cert-error-trust-cert-invalid = The certificate is not trusted because it was issued by an invalid CA certificate.

cert-error-trust-untrusted-issuer = The certificate is not trusted because the issuer certificate is not trusted.

cert-error-trust-signature-algorithm-disabled = The certificate is not trusted because it was signed using a signature algorithm that was disabled because that algorithm is not secure.

cert-error-trust-expired-issuer = The certificate is not trusted because the issuer certificate has expired.

cert-error-trust-self-signed = The certificate is not trusted because it is self-signed.

cert-error-trust-symantec = Certificates issued by GeoTrust, RapidSSL, Symantec, Thawte, and VeriSign are no longer considered safe because these certificate authorities failed to follow security practices in the past.

cert-error-untrusted-default = The certificate does not come from a trusted source.

cert-error-domain-mismatch = Websites prove their identity via certificates. { -brand-short-name } does not trust this site because it uses a certificate that is not valid for { $hostname }.

cert-error-domain-mismatch-single = Websites prove their identity via certificates. { -brand-short-name } does not trust this site because it uses a certificate that is not valid for { $hostname }. The certificate is only valid for <a data-l10n-name="domain-mismatch-link">{ $alt-name }</a>.

cert-error-domain-mismatch-single-nolink = Websites prove their identity via certificates. { -brand-short-name } does not trust this site because it uses a certificate that is not valid for { $hostname }. The certificate is only valid for { $alt-name }.

cert-error-domain-mismatch-multiple = Websites prove their identity via certificates. { -brand-short-name } does not trust this site because it uses a certificate that is not valid for { $hostname }. The certificate is only valid for the following names: { $subject-alt-names }

cert-error-expired-now = Websites prove their identity via certificates, which are valid for a set time period. The certificate for { $hostname } expired on { $not-after-local-time }.

cert-error-not-yet-valid-now = Websites prove their identity via certificates, which are valid for a set time period. The certificate for { $hostname } will not be valid until { $not-before-local-time }.

cert-error-code-prefix = Error code: { $error }

cert-error-code-prefix-link = Error code: <a data-l10n-name="error-code-link">{ $error }</a>

cert-error-ssl-connection-error = An error occurred during a connection to { $hostname }. { $errorMessage }

cert-error-symantec-distrust-description = Websites prove their identity via certificates, which are issued by certificate authorities. Most browsers no longer trust certificates issued by GeoTrust, RapidSSL, Symantec, Thawte, and VeriSign. { $hostname } uses a certificate from one of these authorities and so the website’s identity cannot be proven.

cert-error-symantec-distrust-admin = You may notify the website’s administrator about this problem.

cert-error-old-tls-version = This website might not support the TLS 1.2 protocol, which is the minimum version supported by { -brand-short-name }.

cert-error-details-hsts-label = HTTP Strict Transport Security: { $hasHSTS }

cert-error-details-key-pinning-label = HTTP Public Key Pinning: { $hasHPKP }

cert-error-details-cert-chain-label = Certificate chain:

open-in-new-window-for-csp-or-xfo-error = Open Site in New Window

csp-xfo-blocked-long-desc = To protect your security, { $hostname } will not allow { -brand-short-name } to display the page if another site has embedded it. To see this page, you need to open it in a new window.


connectionFailure-title = Unable to connect
deniedPortAccess-title = This address is restricted
dnsNotFound-title = Hmm. We’re having trouble finding that site.

dns-not-found-trr-only-title =
  Possible security risk for { $hostname }.

dns-not-found-native-fallback-title =
  Possible security risk for { $hostname }.

fileNotFound-title = File not found
fileAccessDenied-title = Access to the file was denied
generic-title = Oops.
captivePortal-title = Log in to network
malformedURI-title = Hmm. That address doesn’t look right.
netInterrupt-title = The connection was interrupted
notCached-title = Document Expired
netOffline-title = Offline mode
contentEncodingError-title = Content Encoding Error
unsafeContentType-title = Unsafe File Type
netReset-title = The connection was reset
netTimeout-title = The connection has timed out
unknownProtocolFound-title = The address wasn’t understood
proxyConnectFailure-title = The proxy server is refusing connections
proxyResolveFailure-title = Unable to find the proxy server
redirectLoop-title = The page isn’t redirecting properly
unknownSocketType-title = Unexpected response from server
nssFailure2-title = Secure Connection Failed
csp-xfo-error-title = { -brand-short-name } Can’t Open This Page
corruptedContentError-title = Corrupted Content Error
sslv3Used-title = Unable to Connect Securely
inadequateSecurityError-title = Your connection is not secure
blockedByPolicy-title = Blocked Page
clockSkewError-title = Your Computer Clock is Wrong
networkProtocolError-title = Network Protocol Error
nssBadCert-title = Warning: Potential Security Risk Ahead
nssBadCert-sts-title = Did Not Connect: Potential Security Issue
certerror-mitm-title = Software is Preventing { -brand-short-name } From Safely Connecting to This Site