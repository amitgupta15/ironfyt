(function () {
  'use strict';

  let groupTemplate = function (props) {
    return `
    <div class="position-relative text-color-primary margin-bottom-5px text-align-center">
      <h3>Special Ops Fitness</h3>
      <button class="log-this-workout-btn-abs-position" id="new-log-btn">New Log</button>
    </div>
    <div class="selected-day-control-bar">
      <div><button class="day-control" id="prev-day-btn">&#9668;</button></div>
      <div>Friday, July 15, 2021</div>
      <div><button class="day-control" id="next-day-btn">&#9658;</button></div>
    </div>
    <div class="container">
      <div class="flex margin-top-10px border-bottom-primary padding-bottom-10px">
        <div class="flex-auto">
          <details open>
            <summary>DT <span class="workout-done"><button class="edit-log-for-this-workout-btn">Edit Log</button></span></summary>
            <div>
              Type: For Time<br/>
              Rounds: 5<br/>
              Description:<br/>
              12 Deadlifts 155 lbs<br/>
              9 Hang Power Cleans 155 lbs
            </div>
          </details>
        </div>
      </div>
      <div class="margin-top-10px text-align-right">
        
      </div>
      <div class="flex margin-top-10px border-bottom-primary padding-bottom-10px">
        <div class="margin-right-10px">
          <div class="div-with-bg blue">Me</div>
        </div>
        <div>
          Workout: DT <br/>
          Duration: 30 mins<br/>
          Notes: Felt heavier than usual. Need to do more warm-up next time.
        </div>
      </div>
      <div class="flex margin-top-10px border-bottom-primary padding-bottom-10px">
        <div class="margin-right-10px">
          <div class="div-with-bg yellow">SP</div>
        </div>
        <div>
          Workout: DT <br/>
          Duration: 25 mins<br/>
          Notes: Felt good.
        </div>
      </div>
      <div class="flex margin-top-10px border-bottom-primary padding-bottom-10px">
        <div class="margin-right-10px">
          <div class="div-with-bg greenyellow">NV</div>
        </div>
        <div>
          Notes: 40 Jump Ropes<br/>
          30 thrusters<br/>
          45 deadlifts<br/>
          35 bench press<br/>
        </div>
      </div>
    </div>
    
    `;
  };
  let component = ($ironfyt.groupComponent = Component('[data-app=group]', {
    state: {
      user: {},
    },
    template: function (props) {
      return $ironfyt.pageTemplate(props, groupTemplate);
    },
  }));

  component.render();
})();
