import { Outlet } from 'react-router-dom';
// material
import { Link as RouterLink } from 'react-router-dom'; 
import {Link, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import Logo from '../components/Logo';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  // position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

// ----------------------------------------------------------------------

export default function LogoOnlyLayout() {
  return (
    <>
      <HeaderStyle>
        <Logo />

      
        <Typography variant="body2" align="center" style={{position:'absolute', right:10, top:0}} sx={{ mt: 6 }}>
            Already having an account?&nbsp;
            <Link variant="subtitle2" component={RouterLink} to="/">
              Login
            </Link>
          </Typography>
      </HeaderStyle>
      <Outlet />
    </>
  );
}
