import {
  Toolbar,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { Logout } from '@mui/icons-material';

const Header = () => {
 

  return (
    <>
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
<img src='https://www.solarladder.com/logo.png'/>
         
        </Box>

       

        <IconButton edge="end" color="inherit" >
          <Logout />
        </IconButton>
      </Toolbar>
      <Box style={{margin:'2rem'}}> <Typography variant="h5" component="div" >
            Books
          </Typography></Box>
      <Tabs
      value="one"
      style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
    >
      <Tab value="one" label="Inventory" style={{ width:"43%" }} />
      <Tab value="two" label="Items" style={{  width:"43%"  }} />
      <Tab value="three" label="Expenses" style={{  width:"43%"  }} />
    </Tabs>





    </>
  );
};

export default Header;
