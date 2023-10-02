/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2023 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2023 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         0.3.0
 */

import {defaultAccountDto} from "passbolt-browser-extension/src/all/background_page/model/entity/account/accountEntity.test.data";

export const accountKit = {
  accountMetaData: {
    domain: defaultAccountDto().domain,
    user_id: defaultAccountDto().user_id,
    username: defaultAccountDto().username,
    first_name: defaultAccountDto().first_name,
    last_name: defaultAccountDto().last_name,
    security_token: defaultAccountDto().security_token,
    server_public_armored_key: defaultAccountDto().server_public_armored_key,
    user_public_armored_key: defaultAccountDto().user_public_armored_key
  },
  accountSecret: {
    userId: defaultAccountDto().userId,
    user_private_armored_key: defaultAccountDto().user_private_armored_key
  }
};
