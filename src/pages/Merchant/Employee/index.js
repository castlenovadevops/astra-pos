import React from "react";
import Loader from '../../../components/Loader';
import Page from '../../../components/Page';
import HTTPManager from "../../../utils/httpRequestManager";
import TableView from '../../../components/table/tableView';
import { toast, ToastContainer } from 'react-toastify';
import Iconify from '../../../components/Iconify';
import FormManager from "../../../components/formComponents/FormManager";
import schema from './schema.json';
import {Box, Grid, Card,  Container, Typography, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@mui/material';
import FButton from '../../../components/formComponents/components/button';
import { Offline, Online } from "react-detect-offline";
import AutoBatchComponent from "../../../autoBatch";
import { checkButtonAccess } from "../../../utils/protector";
const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

export default class Employee extends React.Component{
    httpManager = new HTTPManager();

    constructor(){
        super();
        this.state={
            isLoading:false,
            schema:{},
            employeelist:[],
            addForm: false,
            selectedEmployee:{},
            defaultcommission:{},
            openDialog: false,
            columns:[
                {
                    field: 'mEmployeeFirstName',
                    headerName: 'Name',
                    minWidth:200,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                            {params.row.mEmployeeFirstName === ''? '--' : params.row.mEmployeeFirstName + ' ' + params.row.mEmployeeLastName }
                        </div>
                    )
                },
                {
                    field: 'mEmployeeEmail',
                    headerName: 'Email',
                    minWidth:200,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                           {params.row.mEmployeeEmail === ''? '--' : params.row.mEmployeeEmail}
                        </div>
                    )
                },
                {
                    field: 'mEmployeeRole',
                    headerName: 'Role',
                    minWidth:100,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                          {params.row.mEmployeeRoleName === ''? '--' : params.row.mEmployeeRoleName}
                        </div>
                    )
                },
                {
                  field: 'mEmployeeCode',
                  headerName: 'PassCode', 
                  editable: false,
                  renderCell: (params) => (
                      <div>
                         {params.row.mEmployeePasscode === ''? '--' : params.row.mEmployeePasscode}
                      </div>
                  )
                },

                {
                    field: 'mEmployeeStatus',
                    headerName: 'Status',
                    minWidth:200,
                    editable: false,
                    renderCell: (params) => (
                        <div>
                           {params.row.mEmployeeStatus === '1'? 'Active' : 'Inactive'}
                        </div>
                    )
                },
                {
                    field: 'Action',
                    headerName:'Actions',
                    flex:1,
                    minWidth:100,
                    renderCell: (params) => (
                        this.getActions(params)                    
                    ),
                }
            ]
        }
        this.handleCloseform = this.handleCloseform.bind(this); 
        this.updateRecord = this.updateRecord.bind(this);
        this.getEmpslist = this.getEmpslist.bind(this);
    }
    updateRecord(row, status){ 
        this.setState({isLoading: true}, ()=>{
            this.httpManager.postRequest(`merchant/employee/update`, {mEmployeeStatus: status, id: row.id}).then(res=>{
                // console.log(res.message);
                this.setState({isLoading: false});
                this.reloadData(res.message);
            })
        })
    }
    componentDidMount(){ 
        this.setState({schema: schema},()=>{
            this.reloadData();
        })
    }
    handleCloseform(){
        this.setState({addForm: false})
    }
    getActions(params){
        var detail = window.localStorage.getItem('userdetail')
        if(detail !== '' && detail !== undefined && detail !=='{}'){
          var userdetail = JSON.parse(detail);
        return <div>       
            {(checkButtonAccess('Employee') !== 'W' && userdetail.mEmployeeRoleName!=='Owner') && <div style={{margin:'0 8px'}}>N/A</div>}
                <Offline>
                    {(checkButtonAccess('Employee') === 'W' || userdetail.mEmployeeRoleName==='Owner')&&  <FButton
                    variant="outlined" 
                    size="small" 
                    disabled={ true }
                    onClick={()=>this.openEdit(params.row)} 
                    label="Edit"/>}
                </Offline>
                <Online>
                    {(checkButtonAccess('Employee') === 'W'  || userdetail.mEmployeeRoleName==='Owner')&&  <FButton
                        variant="outlined" 
                        size="small" 
                        disabled={ !navigator.onLine }
                        onClick={()=>this.openEdit(params.row)} 
                        label="Edit"/>}
                
                {/* {(userdetail.mEmployeeRoleName === 'Admin' || userdetail.mEmployeeRoleName==='Owner') &&  params.row.mEmployeeStatus.toString() === '1' &&
                    <FButton
                    variant="contained" 
                    size="small" 
                    disabled={ !navigator.onLine }
                    onClick={()=>{this.updateRecord(params.row, '0')}} 
                    label="Deactivate"/>
                }
                {(userdetail.mEmployeeRoleName === 'Admin'  || userdetail.mEmployeeRoleName==='Owner')&&  params.row.mEmployeeStatus.toString() === '0'  &&
                    <FButton
                    variant="contained" 
                    size="small" 
                    disabled={ !navigator.onLine }
                    onClick={()=>{this.updateRecord(params.row, '1')}} 
                    label="Activate"/>
                } */}
                </Online>               
            </div>
        }
    }
    openEdit(data){ 
        var schema = Object.assign({}, this.state.schema);
        var properties = Object.assign([], this.state.schema.properties);
        var props=[];
        properties.forEach((field,i)=>{
            console.log("EMP EDIT")
            console.log(data, field.name)
            field.value = data[field.name];
            if(field.name === 'mEmployeeRole' || field.name === 'mEmployeePasscode'){
                field.disabled = true;
            }
            if(field.component !== 'Permission'){
                props.push(field);
            }
            if(i === properties.length-1){
                console.log(data)
                props.push( {
                    "component":"Permission", 
                    "permissionType":"Admin",
                    "name":"permissions",
                    "value" :  data["mEmployeePermissions"] !== undefined &&  data["mEmployeePermissions"] !== null &&  data["mEmployeePermissions"] !== '' ? JSON.parse(data["mEmployeePermissions"]) : {} ,
                    "permissions":[
                        {
                            key:"Employee",
                            label:"Employee Management",
                            options:[
                                {
                                    "label":"Read",
                                    "Value" :"R"
                                },
                                {
                                    "label":"Write",
                                    "Value" :"W"
                                }
                            ]
                        },
                        {
                            key:"Customer",
                            label:"Customer Management", 
                            options:[
                                {
                                    "label":"Read",
                                    "Value" :"R"
                                },
                                {
                                    "label":"Write",
                                    "Value" :"W"
                                }
                            ]
                        },
                        {
                            key:"Inventory",
                            label:"Inventory Management", 
                            options:[
                                {
                                    "label":"Read",
                                    "Value" :"R"
                                },
                                {
                                    "label":"Write",
                                    "Value" :"W"
                                }
                            ]
                        },
                        {
                            key:"GiftCard",
                            label:"GiftCard Management", 
                            options:[
                                {
                                    "label":"Read",
                                    "Value" :"R"
                                },
                                {
                                    "label":"Write",
                                    "Value" :"W"
                                }
                            ]
                        }, 
                        {
                            key:"DefaultCommission",
                            label:"Default Commission Management", 
                            options:[
                                {
                                    "label":"Read",
                                    "Value" :"R"
                                },
                                {
                                    "label":"Write",
                                    "Value" :"W"
                                }
                            ]
                        }, 
                        {
                            key:"DefaultDiscount",
                            label:"Default Discount Management", 
                            options:[
                                {
                                    "label":"Read",
                                    "Value" :"R"
                                },
                                {
                                    "label":"Write",
                                    "Value" :"W"
                                }
                            ]
                        }, 
                        {
                            key:"Discount",
                            label:"Discount Management", 
                            options:[
                                {
                                    "label":"Read",
                                    "Value" :"R"
                                },
                                {
                                    "label":"Write",
                                    "Value" :"W"
                                }
                            ]
                        }, 
                        {
                            key:"Tax",
                            label:"Tax Management", 
                            options:[
                                {
                                    "label":"Read",
                                    "Value" :"R"
                                },
                                {
                                    "label":"Write",
                                    "Value" :"W"
                                }
                            ]
                        }, 
                        {
                            key:"EmpSettings",
                            label:"Employee Specific Settings", 
                            options:[
                                {
                                    "label":"Read",
                                    "Value" :"R"
                                },
                                {
                                    "label":"Write",
                                    "Value" :"W"
                                }
                            ]
                        },
                        {
                            key:"LoyaltyPoints",
                            label:"Loyalty Points", 
                            options:[
                                {
                                    "label":"Read",
                                    "Value" :"R"
                                },
                                {
                                    "label":"Write",
                                    "Value" :"W"
                                }
                            ]
                        },  
                        {
                            key:"Transactions",
                            label:"Transactions", 
                            options:[
                                {
                                    "label":"Read",
                                    "Value" :"R"
                                }
                            ]
                        }, 
                        {
                            key:"Payout",
                            label:"Payout Management", 
                            options:[
                                {
                                    "label":"Read",
                                    "Value" :"R"
                                }, 
                                {
                                    "label":"Pay",
                                    "Value" :"W"
                                }, 
                            ]
                        }, 
                        {
                            key:"Report",
                            label:"Reports", 
                            options:[
                                {
                                    "label":"Read",
                                    "Value" :"R"
                                }, 
                            ]
                        },  
                    ]
                }) 

                props.push({
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
                schema.properties = props; 
                this.setState({schema: schema,selectedEmployee: data},()=>{
                    this.setState({addForm: true})
                })
            }
        })
    }

    syncData(){
        var table = {
            name: "merchantEmployees",
            tablename: 'merchantEmployees',
            progressText: "Synchronizing Staff details...",
            progresscompletion: 10,
            url:  `/pos/syncData/employees`
        }
        this.httpManager.postRequest(table.url, {data:"TAX"}).then(res=>{ 
            this.httpManager.postRequest(`merchant/defaultcommission/get`,{data:"EMP GET"}).then(response=>{ 
                // this.openEdit(response.data); 
                if(response.data.length > 0){
                    this.setState({defaultcommission: response.data[0] }, ()=>{ 
                        this.getEmpslist()
                    });
                }
                else{
                    this.getEmpslist()
                }
            })
        }).catch(e=>{

        })
    }

    reloadData(msg=''){
        if(msg !== ''){ 
            toast.dismiss();
            toast.success(msg, {
                position: "top-center",
                autoClose: 5000,
                closeButton:false,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
        }
        this.setState({isLoading: true, addForm: false},()=>{
            this.syncData()
        })
    }

    getEmpslist(){
        this.httpManager.postRequest(`merchant/employee/get`,{data:"EMP LIST"}).then(response=>{
            // console.log(response)
            this.setState({employeelist: response.data, isLoading: false});
        })
    }

    handleCloseDialog(){
        this.setState({openDialog: false})
    }

    openAdd(){
        if(this.state.defaultcommission.id){
            this.setState({schema: schema,selectedEmployee: {}},()=>{
                var schemaobj = Object.assign({}, schema);

                var properties = Object.assign([], this.state.schema.properties);
                var props=[];
                properties.forEach((field,i)=>{
                    delete field["value"];
                    field.disabled =false;
                    props.push(field);
                    if(i === properties.length-1){
                        props.push( {
                            "component":"Permission", 
                            "permissionType":"Admin",
                            "permissions":[
                                {
                                    key:"Employee",
                                    label:"Employee Management",
                                    options:[
                                        {
                                            "label":"Read",
                                            "Value" :"R"
                                        },
                                        {
                                            "label":"Write",
                                            "Value" :"W"
                                        }
                                    ]
                                },
                                {
                                    key:"Customer",
                                    label:"Customer Management", 
                                    options:[
                                        {
                                            "label":"Read",
                                            "Value" :"R"
                                        },
                                        {
                                            "label":"Write",
                                            "Value" :"W"
                                        }
                                    ]
                                },
                                {
                                    key:"Inventory",
                                    label:"Inventory Management", 
                                    options:[
                                        {
                                            "label":"Read",
                                            "Value" :"R"
                                        },
                                        {
                                            "label":"Write",
                                            "Value" :"W"
                                        }
                                    ]
                                },
                                {
                                    key:"GiftCard",
                                    label:"GiftCard Management", 
                                    options:[
                                        {
                                            "label":"Read",
                                            "Value" :"R"
                                        },
                                        {
                                            "label":"Write",
                                            "Value" :"W"
                                        }
                                    ]
                                }, 
                                {
                                    key:"DefaultCommission",
                                    label:"Default Commission Management", 
                                    options:[
                                        {
                                            "label":"Read",
                                            "Value" :"R"
                                        },
                                        {
                                            "label":"Write",
                                            "Value" :"W"
                                        }
                                    ]
                                }, 
                                {
                                    key:"DefaultDiscount",
                                    label:"Default Discount Management", 
                                    options:[
                                        {
                                            "label":"Read",
                                            "Value" :"R"
                                        },
                                        {
                                            "label":"Write",
                                            "Value" :"W"
                                        }
                                    ]
                                }, 
                                {
                                    key:"Discount",
                                    label:"Discount Management", 
                                    options:[
                                        {
                                            "label":"Read",
                                            "Value" :"R"
                                        },
                                        {
                                            "label":"Write",
                                            "Value" :"W"
                                        }
                                    ]
                                }, 
                                {
                                    key:"Tax",
                                    label:"Tax Management", 
                                    options:[
                                        {
                                            "label":"Read",
                                            "Value" :"R"
                                        },
                                        {
                                            "label":"Write",
                                            "Value" :"W"
                                        }
                                    ]
                                }, 
                                {
                                    key:"EmpSettings",
                                    label:"Employee Specific Settings", 
                                    options:[
                                        {
                                            "label":"Read",
                                            "Value" :"R"
                                        },
                                        {
                                            "label":"Write",
                                            "Value" :"W"
                                        }
                                    ]
                                },
                                {
                                    key:"LoyaltyPoints",
                                    label:"Loyalty Points", 
                                    options:[
                                        {
                                            "label":"Read",
                                            "Value" :"R"
                                        },
                                        {
                                            "label":"Write",
                                            "Value" :"W"
                                        }
                                    ]
                                },  
                                {
                                    key:"Transactions",
                                    label:"Transactions", 
                                    options:[
                                        {
                                            "label":"Read",
                                            "Value" :"R"
                                        }
                                    ]
                                }, 
                                {
                                    key:"Payout",
                                    label:"Payout Management", 
                                    options:[
                                        {
                                            "label":"Read",
                                            "Value" :"R"
                                        }, 
                                    ]
                                }, 
                                {
                                    key:"Report",
                                    label:"Reports", 
                                    options:[
                                        {
                                            "label":"Read",
                                            "Value" :"R"
                                        }, 
                                    ]
                                },  
                            ]
                        })
                        schemaobj.properties = props;
                    }
                });
                this.setState({schema:schemaobj}, ()=>{
                    this.setState({addForm: true}) 
                })
            })
        }
        else{
            this.setState({openDialog: true})
        }
    }
    render(){
        return <Page title="Employees | Astro POS">
            {this.state.isLoading && <Loader show={this.state.isLoading} />}
            <AutoBatchComponent/>
            <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={false}
            />
            {!this.state.addForm ? 
                <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                    Employee Management
                    </Typography>
                    <Online>
                        {checkButtonAccess('Employee') === 'W' && <FButton 
                        onClick={()=>this.openAdd()}
                        size="large"
                        disabled={ !navigator.onLine }
                        variant="contained"
                        label="Add Employee"
                        startIcon={getIcon('mdi:plus')}
                        />}
                    </Online>
                    <Offline>
                        <FButton  
                        size="large"
                        disabled={ true }
                        variant="contained"
                        label="Add Employee"
                        startIcon={getIcon('mdi:plus')}
                        />
                    </Offline>
                </Stack>

                <Card>
                    <TableView
                    data={this.state.employeelist} 
                    columns={this.state.columns} />
                </Card>
                </Container> : ''
            }
            {this.state.addForm && <Box sx={{ width: '100%' }}> 
                <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
                     <Grid item xs={12}> 
                        <Stack spacing={3}> 
                            <FormManager disableOffline={true} formProps={this.state.schema}  reloadData={(msg)=>this.reloadData(msg)} closeForm={()=>this.handleCloseform()}/>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>}


            <Dialog
                    open={this.state.openDialog}
                    onClose={this.handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Error
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                       Please set default commission and create employees.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={()=>{
                            this.handleCloseDialog()
                        }}>  OK </Button> 
                    </DialogActions>
                </Dialog>

            </Page>  
    }


}