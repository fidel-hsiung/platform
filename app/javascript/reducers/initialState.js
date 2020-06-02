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
    jobEditId:                null
  },
  user: {
    refreshUsersCollection:   false
  },
  refreshControls: {
    calendarStartDay:         null,
    calendarEndDay:           null,
    refreshCalendar:          false,
    jobsDay:                  null,
    refreshDayJobsList:       false,
    refreshJobsList:          false
  }
}