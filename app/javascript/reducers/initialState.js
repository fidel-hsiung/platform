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
  calendar: {
    refreshCalendar:          false,
    calendar_start_day:       null,
    calendar_end_day:         null
  },
  job: {
    jobModalShow:             false,
    jobViewShow:              false,
    jobViewId:                null,
    jobEditId:                null,
    refreshJobView:           false,
    refreshDayJobsList:       false,
    refreshJobList:           false
  },
  user: {
    refreshUsersCollection:   false
  }
}