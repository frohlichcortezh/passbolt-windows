﻿/**
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
 * @since         0.0.1
 */

namespace passbolt.Models.Messaging.Topics
{
    public class ProgressTopics
    {
        public const string PROGRESSOPENDIALOG = "passbolt.progress.open-progress-dialog";
        public const string PROGRESSUPDATEGOALS = "passbolt.progress.update-goals";
        public const string PROGRESSCLOSEDIALOG = "passbolt.progress.close-progress-dialog";
        public const string PROGRESSUPDATE = "passbolt.progress.update";
    }
}