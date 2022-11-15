import { styled } from '@mui/material/styles';
import {  Container, Typography } from '@mui/material'; 
import FormManager from '../../components/formComponents/FormManager';
import schema from './schema.json'; 

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
             <FormManager formProps={schema} />   
      </ContentStyle>
    </Container>
  </RootStyle> 
  );
}
