# GitHub App Installation access token

A NodeJS helper application to generate access tokens from GitHub apps and access private repositories.

## Prerequisite. Create a custom GitHub application.

1. Go to your account or organization settings.
2. Go to `Developer settings`.
3. Click on `New GitHub App`.
4. Enter the application name and an optional description.
   * Leave `Callback URL` empty.
   * Turn on `Expire user authorization tokens` checkbox.
   * Ensure to give Read-Only permissions to `Actions`, `Contents`, `Metadata`, `Packages` and `Secrets`. Adjust the rest on your needs.
   * For the rest of the options, adjust to your needs.
   * For organizations, may be convenient to enable subscription to events like `Push` and `Release`.
   * In `Where can this GitHub App be installed?`, select `Only on this account`.
5. Click on `Create GitHub App` to save the new app.
6. Yoy will be forwarded to the application general settings edit page.
7. Take note of the Application ID.
8. Scroll to almost the bottom of the page and click on `Generate a private key`. Save the file on a safe place.
9. Select `Install App` from the left menu and click on the Install App button next to your account/organization name.
10. Select the repositories you want the app to access and click on the `Install` button.
11. Once installed, you will be redirected to a page with an url like this `https://github.com/.../settings/installations/#####`.
12. Take note of the number at the end. It is the Installation ID.

## Using the NodeJS application.

At this point you must have:

1. The application ID.
2. The installation ID.
3. A file containing a RSA private key.

### Generating a packed credentials token

Run `npx https://github.com/randlabs/github-app-installation-access-token gen-cred -a {APP-ID} -i {INSTALLATION-ID} -k "{PRIVATE-KEY}"`

And the base64 encoded credentials token will be written into the console output.

### Getting an access token

Run `npx https://github.com/randlabs/github-app-installation-access-token get -a {APP-ID} -i {INSTALLATION-ID} -k {PRIVATE-KEY}`

or `npx https://github.com/randlabs/github-app-installation-access-token get-with-cred -c {BASE64-ENCODED-CREDENTIALS}`

To get an access token that will be written into the console output.

The common approach is to save the output into an environment variable and use it to access allowed repositories like the following example:

`git clone https://x-access-token:<token>@github.com/owner/repo.git`

#### NOTES:

* The `-k, --privateKey` parameter accepts a file reference if you prefix the value with `@`.
* Use NodeJS v16 or later.

# License
See `LICENSE` file for licensing details.
