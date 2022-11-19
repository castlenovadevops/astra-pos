import { styled } from '@mui/material/styles';
import {  Container, Typography, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Button } from '@mui/material';    
import NumberPad from '../../components/numberpad';
import { useState } from 'react';
import HTTPManager from '../../utils/httpRequestManager';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    justifyContent: 'start',
  },
})); 

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
})); 
export default function Login() {  
  const [passcode, setPasscode] = useState('');
  const[formError, setFormError] = useState('') 

  const[showFormError, setShowFormError] = useState(false);
  var codeLength = 4
  const httpManager = new HTTPManager();

    const handleChangeCode =  (passcode)=>{

      if(passcode === "remove") {
        setPasscode(passcode);
      }
      else if(passcode.length === codeLength) {
          const stringData = passcode.reduce((result, item) => {
              return `${result}${item}`
          }, "")

          setPasscode(stringData);
      }
    }

    const loginEmp = (passcode)=>{
      const stringData = passcode.reduce((result, item) => {
          return `${result}${item}`
      }, "")

      httpManager.postRequest(`/merchant/employee/login`, {passCode: stringData}).then(res=>{
        window.localStorage.setItem('userdetail', JSON.stringify(res.data))
        window.localStorage.setItem('token', res.token);
        window.location.href="/app"
      }).catch(e=>{
        console.log(e)
        setFormError(e.message || 'Error Occurred. Please try again later');
        setShowFormError(true) 
      })
    }

    const handleCloseDialog= ()=>{
      setShowFormError(false);
      setFormError('')
    }

  return (

    <RootStyle title="Business Registration | Astro POS">  
        <Container maxWidth="sm" style={{padding:0}}>
              <ContentStyle className="mobileminauto">               
                <Typography style={{padding:0}}>
                  <img alt="Astro POS" src="/static/icons/logo-450.png"  className='logoimg'
                                    style={{ objectFit: 'cover', maxWidth:'100%'}}/>
                </Typography> 
              </ContentStyle>
      </Container> 

    <Container maxWidth="sm">
      <ContentStyle className="mobileminautoform">  
          <NumberPad codeLength='4' textLabel='Enter code' handleChangeCode={handleChangeCode} onSubmit={loginEmp}  clearPasscode={clearPasscode => console.log(clearPasscode)}/>
      </ContentStyle>
    </Container>


    <Dialog
                    open={showFormError}
                    onClose={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Error
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {formError}
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={()=>{
                            setShowFormError(false);
                            setFormError('') 
                        }}>OK </Button> 
                    </DialogActions>
                </Dialog>

  </RootStyle> 
  );
}
