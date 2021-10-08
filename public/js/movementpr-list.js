(function () {
  'use strict';

  let movementprListTemplate = function (props) {
    let showSpinner = props && props.showSpinner;
    let movementprList = props && props.movementprList ? props.movementprList : [];
    console.log(movementprList);
    if (showSpinner) {
      return $ironfyt.displaySpinner('Rest 1 minute...');
    } else {
      return `
      <div class="container">
        ${movementprList
          .map((movementpr) => {
            let prList = movementpr.pr && movementpr.pr.length ? movementpr.pr : [];
            return `
            <div class="rounded-corner-box margin-bottom-10px">
              <h3 class="bold-text margin-bottom-10px">${movementpr.movement}</h3>
              ${prList
                .map(
                  (pr) => `
                  <div class="flex margin-top-5px">
                    <div class="flex-auto">${pr.reps} x ${pr.load} ${pr.unit}</div>
                    <div class="flex-auto">${new Date(pr.date).toLocaleDateString()}</div>
                  </div>
                  `
                )
                .join('')}
            </div>`;
          })
          .join('')}  
      </div>`;
    }
  };

  let component = ($ironfyt.movementprListComponent = Component('[data-app=movementpr-list]', {
    state: {
      user: {},
      movementprList: [],
      error: '',
      showSpinner: false,
      pageTitle: 'Personal Records',
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, movementprListTemplate);
    },
  }));

  ($ironfyt.movementprListPage = function () {
    $ironfyt.authenticateUser(function (error, auth) {
      if (error) {
        component.setState({ error, showSpinner: false });
        return;
      }
      let user = auth && auth.user ? auth.user : {};
      component.setState({ user, showSpinner: true });
      $ironfyt.getMovementPr({ user_id: user._id }, function (error, response) {
        if (error) {
          component.setState({ error, showSpinner: false });
          return;
        }
        let movementprList = response ? response : [];
        component.setState({ movementprList, showSpinner: false });
      });
    });
  })();
})();
