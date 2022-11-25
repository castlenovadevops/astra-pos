import React from 'react'; 
import { Button, Container, Typography } from '@mui/material';  
import LoadingModal from '../../../../components/Loader';
import TableContent from '../../../../components/table/tableView';
  
import HTTPManager from '../../../../utils/httpRequestManager';

export default class SelectTechnician extends React.Component {
    httpManager = new HTTPManager()
    constructor(props){

        super(props);
        this.state={
            searched: "",
            customers: [],
            allcustomers: [],
            isLoading: false,
            columns:[
                {
                    field: 'id',
                    headerName: 'Member ID',
                    // minWidth: 200,
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {params.row.mCustomerMemberId}
                    </div>
                    )
                },
                {
                    field: 'firstName',
                    headerName: 'Name',
                    // minWidth: 200,
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {params.row.mCustomerName}
                    </div>
                    )
                },
                
                {
                    field: 'email',
                    headerName: 'Email',
                    // minWidth: 200,
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {params.row.mCustomerEmail !== ''&&params.row.mCustomerEmail !== null ? params.row.mCustomerEmail : "--"}
                    </div>
                    )
                },
                {
                    field: 'mobile',
                    headerName: 'Mobile Number',
                    // minWidth: 200,
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {params.row.mCustomerMobile === null ? "NA": (params.row.mCustomerMobile === "null") ? 'NA': params.row.mCustomerMobile}
                        {/* {params.row.mobile !='' && params.row.mobile != null ? params.row.mobile : "--"} */}
                    </div>
                    )
                },  
                {
                    field: 'action',
                    headerName: ' ',
                    // minWidth: 200,
                    flex: 1,
                    editable: false,
                    renderCell: (params) => (
                    <div>
                        {this.props.customerDetail !== undefined && this.props.customerDetail.mCustomerId === params.row.mCustomerId ? <Button variant="contained" onClick={()=>{  this.props.onSelectCustomer(params.row, 'no')}}>Deselect</Button> :  <Button variant="contained"  onClick={()=>{console.log(params.row);  this.props.onSelectCustomer(params.row, '')}}>Select</Button>}
                    </div>
                    )
                },  
            ]
        } 
    }

   
    
    componentDidMount(){
        this.getCustomerList()
    }
   
    requestSearch(searchVal) { 
        const filteredRows = this.state.allcustomers.filter((row) => {
           
            var name = row.firstName+" "+row.lastName
            return name.toLowerCase().includes(searchVal.toLowerCase());
            
            
        });
        
       this.setState({tech: filteredRows})
       
    }

    cancelSearch() {
        this.setState({searched: ""})
        this.requestSearch("");
    }
    
    getCustomerList(){
        this.httpManager.postRequest('merchant/customers/getActiveCustomer', {type:"active"}).then(res=>{
            this.setState({customers:res.data, allcustomers: res.data, isLoading: false})
        });
    } 
      
    render(){
        return (
         
            <div style={{height: '100%'}}>
                {this.state.isLoading &&  <LoadingModal show={this.state.isLoading}></LoadingModal>}

                <Container maxWidth="xl" style={{width: "100%", height: '100%'}}> 
                
                {this.state.customers.length>0 &&
                    <div style={{marginTop:30, height: '85%'}}>
                        <TableContent style={{height: '100%'}}  pageSize={5} data={this.state.customers} columns={this.state.columns} />
                    </div>
                
                }
                {
                    this.state.customers.length===0 &&
                    <Typography variant="subtitle2" align="center" style={{cursor:'pointer', marginTop: 20}} >No Customers Found.</Typography> 
                } 
                </Container>
            </div>

          
        )
    }
} 