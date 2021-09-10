/**
 * This helper displays a delete log confirmation modal. Make sure to register the following events in the calling module
 * $hl.eventListener('click', 'cancel-delete-log-btn', handleCancelDeleteLogEvent) --> Event handler will call $ironfyt.handleCancelDeleteLogEvent
 * $hl.eventListener('click', 'confirm-delete-log-btn', handleConfirmDeleteLogEvent); --> Event handler will call $ironfyt.handleConfirmDeleteEvent
 *
 * Register the following event as shown:
 * document.addEventListener('click', function (event) {
 *   let targetId = event.target.id;
 *   // Handle delete button click
 *   let deleteBtnRegex = new RegExp(/^delete-log-btn-([a-zA-Z]|\d){24}/);
 *   if (deleteBtnRegex.test(targetId)) {
 *     let prefix = 'delete-log-btn-';
 *     let _id = event.target.id.substring(prefix.length, event.target.id.length);
 *     showDeleteConfirmationDialog(_id);
 *   }
 * });
 *
 * Sample Implementations in the calling module
 *
 * let showDeleteConfirmationDialog = function(_id) {
 *  component.setState({ deleteLogId: _id });
 *  $ironfyt.showDeleteConfirmationDialog()
 * }
 *
 * let handleCancelDeleteLogEvent = function () {
 *   component.setState({ deleteLogId: null });
 *   $ironfyt.hideDeleteConfirmationDialog();
 * };
 *
 * let handleConfirmDeleteLogEvent = function () {
 *   let state = component.getState();
 *   let _navigateToUrl = `workoutlog-calendar.html?ref=workoutlog-calendar.html&user_id=${user_id}`
 *   if (state.deleteLogId) {
 *    $ironfyt.handleConfimDeleteLog(state.deleteLogId, _navigateToUrl, function(error){
 *      if(error) component.setState({error})
 *    });
 *   } else {
 *     component.setState({ error: { message: 'No log found to delete' } });
 *   }
 * };
 */
(function () {
  'use strict';

  $ironfyt.deleteLogConfirmationModalTemplate = function () {
    return `
    <div class="modal-container" id="delete-log-confirmation-dialog">
      <div class="modal-dialog">
        <p>Are you sure, you want to delete the log?</p>
        <div class="modal-dialog-btn-bar">
          <input type="hidden" id="delete-log-id"/>
          <button class="delete" id="confirm-delete-log-btn">Delete</button>
          <button class="cancel" id="cancel-delete-log-btn">Cancel</button>
        </div>
      </div>
    </div>
    `;
  };

  $ironfyt.showDeleteConfirmationDialog = function () {
    let deleteConfirmationDialog = document.querySelector('#delete-log-confirmation-dialog');
    deleteConfirmationDialog.style.display = 'flex';
  };

  $ironfyt.hideDeleteConfirmationDialog = function () {
    let deleteConfirmationDialog = document.querySelector('#delete-log-confirmation-dialog');
    deleteConfirmationDialog.style.display = 'none';
  };

  $ironfyt.handleConfimDeleteLog = function (deleteLogId, _navigateToUrl, callback) {
    $ironfyt.deleteWorkoutLog(deleteLogId, function (error, result) {
      if (!error) {
        $ironfyt.navigateToUrl(_navigateToUrl);
      } else {
        callback(error);
      }
    });
  };
})();
