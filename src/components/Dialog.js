import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material"; 

DialogComponent.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    actions: PropTypes.node
  };
export default function DialogComponent({children, title, onClose, open, actions}){
    return <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
>
    <DialogTitle id="alert-dialog-title">
        {title}
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