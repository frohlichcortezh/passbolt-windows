/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         0.5.0
 */

import Keyring from "passbolt-browser-extension/src/all/background_page/model/keyring";
import GetPassphraseService from "passbolt-browser-extension/src/all/background_page/service/passphrase/getPassphraseService";
import CheckPassphraseController from "passbolt-browser-extension/src/all/background_page/controller/crypto/checkPassphraseController";
import GetUserKeyInfoController from "passbolt-browser-extension/src/all/background_page/controller/crypto/getUserKeyInfoController";
import GetKeyInfoController from "passbolt-browser-extension/src/all/background_page/controller/crypto/getKeyInfoController";
import DownloadUserPrivateKeyController from "../controllers/downloadUserPrivateKeyController";
import DownloadUserPublicKeyController from "../controllers/downloadUserPublicKeyController";

const listen = function(worker, _, account) {
  /*
   * ==================================================================================
   *  Get Key info events
   * ==================================================================================
   */

  /*
   * Get the public key information for a user.
   *
   * @listens passbolt.keyring.get-public-key-info-by-user
   * @param requestId {uuid} The request identifier
   * @param userId {string} The user identifier
   */
  worker.port.on('passbolt.keyring.get-public-key-info-by-user', async(requestId, userId) => {
    const controller = new GetUserKeyInfoController(worker, requestId);
    await controller._exec(userId);
  });

  /**
   * Get information from the given armored key.
   *
   * @listens passbolt.keyring.get-key-info
   * @param {uuid} requestId The request identifier
   * @param {string} armoredKey The armored key to get info from
   */
  worker.port.on('passbolt.keyring.get-key-info', async(requestId, armoredKey) => {
    const controller = new GetKeyInfoController(worker, requestId);
    await controller._exec(armoredKey);
  });

  /*
   * ==================================================================================
   *  Import Key & Sync' events
   * ==================================================================================
   */

  /*
   * Check the private key passphrase.
   *
   * @listens passbolt.keyring.private.checkpassphrase
   * @param requestId {uuid} The request identifier
   * @param passphrase {string} The passphrase to check
   */
  worker.port.on('passbolt.keyring.private.checkpassphrase', async(requestId, passphrase) => {
    const controller = new CheckPassphraseController(worker, requestId);
    await controller._exec(passphrase);
  });

  /*
   * ==================================================================================
   *  Backups key events
   * ==================================================================================
   */

  /*
   * Offer to users to download their public key
   *
   * @listens passbolt.keyring.download-my-public-key
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('passbolt.keyring.download-my-public-key', async requestId => {
    const controller = new DownloadUserPublicKeyController(worker, requestId);
    await controller._exec();
  });

  /*
   * Offer to users to download their private key
   *
   * @listens passbolt.keyring.download-my-private-key
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('passbolt.keyring.download-my-private-key', async requestId => {
    const controller = new DownloadUserPrivateKeyController(worker, requestId, account);
    await controller._exec();
  });

  /*
   * Get private key
   *
   * @listens passbolt.keyring.get-private-key
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('passbolt.keyring.get-private-key', async requestId => {
    try {
      const getPassphraseService = new GetPassphraseService(account);
      await getPassphraseService.request(worker);
      const keyring = new Keyring();
      const privateKeyInfo = keyring.findPrivate();
      if (!privateKeyInfo) {
        throw new Error('Private key not found.');
      }
      worker.port.emit(requestId, 'SUCCESS', privateKeyInfo.armoredKey);
    } catch (error) {
      worker.port.emit(requestId, 'ERROR', error);
    }
  });
};
export const KeyringEvents = {listen};

