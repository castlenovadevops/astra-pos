 import React from 'react'; 
import { Grid,  Button, TextareaAutosize, Dialog, DialogContent, DialogTitle, DialogActions, DialogContentText } from '@material-ui/core/';  

export default function NotesModal(
    {
        handleCloseAddNotes,
        notes,
        handlechangeNotes,
        saveNotes,
        

}) 

{
  return (<Dialog
    open={true}
    onClose={()=>{
        this.props.data.selectedMenu(1)
    }}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    style={{zIndex:'99999'}}
    className="notespopup"
>
    <DialogTitle id="alert-dialog-title">
        Add Notes
    </DialogTitle>
    <DialogContent>
    <DialogContentText id="alert-dialog-description">
    <TextareaAutosize

                fullWidth
                label="Ticket Notes"
                name="Ticket Notes"

                id="Ticket Notes"
                rows={5}
                required
                multiline
                value={notes}
                onChange={(e) => {
                    handlechangeNotes(e.target.value);
                }}

                />
    </DialogContentText>
    </DialogContent>
    <DialogActions>
            <Button style={{marginRight: 10}} onClick={saveNotes} color="secondary" variant="contained">Save</Button>
            <Button onClick={handleCloseAddNotes} color="secondary" variant="outlined">Cancel</Button>
    </DialogActions> 
</Dialog> 
     






  );
}
