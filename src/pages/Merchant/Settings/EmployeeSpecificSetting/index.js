import React from "react"; 
import Page from '../../../../components/Page';
import HTTPManager from "../../../../utils/httpRequestManager"; 
import { toast, ToastContainer } from 'react-toastify'; 
import FormManager from "../../../../components/formComponents/FormManager";
import schema from './schema.json';
import {Card, Grid,   Container, Typography, Stack, TextField} from '@mui/material';  

const service = {
    borderBottom:'2px solid #f0f0f0',
    padding: 10,
    cursor:'pointer'
}
export default class EmployeeSetting extends React.Component{
    httpManager = new HTTPManager();

    constructor(){
        super();
        this.state={
            isLoading:false,
            schema:{},
            employeelist:[],
            addForm: false,
            selectedEmpSalary:{},
            columns:[],
            employeeId: '',
            defaultCommission:{}
        }
        this.getEmp = this.getEmp.bind(this);
        this.getEmpslist = this.getEmpslist.bind(this);
        this.changePercentage = this.changePercentage.bind(this);
    } 

    changePercentage(props, values){
        var schema = Object.assign({}, this.state.schema);
        var properties = Object.assign([], this.state.schema.properties);
        var schemaprops=[];
        properties.forEach((field,i)=>{
            if(props.name === 'mTipsCashPercentage' && field.name === 'mTipsCheckPercentage'){ 
                field.value = 100 - Number(props.value); 
            }
            else if(props.name === 'mTipsCheckPercentage' && field.name === 'mTipsCashPercentage'){ 
                field.value = 100 - Number(props.value);  
            }
            else if(props.name === 'mCashPercentage' && field.name === 'mCheckPercentage'){ 
                field.value = 100 - Number(props.value); 
            }
            else if(props.name === 'mCheckPercentage' && field.name === 'mCashPercentage'){ 
                field.value = 100 - Number(props.value);  
            }
            else if(props.name === 'mOwnerPercentage' && field.name === 'mEmployeePercentage'){ 
                field.value = 100 - Number(props.value); 
            }
            else if(props.name === 'mEmployeePercentage' && field.name === 'mOwnerPercentage'){ 
                field.value = 100 - Number(props.value);  
            }
            else{
                field.value = values[field.name]
            }
            schemaprops.push(field);
            if(i === properties.length-1){ 
                // console.log(schemaprops)
                schema.properties = schemaprops; 
                schema.force = true; 
                this.setState({schema: schema},()=>{
                    this.setState({addForm: true})
                })
            }
        });
    }

    getEmp(emp){
        this.setState({schema: {}, employeeId: emp.mEmployeeId, selectedEmpSalary: emp}, ()=>{
            var schemaobj = Object.assign({}, schema);
            var properties = Object.assign([], schema.properties);
            var props=[];
            var data = Object.assign({}, this.state.defaultCommission)
            if(emp.mEmployeeCommissions instanceof Array){
                if(emp.mEmployeeCommissions.length > 0){
                    data = Object.assign({},emp.mEmployeeCommissions[0]);
                }
            } 
            properties.forEach((field,i)=>{
                field.value = data[field.name] !== undefined ? data[field.name] : '';
                props.push(field);
                if(i === properties.length-1){
                    props.push({
                        "component":"TextField", 
                        "type": "hidden", 
                        "minLength": 1,
                        "maxLength": 50,
                        "grid":6,
                        "name":"mEmployeeId",
                        "label":"mEmployeeId",
                        "placeholder":"mEmployeeId",
                        "value":data.mEmployeeId
                    })
                    schemaobj.properties = props; 
                    schemaobj.force = true;
                    this.setState({schema: schemaobj},()=>{ 
                        // console.log("SCHEMA::::")
                        // console.log(this.state.schema)
                    })
                }
            })
        })
    }
    componentDidMount(){ 
        this.setState({schema: schema},()=>{
            this.reloadData();
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
            this.httpManager.postRequest(`merchant/defaultcommission/get`, {data:"DEFAULT COMMISSION"}).then(response=>{ 
                // this.openEdit(response.data); 
                if(response.data.length > 0){
                    this.setState({defaultCommission: response.data[0] }, ()=>{ 
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

        this.httpManager.postRequest(`merchant/employee/getAll`,{data:"GET ALL EMP"}).then(response=>{
            var data = [];
            if(response.data.length > 0){
                response.data.forEach((elmt, i)=>{ 
                    elmt.id = elmt.cnUserId;
                    data.push(elmt);
                    if(i === response.data.length-1){
                        this.setState({employeelist: data, isLoading: false},()=>{
                            this.setState({employeeId: data[0].mEmployeeId},()=>{
                                this.getEmp(data[0])
                            })
                        });
                    }
                })
            }
            else{
                this.setState({employeelist: data,employeeId:'', isLoading: false});
            }
        })
    }
    render(){
        return <Page title="Employee Specific Setting | Astro POS">
            {/* {this.state.isLoading && <Loader show={this.state.isLoading} />} */}
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
            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                    Employee Specific Setting
                    </Typography>
                    
                </Stack>
                <Card sx={{ width: '100%', background:'#fff' }}> 
                <Grid container spacing={3}  alignItems="baseline"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold', paddingTop:'10px', paddingBottom:'10px'}} > 
                     <Grid item xs={4} style={{paddingRight:'24px', height:'100%'}}> 
                        <div>
                        <Typography variant="h6" gutterBottom align="center" style={{background:'white', }}> 
                        <TextField
                            fullWidth
                            label="Search"
                            name="searched"
                            value={this.state.searched}
                            onChange={(e)=>this.requestSearch(e)}
                            /> 
                        </Typography>
                        </div>
                        {this.state.employeelist.length>0 &&
                            <div style={{height:'100%'}}>
                            
                                {this.state.employeelist.map((emp, index) => (
                                    <Grid item xs={12} style={{'background':(this.state.employeeId === emp.mEmployeeId ? '#134163':'transparent'),'color':(this.state.employeeId === emp.mEmployeeId  ? '#fff':'#000')}} >
                                        <div style={service} onClick={() => this.getEmp(emp)}>
                                            <Typography id="modal-modal-title" variant="subtitle1" align="left">{emp.mEmployeeFirstName} {emp.mEmployeeLastName} ({emp.mEmployeeRoleName})</Typography>
                                        </div>
                                    </Grid>
                                ))}
                            
                            </div>
                        }
                        { this.state.employeelist.length ===0 && <Typography variant="subtitle1" align="center" style={{cursor:'pointer', marginTop: 20}} >No Records Found!</Typography> }
                     </Grid>
                     <Grid item xs={8} style={{borderLeft:'1px solid #f0f0f0'}}> 
                        <Stack spacing={3}>  
                           {this.state.schema.onSubmit && <FormManager disableOffline={true} formProps={this.state.schema} formFunctions={{
                                changePercentage:this.changePercentage
                            }} reloadData={()=>{
                                this.reloadData() }}/> }
                        </Stack>
                    </Grid>
                </Grid>
                </Card>
            </Container>
        </Page>
    }

}