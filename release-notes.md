# IronFyt Release Notes

## 3.1.0

Release Date: 12/21/2021

### Issues Fixed

- Unit was not showing for running (miles, etc.)
- Workout form was selecting wrong movements

## 3.0.0

Release Date: 12/20/2021

### New Features

- Parse workout description for movements
- Pre-populate movements information in logs
- Added sticky nav bar at the bottom and sticky top bar at the top
- Cannot create a workout log without selecting a workout

## 2.5.2

Release Date: 12/16/2021

### Issues Fixed

- handle deleted workout in the group page

## 2.5.1

Release Date: 10/06/2021

### Issues Fixed

- Fixed the clone button on the group page.
- Fixed the workout log link on the group page.

## 2.5.0

Release Date: 10/04/2021

### New Features

- Updated Group Page
- Added Logo on the home page
- Showing animated spinner when the data is loading on group, workout list and workout log list pages
- Showing workout detail by default on calendar view
- Added Logout button on the landing page

### Issues Fixed

- Workout log list was showing "undefined" whenever a workout is not selected. Fixed the issue to not show workout if one is not selected.

## 2.4.4

Release Date: 09/30/2021

### Issues Fixed

- Added logo on landing page Top bar

## 2.4.2

Release Date: 09/28/2021

### Issues Fixed

- Redirect to a https if http is used on login page

## 2.4.1

Release Date: 09/28/2021

### Issues Fixed

- Redirect to a https if http is used

## 2.4.0

Release Date: 09/28/2021

### New Features

- Updated Favicon
- App icons and mainfest file. Once the icon is added to the home page, the app will work more or less like a native app.

## 2.3.3

Release Date: 09/27/2021

### Issues Fixed

- Display movement info properly. If only weight is specified, then do not show 'X' in front of the weight

## 2.3.2

- Updated release notes

## 2.3.1

Release Date: 09/27/2021

### Issues Fixed

- Added favicon
- Added SSL support on Heroku
- Addressed potential XSS attack issue on Workout log form and workout form
- Cleaned up the UX for a non-group user

## 2.3

Release Date: 09/21/2021

### Issues Fixed

- For workout form, set the max length to 30 so that the workout name doesn't spill over buttons
- Personal record is not updated when an admin creates a log for a user

### New Features

- Added last performed date on the workout list to make it easy to see what and if the workout is ever performed by the user
- Wait screen for workouts list when the system is fetching the workouts. This needs to be improved in the subsequent versions
- Admin can clone the log from Group page
- Workout log history link added on the Group page

## 2.0

- New look and feel
- Token based authentication
- Ability to edit a log
- Calendar view
- Groups

## 1.0
