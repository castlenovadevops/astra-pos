import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material"; 

DialogComponent.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    actions: PropTypes.node
  };
export default function DialogComponent({children, title, onClose, open, actions, className='lgwidth'}){
    return <Dialog
    style={{zIndex:'99999'}}
    className={className}
    open={open}
    onClose={onClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
>
    <DialogTitle id="alert-dialog-title">
        <div style={{display:'flex',width:'100%', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <span>{title}</span>
            <Button variant="contained" onClick={onClose}> Close X</Button>
        </div>
    </DialogTitle>
    <DialogContent>
    <DialogContentText id="alert-dialog-description">
        {children}
    </DialogContentText>
    <DialogActions>
        {actions}
    </DialogActions>
    </DialogContent> 
</Dialog>
}