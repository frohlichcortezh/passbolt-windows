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

import {OpenpgpAssertion} from "passbolt-browser-extension/src/all/background_page/utils/openpgp/openpgpAssertions";
import Keyring from "passbolt-browser-extension/src/all/background_page/model/keyring";
import i18n from "passbolt-browser-extension/src/all/background_page/sdk/i18n";
import GpgKeyError from "passbolt-browser-extension/src/all/background_page/error/GpgKeyError";
import {DOWNLOAD_FILE} from "../enumerations/appEventEnumeration";
import FileService from "passbolt-browser-extension/src/all/background_page/service/file/fileService";

const PUBLIC_KEY_FILENAME = "passbolt_public.asc";
const MIME_TYPE_TEXT_PLAIN = "text/plain";

class DownloadUserPublicKeyController {
  /**
   * CheckPassphraseController constructor
   * @param {Worker} worker
   * @param {string} requestId uuid
   */
  constructor(worker, requestId) {
    this.worker = worker;
    this.requestId = requestId;
    this.keyring = new Keyring();
  }

  /**
   * Wrapper of exec function to run it with worker.
   *
   * @returns {Promise<void>}
   */
  async _exec() {
    try {
      await this.exec();
      this.worker.port.emit(this.requestId, "SUCCESS");
    } catch (error) {
      console.error(error);
      this.worker.port.emit(this.requestId, 'ERROR', error);
    }
  }
  /**
   * Offer to users to download their public key
   *
   * @returns {Promise<void>}
   */
  async exec() {
    const privateArmoredKey = this.keyring.findPrivate()?.armoredKey;
    if (!privateArmoredKey) {
      throw new GpgKeyError(i18n.t("Public key can't be found."));
    }
    const privateKey = await OpenpgpAssertion.readKeyOrFail(privateArmoredKey);
    OpenpgpAssertion.assertPrivateKey(privateKey);
    const publicKeyArmored = await privateKey.toPublic().armor();

    const blobFile = new Blob([publicKeyArmored], {type: MIME_TYPE_TEXT_PLAIN});
    const content = await FileService.blobToDataURL(blobFile);
    this.worker.port.emit(DOWNLOAD_FILE, {content, filename: PUBLIC_KEY_FILENAME});
  }
}

export default DownloadUserPublicKeyController;
