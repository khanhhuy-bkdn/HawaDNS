/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  recaptChaKey: '6LesxoQUAAAAADjIwJRaSvvXMgIU5ju2ObUDnpTx',
  // build thường
  // api_endpoint: 'http://115.79.35.119:9010/api/hawa/',
  api_endpoint: 'http://localhost:50850/api/hawa/',

  // prod
  // api_endpoint: 'http://112.78.1.136:81/api/hawa/',
};
