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
  baseAuthUrl: '/auth/realms/JBPM/protocol/openid-connect',
  baseUrl : '/kie-server/services/rest/server',
  containerId : 'DemandTracker_1.0.0-SNAPSHOT' ,
  caseDefinition : 'SchemeDemandTracker.DemandTracker',
  username: 'wbadmin',
  password: 'jumpco2017',
  clientSecrete: 'c90badbb-442c-41f0-8719-e9fbc894cd21',
  client_id: 'kie-execution-server',
};
