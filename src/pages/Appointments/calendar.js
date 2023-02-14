import React from 'react'
import dayjs from 'dayjs'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' 
import HTTPManager from '../../utils/httpRequestManager'
import moment from 'moment'
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

const INITIAL_EVENTS = [
  {
    id
: 
"95e85d00-b7d9-4c37-92f8-fe10d4b5812e",
start
: 
"2022-12-29T18:30:48",
title
: 
"Smith"
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: todayStr + 'T14:00:00'
  }
]

function createEventId() {
  return String(eventGuid++)
}


export default class AppointmentCalendar extends React.Component {
    httpManager = new HTTPManager();
    constructor(props){
        super(props)
        this.state = { 
            weekendsVisible: true,
            currentEvents: [],
            appointments:[],
            isLoading: false,
            appointmentdetail:{}
        }
        this.formatData = this.formatData.bind(this)
        this.formatServiceData = this.formatServiceData.bind(this)
    }

    componentDidMount(){
        this.getAppointments();
    }

    getAppointments(){
        this.setState({isLoading: true})
        this.httpManager.postRequest(`/merchant/appointment/getAllAppointmentsByDate`,{data:"FROM CALENDAR"}).then(res=>{
            console.log("DATAAAA")
            console.log(res.data)
            var data = []

            this.setState({appointments: []},()=>{
                console.log(this.state.appointments)
                res.data.forEach((element, i) => {
                    console.log(moment(element.appointmentDate).format("YYYY-MM-DD")+"T"+element.appointmentTime+":00") 
                    var endtime= element.appointmentTime.split(":")[0]+":"+(Number(element.appointmentTime.split(":")[1])+10)
                    if(Number(element.appointmentTime.split(":")[1])+10 >= 60){
                      endtime= element.appointmentTime.split(":")[0]+":59"
                    } //dayjs(moment(element.appointmentDate).format("YYYY-MM-DD")+"T"+element.appointmentTime+":00").add(10,'minute')
                    console.log(endtime)
                    data.push({
                        id: element.appointmentId,
                        end:moment(element.appointmentDate).format("YYYY-MM-DD")+"T"+endtime+":00",
                        start:moment(element.appointmentDate).format("YYYY-MM-DD")+"T"+element.appointmentTime+":00",
                        title: element.title
                    })
                    if(i === res.data.length-1){
                        this.setState({appointments: data, isLoading: false},()=>{
                            console.log(this.state.appointments)
                        })
                    }
                });
                if(res.data.length === 0){
                    this.setState({isLoading: false})
                }
            })
        })
    }


  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible
    })
  }

  handleDateSelect = (selectInfo) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }

  handleEventClick = (clickInfo) => {
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove()
    // }
    this.httpManager.postRequest('/merchant/appointment/getAppointmentDetail', {id: clickInfo.event.id}).then(res=>{
        this.formatData(0,res.data, []) 
    })
  }

  formatData(i, results, data){ 
    if(i < results.length){
        var appt = results[i]   
        data.push({
            customer:appt.mCustomer !== null ? appt.mCustomer.mCustomerId : appt.mCustomer ,
            services:[]
        })
        this.formatServiceData(0, i, results, data)
    }
    else{ 
        var requestedDate = moment(results[0].appointmentDate+"T"+results[0].appointmentTime+":00").toDate();
        var today = moment() 

        this.setState({appointmentdetail : {
            appointmentDate: moment(results[0].appointmentDate).toDate(),
            appointmentTime: results[0].appointmentTime,
            appointments: data,
            appointmentId: results[0].appointmentId,
            editable: today.diff(requestedDate, 'minutes') > 1 ? false : true
        }}, ()=>{ 
            this.props.editAppointment(this.state.appointmentdetail)
        })
    }
  }

  formatServiceData(j, i, results, data){
    if(j < results[i].appointmentServices.length){
        var obj = results[i].appointmentServices[j];

        data[i].services.push({
            service: obj.serviceId,
            technician: obj.technicianId,
            duration: obj.serviceDuration
        })
        this.formatServiceData(j+1, i, results, data);
    }
    else{
        this.formatData(i+1, results, data)
    }
  }

  handleEvents = (events) => {
    this.setState({
      currentEvents: events
    })
  }


  handleDateClick = (arg) => { // bind with an arrow function
    alert(arg.dateStr)
  }

  render() {
    return (
       <>
       {!this.state.isLoading && <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={false}
            dayMaxEvents={false}
            allDaySlot={false}
            weekends={this.state.weekendsVisible}
            initialEvents={this.state.appointments} // alternatively, use the `events` setting to fetch from a feed
            select={this.handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            eventsSet={this.handleEvents} 
      />}</> 
    )
  }
}


function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
  } 
  