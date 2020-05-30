export default {
  currentUser: {
    id:                       null,
    first_name:               '',
    last_name:                '',
    full_name:                '',
    email:                    null,
    avatar:                   null,
    role:                     null
  },
  modalBox: {
  	show:                     false,
  	title:                    '',
  	content:                  ''
  },
  job: {
    jobModalShow:             false,
    jobViewShow:              false,
    jobViewId:                null,
    jobEditId:                null,
    refreshJobView:           false
  },
  user: {
    refreshUsersCollection:   false
  },
  refreshControls: {
    refreshCalendar:          false,
    calendar_start_day:       null,
    calendar_end_day:         null,
    refreshDayJobsList:       false
  }
}