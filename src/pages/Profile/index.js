import React from 'react'; 
import { Link as RouterLink } from 'react-router-dom';
import Page from '../../components/Page';
// material
import { Card, Stack, Container, Typography, Breadcrumbs, Link, CardContent, Button } from '@mui/material';
import TableContent from '../../components/table/tableView'; 
import Close from '@mui/icons-material/Close'
import FormManager from '../../components/formComponents/FormManager';
// ----------------------------------------------------------------------

import HTTPManager from '../../utils/httpRequestManager';
import schema from './schema.json'

export default class UserProfile extends React.Component {
    httpManager = new HTTPManager();
    constructor(props) {
        super(props);
        this.state = {
            userdetail: {},
            merchantList: [],
            selectedBusiness:{},
            schema: schema,
            viewdialog: false,
            columns: [
                {
                    field: 'user_passcode',
                    headerName: 'Passcode',
                    maxWidth: 100,
                    flex:1,
                    renderCell: (params) => <div> {params.row.mEmployeePasscode} </div>
                },
                {
                    field: 'name',
                    headerName: 'Name',
                    maxWidth: 200,
                    flex:1,
                    editable:false,
                    sortable:false,
                    renderCell: (params) => <div> {params.row.merchantName} </div>
                  },
                  {
                    field: 'owner_name',
                    headerName: 'Owner',
                    maxWidth: 200,
                    flex:1,
                    editable:false,
                    sortable:false,
                    renderCell: (params) => (
                      <div style={{ textTransform: 'capitalize' }}> {params.row.merchantOwner === ''? '--' : params.row.merchantOwner} </div>
                    )
                  },
                  {
                    field: 'businessphone',
                    headerName: 'Business Phone',
                    maxWidth: 200,
                    flex:1,
                    editable:false,
                    sortable:false,
                    renderCell: (params) => <div> {params.row.merchantPhone}  </div>
                  },
                  {
                    field: 'syncCode',
                    headerName: 'SyncCode',
                    maxWidth: 100,
                    flex:1,
                    editable:false,
                    sortable:false,
                    renderCell: (params) => (
                      <div style={{ textTransform: 'capitalize' }}> {params.row.merchantStatus === 'Verified' ? params.row.syncCode : 'Waiting'} </div>
                    )
                  },
                  {
                    field: 'referral_agent',
                    headerName: '',
                    maxWidth: 200,
                    flex:1,
                    editable:false,
                    sortable:false,
                    renderCell: (params) => (
                      <div style={{ textTransform: 'capitalize' }}> 
                       <Button permission_id = "web_edit_user" permission_label="Show edit user"
                            variant="outlined" 
                            size="small" 
                            onClick={()=>this.openView(params.row)} 
                            label="View">View</Button>
                      </div>
                    )
                  },

            ]
        }
    }


    setFormDetails(){
        this.setState({isLoading: true})
        var data = Object.assign({}, this.state.selectedBusiness);
        var schema = Object.assign({}, this.state.schema);
        var propslist = Object.assign([], this.state.schema.properties);
        var properties = [];
        propslist.forEach((field, i)=>{ 
            field.value = data[field.name];
            // field.disabled=true;
            properties.push(field);
            if(i === propslist.length-1){ 
                properties.push({
                    "component":"TextField", 
                    "type": "hidden", 
                    "minLength": 1,
                    "maxLength": 50,
                    "grid":6,
                    "name":"id",
                    "label":"id",
                    "placeholder":"id",
                    "value":data.id
                  })
                // console.log(properties)
                schema.properties = properties
                this.setState({schema: schema},()=>{
                    this.setState({isLoading: false, viewdialog: true})
                })
            }
        })
    }


  openView(row){
    this.setState({selectedBusiness: row}, function(){
      // console.log("selected row",this.state.selectedBusiness)
    //   this.setState({viewdialog: true})
      // this.handleChangeTab('',1);
      this.setFormDetails()
    })
  }

    componentDidMount() {
        var udetail = window.localStorage.getItem('userdetail') || '';
        if(udetail !== ''){
            var userdetail = JSON.parse(udetail)
            this.setState({userdetail: userdetail}); 
            
        }
        this.getUserDetails();
    }

    getUserDetails(){
        this.httpManager.getRequest('/merchant/profile/getProfile').then(profile=>{
            this.setState({  merchantList: profile.merchants})
        })
    }

    handleClose(){
        this.setState({selectedBusiness:{}, viewdialog: false})
    }
    render() {
        return (
            <Page title="Profile | Astro POS">
                <Container maxWidth="xl">
                    <Stack direction="column" alignItems="left" mb={5}>
                        <Typography variant="h4" gutterBottom> User Profile </Typography>
                        <Breadcrumbs separator=">" aria-label="breadcrumb">
                            <Link component={RouterLink} underline="hover" color="inherit" to="/dashboard/app">
                                Dashboard
                            </Link> 
                            <Typography color="text.primary">Profile</Typography>
                        </Breadcrumbs>
                    </Stack>
                    <Card>
                        <CardContent>
                            <Typography sx={{  flex: 1 }} variant="h6" component="div" className="textColor" style={{textTransform:'capitalize'}}>
                                {/* {this.state.userdetail.firstName} {this.state.userdetail.lastName} */}
                                Basic Details
                            </Typography>
                        
                            <Stack spacing={3} className='profiledetails'>
                                 <Stack direction={{ xs: 'column', sm: 'row', mt:1 }} spacing={2}>
                                    <p><b> First Name : </b> {this.state.userdetail.firstName}</p>  
                                     <p><b> Last Name : </b> {this.state.userdetail.lastName !== '' ? this.state.userdetail.lastName : ' --- ' }</p>    
                                </Stack>
                                <Stack direction={{ xs: 'column', sm: 'row', mt:1 }} spacing={2}>
                                    <p><b> Role : </b> {this.state.userdetail.mEmployeeRoleName}</p>  
                                    <p><b> Email : </b> {this.state.userdetail.email}</p>  
                                </Stack> 
                                
                            </Stack>

                            {this.state.merchantList.length > 0 && <>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div" className="textColor" style={{textTransform:'capitalize'}}>
                                Merchant Details
                            </Typography>
                            
                            <Stack sx={{mt: 2}} spacing={3}>
                                { this.state.viewdialog ? <>              
                                        <div style={{display:'flex', justifyContent:'flex-end'}}>
                                            <div onClick={()=>this.handleClose()}><Close /></div>
                                        </div> 
                                        <FormManager formProps={this.state.schema} reloadData={()=>{
                                                this.reloadData()
                                            }} closeForm={(action='', formData={})=>{
                                                // console.log(action, formData)
                                                if(action === ''){
                                                    this.setState({viewdialog: false, selectedBusiness: {}})
                                                }
                                                if(action==='Deactivate'){
                                                    this.onDeactivate();
                                                } 
                                            }}/>
                                    </>             
                                    :
                                    <TableContent data={this.state.merchantList} columns={this.state.columns} />
                                }
                            </Stack></>}

                        </CardContent>
                    </Card>
 

                </Container>
            </Page>
        )
    }
}