import React from 'react'
import Schedule from 'react-schedule-job'
import 'react-schedule-job/dist/index.css'
import HTTPManager from './utils/httpRequestManager';
import SyncProgress from './pages/syncData/syncProgressWithoutRefresh';  
import 'react-js-cron/dist/styles.css'

const styles = {
  text: {
    margin: '70px',
    color: 'skyblue'
  }
}

const HelloMsg = () => {
  return <h1 style={styles.text}>Hello!</h1>
}

const AutoSync = ({batchtime}) => {
  const [open, setOpen] = React.useState(false)
  const [batch, setBatch] = React.useState(false)
  const [value, setValue] = React.useState('37 13 * * *')//batchtime[1]+' '+batchtime[0]+' * * *'
  const httpManager = new HTTPManager(); 
  const sayHello = () => {
    console.log("Hello msg", new Date())
    if(!open)
        setOpen(true)
  }

  const autoBatch = ()=>{ 
    if(!batch){
      setBatch(true) 
      console.log("AUTO BATCH CALLED")
      httpManager.postRequest("/merchant/batch/autoBatch", {data:"FROM AUTO BATCH"}).then(res=>{
        setBatch(false)
      })
    }
  }

  const test=()=>{
    console.log("TEST CALLED")
  }

  const test1=()=>{
    console.log("TEST1 CALLED")
  }
  // this is the function which will run according to your settings
  const batchtimestr =  '56 13 * * *'
  console.log(batchtimestr)

  const jobs = [
    {
      fn: sayHello,
      id: '1',
      schedule: '0,15,30,45 * * * *'
      // this runs every 15 minutes
    },
    // {
    //   fn: autoBatch,
    //   id: '4',
    //   schedule:batchtime
    //   // this runs every 15 minutes
    // }, 
    // {
    //   fn: autoBatch,
    //   id: '2',
    //   schedule: batchtime[1]+' '+batchtime[0]+' * * *'
    //   // this runs every 15 minutes
    // },
    // {
    //   fn: test,
    //   id: '3',
    //   schedule: '* * * * *'
    //   // this runs every 15 minutes
    // }
    
  ]

  console.log(jobs)

  return (
    <div>
      <Schedule
        jobs={jobs}
        timeZone='local'
        // "UTC", "local" or "YOUR PREFERRED TIMEZONE",
        dashboard={{
          hidden: true
          // if true, dashboard is hidden
        }}
      /> 
      
      {open && <div style={{'visibility':'hidden', height:0}}><SyncProgress afterSyncComplete={()=>{
                      setOpen(false)
                    }} /></div>}
    </div>
  )
}

export default AutoSync