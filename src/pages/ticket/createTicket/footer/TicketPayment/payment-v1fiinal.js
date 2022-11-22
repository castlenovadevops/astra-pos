import React from 'react';
import Moment from 'moment';
import { Grid, Typography, Button,Box, FormControl,FormLabel,FormControlLabel,Radio,RadioGroup} from '@material-ui/core/'; 
import CloseIcon from '@mui/icons-material/Close'; 
import LoadingModal from '../../../../components/Modal/loadingmodal';
import TextareaAutosizeContent from '../../../../components/formComponents/TextAreaAutosize';
import DataManager from '../../../../controller/datacontroller';
// import TicketManager from '../../../../controller/TicketManager';
import TicketController from '../../../../controller/TicketController';
import AlertModal from '../../../../components/Modal/alertModal';

const paymentStyle = {
    position: 'absolute',
    top: '50%',
    // left: '50%',
    // transform: 'translate(-50%, -50%)',
    width: '100%',
    bgcolor: 'background.paper',
    border: '0',
    boxShadow: 24,
    p: 4,
};

class TicketPayment extends React.Component  {
    ticketcontroller = new TicketController();
    constructor(props) {
        super(props);
        this.state={
            ticketDetail : {},
            isCard_type_show:false,
            card_type:'debit',
            description:'',
            employeedetail:{},
            payment_type:'cash',
            isLoading: false,
            services_taken:[],
            dataManager: new DataManager(),
            businessdetail:{},
            ticketSelected: {},
            printalert:false,
            employee_list:[]
        }
        this.checkPaymentType = this.checkPaymentType.bind(this)
        this.handlechangeDesc = this.handlechangeDesc.bind(this)
        this.savePayment = this.savePayment.bind(this)
    }
    componentDidMount(){
        console.log("asdasdasdasd", this.state.printalert)
        var  detail = window.localStorage.getItem('businessdetail');
        if(detail !== undefined && detail !== 'undefined'){
            var businessdetail = JSON.parse(detail);
            this.getEmployeeList();
            this.setState({isLoading:true,businessdetail:businessdetail}, function(){ 
                if(this.props.ticketDetail !== undefined){
                    this.setState({ticketDetail : this.props.ticketDetail, ticketSelected: this.props.ticketSelected, isLoading:false}, function(){
                        // this.getServiceDetails();
                    })
                }
                var employeedetail = window.localStorage.getItem('employeedetail');
                if(employeedetail !== undefined){
                    this.setState({employeedetail:JSON.parse(employeedetail)})
                }
            });
        }
    }

    getServiceDetails(){
        var ticket_id = this.state.ticketDetail.sync_id; 
        this.setState({isLoading: true})
        const sql = `select ts.*,(select id from ticketservice_requestnotes as rn where rn.ticketref_id=ts.ticketref_id and rn.serviceref_id=ts.sync_id and rn.isActive=1  )
        as notesid,  (select notes from ticketservice_requestnotes as rn where rn.ticketref_id=ts.ticketref_id and rn.serviceref_id=ts.sync_id and rn.isActive=1 ) as requestNotes,s.*,ts.sync_id as uniquId,ts.syncedid as syncedid,  d.name as discount_name from ticket_services as ts INNER JOIN services as s ON ts.service_id = s.sync_id  left join discounts as d on d.id = ts.discount_id where ts.ticketref_id =  '`+ticket_id+`'  and ts.isActive=1 ORDER BY sort_number`   
         this.state.dataManager.getData(sql).then(response =>{ 
            if (response instanceof Array) { 
                this.setState({ticketSelectedServices: response})
                // for (var i=0;i < response.length; i++){ 
                    console.log(sql)
                    console.log("sadasdasdadas addservice", response)
                    this.addServices(response, 0)  
                //     if(i === response.length-1){
                //         console.log("sadasdasdadas addservice")
                //         this.setState({isLoading:false})
                //     }
                // }
            }
        })  
        this.setState({isLoading: false})
    } 
    
    
    addServices = (serviceslist, i) => new Promise((resolve, reject) => {  
        if(i < serviceslist.length){
        var servicein = serviceslist[i];  
        console.log("SERVICEIN:::::", servicein)      
        ////console.log(servicein.service_cost, servicein.service_quantity)
        var obj = {
            "servicedetail": servicein,
            discount:{},
            taxes:[],
            subtotal: servicein.service_cost !== undefined ? servicein.service_cost : servicein.price,
            taxamount:0,
            discountamount:servicein.total_discount_amount !== undefined ?  servicein.total_discount_amount :0,
            qty: servicein.service_quantity != undefined ?  servicein.service_quantity : 1,
            perunit_cost:servicein.perunit_cost != undefined ? servicein.perunit_cost : servicein.price,
            employee_id:  (servicein.employee_id !== null && servicein.employee_id !== undefined ? Number(servicein.employee_id) : Number(this.state.technician_id))  ,
            isSpecialRequest: servicein.isSpecialRequest !== undefined ? servicein.isSpecialRequest: 0,
            process:servicein.process !== undefined ? servicein.process : '',
            requestNotes: servicein.requestNotes !== undefined ? servicein.requestNotes : '',
            tips_amount: servicein.tips_amount !== undefined ? servicein.tips_amount : 0,
            sort_number: this.state.services_taken.length+1
        }
        ////console.log(obj);
        console.log("SERVICEIN:::::", servicein)
        var sql = "SELECT st.*,t.tax_name,t.tax_type,t.tax_value from services_tax as st join taxes as t on t.sync_id=st.tax_id and t.status='active' where service_id='"+servicein.service_id+"' and st.status='active'";
 
            obj["discount"].discount_id = servicein.discount_id
            obj["discount"].discount_type = servicein.discount_type
            obj["discount"].discount_value = servicein.discount_value
            obj["discount"].discount_name = servicein.discount_name
            obj["discount"].total_discount_amount = servicein.total_discount_amount
            console.log("$$$$$$$$$$$$$$$$$$")
            console.log(servicein.uniquId, servicein.tax_type) 
                sql = "SELECT st.*,t.tax_name,t.tax_type,t.tax_value from ticketservice_taxes as st join taxes as t on t.sync_id==st.tax_id and t.status='active' where st.serviceref_id='"+servicein.uniquId+"' and st.ticketref_id='"+servicein.ticketref_id+"' and st.isActive=1" 
        console.log("TAX SQL::::::")
        console.log(sql);
        this.state.dataManager.getData(sql).then(response =>{  
            console.log("tax response :::::: ", response)
            obj.taxes = response.length > 0 ?  response : []; 
            var services = this.state.services_taken;
            services.push(obj);
            this.setState({services_taken: services}, ()=>{ 
                this.addServices(serviceslist, i+1) 
            })
        });
    }
    else{
        console.log("SERVICEOUT:::::", this.state.services_taken) 
        this.printTicket();
    }
    }) 


    // printTicket() {
    //     var print_data = this.processPrintDetails()
    //     //console.log("service_data", service_data)
    //         var printerName = window.localStorage.getItem('defaultprinter')
    //         if(printerName != undefined && printerName != ''){
    //             this.setState({print_data: print_data}, function() {
    //                 // this.setState({printpopup: true}) 
    //                 var total=Number(this.state.ticketDetail.grand_total).toFixed(2)
    //                 var ticketid = this.state.ticketDetail.ticket_code;
    //                 console.log(printerName);
    //                 var data = [];
    //                 data.push({
    //                     type: "text", 
    //                     value: this.state.businessdetail.name,//"TOP PAYMENT SOLUTIONS - Main",
    //                     style: `text-align:center;`,
    //                     css: {  "font-weight": "700", "font-size": "16px" },
    //                     }); 
                    
    //                 data.push({
    //                     type: "text", 
    //                     value: this.state.businessdetail.address1+"<br/>"+ this.state.businessdetail.address2+"<br/>"+this.state.businessdetail.city+"<br/>" +this.state.businessdetail.state+ this.state.businessdetail.zipcode+"<br/>"+ this.state.businessdetail.businessphone, //"3675 CRESTWOOD PKWY STE <br> DULUTH, GA  300965045 <br> 7706804075",
    //                     style: `text-align:center;`,
    //                     css: { "font-size": "12px","margin-top": 2 },
    //                     }); 
    //                 data.push({
    //                     type: "text", 
    //                     value: "",//"http://toppaymentsolutions.com",
    //                     style: `text-align:center;`,
    //                     css: { "font-size": "10px","margin-top": 2 },
    //                     }); 
    

    //                 data.push({
    //                     type: "text", 
    //                     value: "ORDER: "+JSON.parse(window.localStorage.getItem('businessdetail')).name+" - Ticket "+ ticketid,
    //                     style: `text-align:center;`,
    //                     css: { "font-weight": "700", "font-size": "18px","margin-top": 10 },
    //                     }); 
    //                 data.push({
    //                     type: "text", 
    //                     value: "Cashier: "+JSON.parse(window.localStorage.getItem('employeedetail')).firstName,
    //                     style: `text-align:left;`,
    //                     css: {  "font-size": "12px","margin-top": 5 },
    //                     });
    //                 data.push({
    //                     type: "text", 
    //                     value:  Moment(new Date()).format('MM-DD-YYYY hh:mm A'),
    //                     style: `text-align:left;`,
    //                     css: {  "font-size": "12px","margin-top": 5 },
    //                     });
                    
    //                 data.push({
    //                     type: 'table',
    //                     // style: 'border: 0px solid #ddd',
    //                     css: {"margin-left": 10,"margin-top": 10,"margin-bottom": 10},
                    
    //                     tableBody: print_data.map((ser,index)=>{
                        
    //                         return [
    //                             {
    //                                 type: "text", 
    //                                 value: ser["quantity"]+"&nbsp;&nbsp;&nbsp;&nbsp;"+ser["name"]+"<br>"+
    //                                 ((ser["tax"] === "") ? "":ser["tax"]) +"\n<br>"+
    //                                 ((ser["discount"] === "") ? "":ser["discount"]),
    //                                 style: `text-align:left;`,
    //                                 css: {  "font-size": "12px" },
    //                             },
    //                             {
    //                                 type: "text", 
    //                                 value: "$"+ser["price"],
    //                                 style: `text-align:left;`,
    //                                 css: {  "font-weight": "500","font-size": "14px" },
    //                             },
    //                             {
    //                                 type: "text", 
    //                                 value:  "$"+ser["total"],
    //                                 style: `text-align:left;`,
    //                                 css: {  "font-weight": "500","font-size": "14px" },
    //                             },
    //                         ]

    //                     }),
                    
    //                     tableBodyStyle: 'border: 0.0px solid #ddd',
    //                     tableSeperatorStyle: 'border: 0.0px solid #ddd'
                    
    //                 })
    //                 data.push({
    //                     type: "text", 
    //                     value:  "<div style='display: flex; justify-content: space-between;'><p >Total</p> <p>$"+total+"</p> </div>",
    //                     style: `text-align:left;`,
    //                     css: { "font-weight": "700", "font-size": "14px","margin-top": -10 },
    //                 }); 
    //                     data.push({
    //                         type: "text", 
    //                         value: "<div style='display: flex; justify-content: space-between;'><p >CASH SALE</p> <p>$"+total+"</p> </div>",
    //                         style: `text-align:left;`,
    //                         css: {  "font-size": "14px","margin-top": -25 },
    //                     });

    //                     data.push({
    //                         type: "text", 
    //                         value:  "<div style='display: flex; justify-content: space-between;'><p >Cash tendered</p> <p>$"+total+"</p> </div>",
    //                         style: `text-align:left;`,
    //                         css: { "font-size": "14px","margin-top": -25 },
    //                     }); 

    //                 data.push({
    //                     type: "text", 
    //                     value:  "Enjoy!",
    //                     style: `text-align:left;`,
    //                     css: { "font-size": "14px","margin-top": 0 },
    //                 });

    //                 window.api.printdata({printername: printerName, data: data}).then(res=>{ 
    //                     console.log(res);

    //                     this.props.afterSubmit("Paid Successfully!")
    //                 })


    //             })
    //         }
    //         else{
    //         alert("No printer selected");

    //         this.props.afterSubmit("Paid Successfully!")
    //         }


    // }

    // processPrintDetails() { 
    //     var service_data = []
        
    //     this.state.services_taken.forEach(( ser,index) => {
    //         var tax_detail = ""
    //         var discount_detail = ""
    //         var tax_data = []
    //         var discount_data=[]
    //         console.log(ser.taxes);
    //         ser.taxes.forEach( (tax) => {
    //             tax_data.push({ 
    //                 "tax_name": tax.tax_name+"("+(tax.tax_type === 'percentage' ? '%' : '$')+tax.tax_value+")",
    //                 "tax_percentage": tax.tax_calculated
    //             })
    //         })

    //         tax_data.forEach((tax) => {
    //             tax_detail = (tax_detail.length>0 ? tax_detail+"<br>" : tax_detail)+tax["tax_name"]+" - $"+tax["tax_percentage"]
    //         })

            

    //         if( ser.discount.discount_id !== undefined && ser.discount.discount_id !== 0 ) {
    //             discount_data.push({ 
    //                 "discount_name": ser.discount.discount_name+"("+(ser.discount.discount_type === 'percentage'? ser.discount.discount_value+'%' : '$'+ser.discount.discount_value)+")",
    //                 "discount_price":ser.discount.discount_price ,
    //                 "price_with_discount":ser.discount.price_with_discount
    //             })
    //         }

    //         discount_data.forEach   ((tax) => {
    //             discount_detail = (discount_detail.length>0 ? discount_detail+"<br>" : discount_detail)+tax["discount_name"]+" - $"+tax["discount_price"]+""
    //         }) 
    //         service_data.push({
    //             "name" : ser.servicedetail.name,
    //             "price":  ser.perunit_cost,
    //             "total": ser.subtotal,
    //             "tax": tax_detail,
    //             "discount":discount_detail,
    //             "quantity": ser.qty
    //         })
        

    //     })

    // return service_data

        
    // }
 


printTicket() {
    console.log("printTicket",window.localStorage.getItem('defaultprinter'))
    
    var responsedata = this.processPrintDetails()
    var print_data = responsedata.data;
    var tipstotal = responsedata.tipstotal;
    //////console.log("service_data", service_data)
        var printerName = window.localStorage.getItem('defaultprinter')
        if(printerName !== null && printerName !== undefined && printerName !== ''){
            this.setState({print_data: print_data}, function() {
                // this.setState({printpopup: true})
                var subTotal=Number(this.state.totalamount).toFixed(2)
                var discount=Number(this.state.total_discount).toFixed(2)
                var tax=Number(this.state.totaltax).toFixed(2) 
                var total=Number(this.state.ticketDetail.grand_total).toFixed(2)
                var ticketid = this.state.ticketDetail.ticket_code;
                ////console.log(printerName);
                var data = [];
                data.push({
                    type: "text", 
                    value: this.state.businessdetail.name,//"TOP PAYMENT SOLUTIONS - Main",
                    style: `text-align:center;`,
                    css: {  "font-weight": "700", "font-size": "16px" },
                    }); 
                
                data.push({
                    type: "text", 
                    value: this.state.businessdetail.address1+"<br/>"+ this.state.businessdetail.address2+"<br/>"+this.state.businessdetail.city+"<br/>" +this.state.businessdetail.state+ this.state.businessdetail.zipcode+"<br/>"+ this.state.businessdetail.businessphone, //"3675 CRESTWOOD PKWY STE <br> DULUTH, GA  300965045 <br> 7706804075",
                    style: `text-align:center;`,
                    css: { "font-size": "12px","margin-top": 2 },
                    }); 
                data.push({
                    type: "text", 
                    value: "",//"http://toppaymentsolutions.com",
                    style: `text-align:center;`,
                    css: { "font-size": "10px","margin-top": 2 },
                    }); 


                data.push({
                    type: "text", 
                    value: "ORDER: "+JSON.parse(window.localStorage.getItem('businessdetail')).name+" - Ticket "+ ticketid,
                    style: `text-align:center;`,
                    css: { "font-weight": "700", "font-size": "18px","margin-top": 10 },
                    }); 
                data.push({
                    type: "text", 
                    value: "Cashier: "+JSON.parse(window.localStorage.getItem('employeedetail')).firstName,
                    style: `text-align:left;`,
                    css: {  "font-size": "12px","margin-top": 5 },
                    });
                data.push({
                    type: "text", 
                    value:  Moment(new Date()).format('MM-DD-YYYY hh:mm A'),
                    style: `text-align:left;`,
                    css: {  "font-size": "12px","margin-top": 5 },
                    });
                
                data.push({
                    type: 'table',
                    // style: 'border: 0px solid #ddd',
                    css: {"margin-left": 10,"margin-top": 10,"margin-bottom": 10},
                
                    tableBody: print_data.map((ser,index)=>{
                    
                        return [
                            {
                                type: "text", 
                                value: ser["quantity"]+"&nbsp;&nbsp;&nbsp;&nbsp;"+ser["name"]+"<br>"+
                                ((ser["tax"] === "") ? "":ser["tax"]) +"\n<br>"+
                                ((ser["discount"] === "") ? "":ser["discount"]),
                                style: `text-align:left;`,
                                css: {  "font-size": "12px" },
                            },
                            {
                                type: "text", 
                                value: "$"+ser["price"],
                                style: `text-align:left;`,
                                css: {  "font-weight": "500","font-size": "14px" },
                            },
                            {
                                type: "text", 
                                value:  "$"+ser["total"],
                                style: `text-align:left;`,
                                css: {  "font-weight": "500","font-size": "14px" },
                            },
                        ]

                    }),
                
                    tableBodyStyle: 'border: 0.0px solid #ddd',
                    tableSeperatorStyle: 'border: 0.0px solid #ddd'
                
                })

                data.push({
                    type: "text", 
                    value:  "<div style='display: flex; justify-content: space-between;'><p >Discount</p> <p>$"+(this.state.ticketSelected.discount_totalamt !== null && this.state.ticketSelected.discount_totalamt !== undefined ? Number(this.state.ticketSelected.discount_totalamt).toFixed(2) : '$0.00')+"</p> </div>",
                    style: `text-align:left;`,
                    css: { "font-weight": "700", "font-size": "14px","margin-top": -10 },
                })

                data.push({
                    type: "text", 
                    value:  "<div style='display: flex; justify-content: space-between;'><p >Tips</p> <p>$"+Number(tipstotal).toFixed(2)+"</p> </div>",
                    style: `text-align:left;`,
                    css: { "font-weight": "700", "font-size": "14px","margin-top": -25 },
                });  
                data.push({
                    type: "text", 
                    value:  "<div style='display: flex; justify-content: space-between;'><p >Total</p> <p>$"+total+"</p> </div>",
                    style: `text-align:left;`,
                    css: { "font-weight": "700", "font-size": "14px","margin-top": -25 },
                });
                if(this.state.ticketSelected.paid_status === 'paid'){
                    data.push({
                        type: "text", 
                        value: "<div style='display: flex; justify-content: space-between;'><p >CASH SALE</p> <p>$"+total+"</p> </div>",
                        style: `text-align:left;`,
                        css: {  "font-size": "14px","margin-top": -25 },
                    });

                    data.push({
                        type: "text", 
                        value:  "<div style='display: flex; justify-content: space-between;'><p >Cash tendered</p> <p>$"+total+"</p> </div>",
                        style: `text-align:left;`,
                        css: { "font-size": "14px","margin-top": -25 },
                    });

                }

                data.push({
                    type: "text", 
                    value:  "Enjoy!",
                    style: `text-align:left;`,
                    css: { "font-size": "14px","margin-top": 0 },
                });

                window.api.printdata({printername: printerName, data: data}).then(res=>{ 
                    ////console.log(res);
                    if(!this.state.isPaidOnOpen){
                        this.printEmployeeReceipt()
                    }
                    else{ 
                        this.props.afterSubmit("Paid Successfully!")
                    }
                })


            })
        }
        else{
            this.setState({printalert:true})
        }


}

printEmployeeReceipt(){
    var emps = []
    var thisobj = this;
    this.state.services_taken.forEach((e, i)=>{
        if(emps.indexOf(e.employee_id) === -1){
            emps.push(e.employee_id)
        }
        if(i=== thisobj.state.services_taken.length-1){
            console.log("PRINT EMP RECEIPT")
            var printerName = window.localStorage.getItem('defaultprinter')
            if(printerName !== null && printerName != undefined && printerName != ''){
                thisobj.printEmployeeReceiptIndividual(0, emps, printerName);
            }
            else{
                thisobj.setState({printtalert:true})
            }

        }
    });
}

printEmployeeReceiptIndividual(idx, emps, printerName){
    if(idx < emps.length){
            var emp = emps[idx];
            var response = this.processEmployeePrintDetails(emp);
            var print_data = response.data;
            var total = response.total;
            var tipstotal = response.tipstotal;
            var data = [];
                data.push({
                    type: "text", 
                    value: this.state.businessdetail.name+"<br/>Employee Receipt",//"TOP PAYMENT SOLUTIONS - Main",
                    style: `text-align:center;`,
                    css: {  "font-weight": "700", "font-size": "16px" },
                    }); 
                
                data.push({
                    type: "text", 
                    value: this.state.businessdetail.address1+"<br/>"+ this.state.businessdetail.address2+"<br/>"+this.state.businessdetail.city+"<br/>" +this.state.businessdetail.state+ this.state.businessdetail.zipcode+"<br/>"+ this.state.businessdetail.businessphone, //"3675 CRESTWOOD PKWY STE <br> DULUTH, GA  300965045 <br> 7706804075",
                    style: `text-align:center;`,
                    css: { "font-size": "12px","margin-top": 2 },
                    }); 
                data.push({
                    type: "text", 
                    value: "",//"http://toppaymentsolutions.com",
                    style: `text-align:center;`,
                    css: { "font-size": "10px","margin-top": 2 },
                    });  

                data.push({
                    type: "text", 
                    value: "<div style='display: flex; justify-content: space-between;'><p >Employee: "+this.getEmployeeName(emp)+"</p><p>Ticket:"+this.state.ticketDetail.ticket_code+"</p>",
                    style: `text-align:left;`,
                    css: {  "font-size": "12px","margin-top": 5 },
                    }); 
                
                data.push({
                    type: 'table',
                    // style: 'border: 0px solid #ddd',
                    css: {"margin-left": 10,"margin-top": 10,"margin-bottom": 10},
                
                    tableBody: print_data.map((ser,index)=>{
                    
                        return [
                            {
                                type: "text", 
                                value: ser["quantity"]+"&nbsp;&nbsp;&nbsp;&nbsp;"+ser["name"] ,
                                style: `text-align:left;`,
                                css: {  "font-size": "12px" },
                            },
                            {
                                type: "text", 
                                value: "$"+ser["price"],
                                style: `text-align:left;`,
                                css: {  "font-weight": "500","font-size": "14px" },
                            },
                            {
                                type: "text", 
                                value:  "$"+ser["total"],
                                style: `text-align:left;`,
                                css: {  "font-weight": "500","font-size": "14px" },
                            },
                        ]

                    }),
                
                    tableBodyStyle: 'border: 0.0px solid #ddd',
                    tableSeperatorStyle: 'border: 0.0px solid #ddd'
                
                }) 
                
                data.push({
                    type: "text", 
                    value:  "<div style='display: flex; justify-content: space-between;'><p >Total</p> <p>$"+total+"</p> </div>",
                    style: `text-align:left;`,
                    css: { "font-weight": "700", "font-size": "14px","margin-top": -10 },
                });  

                data.push({
                    type: "text", 
                    value:  "<div style='display: flex; justify-content: space-between;'><p >Tips</p> <p>$"+Number(tipstotal).toFixed(2)+"</p> </div>",
                    style: `text-align:left;`,
                    css: { "font-weight": "700", "font-size": "14px","margin-top": -25 },
                });  

                data.push({
                    type: "text", 
                    value:  this.state.businessdetail.name+" - Printed: "+Moment(new Date()).format('MM-DD-YYYY hh:mm A'),
                    style: `text-align:center;border-bottom:1px dotted #000;margin-top:40px;padding-top:30px;padding-bottom:20px;`,
                    css: {  "font-size": "14px","margin-top":10, "border-bottom":"1px dotted #000"},
                });

                window.api.printdata({printername: printerName, data: data}).then(res=>{ 
                    console.log(res);
                    this.printEmployeeReceiptIndividual(idx+1, emps, printerName)
                })
    }
    else{
        this.props.afterSubmit("Paid Successfully!")
        console.log("ARRAY COMPLETED")
    }
}



processEmployeePrintDetails(empid) {

    var service_data = []
    var total = 0;
    var tipstotal = 0;
    this.state.services_taken.forEach(( ser,index) => {
        if(ser.employee_id === empid){
            total +=  Number(ser.subtotal);
            tipstotal += ser.tips_amount !== undefined ? Number(ser.tips_amount) : 0;
            service_data.push({
                "name" : ser.servicedetail.name,
                "price":  ser.perunit_cost,
                "total": ser.subtotal, 
                "quantity": ser.qty
            })
        } 
    })

   return {data: service_data, total:total, tipstotal: tipstotal}

    
}

processPrintDetails() {

    var service_data = []
    var tipstotal = 0;
    this.state.services_taken.forEach(( ser,index) => {
        var tax_detail = ""
        var discount_detail = ""
        var tax_data = []
        var discount_data=[]
        tipstotal += ser.tips_amount;
        ser.taxes.forEach( (tax) => {
            tax_data.push({ 
                "tax_name": tax.tax_name+"("+(tax.tax_type === 'percentage' ? '%' : '$')+tax.tax_value+")",
                "tax_percentage": tax.tax_calculated
            })
        })

        tax_data.forEach((tax) => {
            tax_detail = (tax_detail.length>0 ? tax_detail+"<br>" : tax_detail)+tax["tax_name"]+" - $"+tax["tax_percentage"]
        })

        

        if( ser.discount.discount_id !== undefined && ser.discount.discount_id !== 0 ) {
            discount_data.push({ 
                "discount_name": ser.discount.discount_name+"("+(ser.discount.discount_type === 'percentage'? ser.discount.discount_value+'%' : '$'+ser.discount.discount_value)+")",
                "discount_price":ser.discount.total_discount_amount ,
                "price_with_discount":ser.discount.price_with_discount
            })
        }

        discount_data.forEach   ((tax) => {
            discount_detail = (discount_detail.length>0 ? discount_detail+"<br>" : discount_detail)+tax["discount_name"]+" - $"+tax["discount_price"]+""
        }) 
        service_data.push({
            "name" : ser.servicedetail.name,
            "price":  ser.perunit_cost,
            "total": ser.subtotal,
            "tax": tax_detail,
            "discount":discount_detail,
            "quantity": ser.qty
        })
       

    })
    console.log(service_data, this.state.services_taken);
   return {data:service_data, tipstotal:tipstotal}

    
}

    handleClosePayment(){
        this.props.afterSubmit('');
    }
    handlechangeDesc(e){
        this.setState({description: e.target.value})
    }
    checkPaymentType(type){
        if(type === 'cash'){
            this.setState({isCard_type_show:false,payment_type: type})
        }else{
            this.setState({isCard_type_show:true,payment_type: type})
        }
    }
    handleradio(e){
        this.setState({card_type: e.target.value})
    }
    getEmployeeList(){
     
        this.state.dataManager.getData(`select u.firstName, u.lastName, u.staff_role, u.id as id, u.clocked_status as ostatus, b.clockin_out as clocked_status from users as u left join staff_clockLog as b on u.id = b.staff_id and b.isActive=1`).then(response =>{ 
            ////console.log("usrslist ")
            ////console.log(response);
            var options = response.map(r=>{
                r.clocked_status = (r.clocked_status !== undefined && r.clocked_status !== null ) ? r.clocked_status : r.ostatus;
                return r;
            });
            ////console.log("oppopop")
            ////console.log(options);
            options = this.getUnique(options,'id')
            this.setState({employee_list: options}, function() { 
            });
            
        })
    }
    getUnique(arr, index) {

        const unique = arr
             .map(e => e[index])
      
             // store the keys of the unique objects
             .map((e, i, final) => final.indexOf(e) === i && i)
      
             // eliminate the dead keys & store unique objects
            .filter(e => arr[e]).map(e => arr[e]);      
      
         return unique;
      }

getEmployeeName(id){
    // ////////console.log"getEmployeeName---", this.state.employee_list)
    var empname = '';
    for(var i=0;i<this.state.employee_list.length;i++){


        var obj = this.state.employee_list[i];
        if(obj["id"] === id){
            empname = obj['firstName']+" "+obj['lastName'];
            // ////////console.log"equals")
        }
        // ////////console.log"getEmployeeName---", empname)
    }
    return empname;
}

    savePayment(ticketDetail,mode, isprint=false){
        console.log("ttt",ticketDetail);
        this.setState({isLoading: true, ticketSelected:ticketDetail}, ()=>{
            if(isprint){

                var printerName = window.localStorage.getItem('defaultprinter')
                if(printerName !== null && printerName !== undefined && printerName !== ''){
                    this.savePaymentDetail(ticketDetail, mode, isprint);
                }
                else{
                    this.setState({printalert:true,isLoading:false})
                }
            }
            else{

                this.savePaymentDetail(ticketDetail, mode, isprint);
            }
        });
    }
    savePaymentDetail(ticketDetail,mode, isprint){
        var thisobj = this;
        // thisobj.getServiceDetails();
            window.api.getSyncUniqueId().then(psync=>{
                var syncid = psync.syncid;
                var payment_input = {
                    ticket_id : ticketDetail.id ||  ticketDetail.sync_id,
                    pay_mode : mode,
                    payment_status : 'Sucess',
                    paid_at : Moment().format('YYYY-MM-DDTHH:mm:ss'),
                    notes :  this.state.description,
                    card_type : this.state.card_type,
                    ticket_amt: ticketDetail.grand_total,
                    created_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                    created_by: this.state.employeedetail.id,
                    updated_at: Moment().format('YYYY-MM-DDTHH:mm:ss'),
                    updated_by: this.state.employeedetail.id,
                    sync_id: syncid,
                    sync_status:0,
                    ticketref_id: ticketDetail.ticketref_id,
                    isActive:1
                }  
    
                this.ticketcontroller.saveData({table_name:'ticket_payment', data:payment_input}).then((resp)=> {
                    console.log("saved to ticket payemt", resp)
                    var paidinput = {
                        paid_status: 'paid',
                        sync_status:0,
                        sync_id:ticketDetail.ticketref_id,
                        updated_at:Moment().format('YYYY-MM-DDTHH:mm:ss'),
                        updated_by:this.state.employeedetail.id
                    }
                    this.ticketcontroller.updateData({table_name:'ticket',data: paidinput, query_field:'sync_id', query_value:ticketDetail.ticketref_id}).then(res=>{
                            
                            if(isprint){
                                // this.printTicket();
                                console.log("RINT TICKET ISPRINT")
                                thisobj.getServiceDetails();
                            }
                            else{
                                this.setState({isLoading: false})
                                thisobj.props.afterSubmit("Paid Successfully!")
                            }
                    }) 

                })

            })  
    }
    render() {
        return (
            
                
                <Box sx={paymentStyle} style={{borderRadius: 10}}>
                    {this.state.isLoading &&  <LoadingModal show={this.state.isLoading}></LoadingModal>}
                    
                    <Grid container spacing={2} >
                        <Grid item xs={12} style={{display:'flex'}}>
                            <Grid item xs={4}>
                                <Typography id="modal-modal-title" variant="subtitle2" align="left" style={{"color":'#134163'}}>
                                    Ticket Code : {this.state.ticketDetail.ticket_code}
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography id="modal-modal-title" variant="subtitle2" align="left" style={{"color":'#134163'}}>
                                    Pay Full Amount ${this.state.ticketDetail.grand_total}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="subtitle2" align="right" style={{cursor:'pointer'}} onClick={() => this.handleClosePayment()}> <CloseIcon fontSize="small" style={{"color":'#134163'}}/></Typography>
                            </Grid>      
                        </Grid>
                        <Grid item xs={12} style={{display:'flex'}}>
                            <Grid item xs={4}>
                                <Grid item xs={12} style={{padding: 10, border:'1px solid #f0f0f0',height:'350px'}}>
                                    <Typography style={{margin: 10}} id="modal-modal-title" variant="subtitle2" align="left"> Pay For This Order</Typography>

                                    <Typography style={{margin: 10}} id="modal-modal-title" variant="subtitle2" align="left"> Order Subtotal : ${Number(this.state.ticketDetail.subtotal).toFixed(2)}</Typography>
                                    <Typography style={{margin: 10}} id="modal-modal-title" variant="subtitle2" align="left"> Tips : ${Number(this.state.ticketDetail.tips_totalamt).toFixed(2)}</Typography>
                                    <Typography style={{margin: 10}} id="modal-modal-title" variant="subtitle2" align="left"> Discount : ${Number(this.state.ticketDetail.discount_totalamt).toFixed(2)}</Typography>
                                    <Typography style={{margin: 10}} id="modal-modal-title" variant="subtitle2" align="left"> Tax :  ${Number(this.state.ticketDetail.total_tax).toFixed(2)} </Typography>
                                    <Typography style={{margin: 10}} id="modal-modal-title" variant="subtitle2" align="left"> Total : ${Number(this.state.ticketDetail.grand_total).toFixed(2)}</Typography>
                                    {/* <Typography style={{margin: 10}} id="modal-modal-title" variant="subtitle2" align="left"> Amount Remaining</Typography> */}
                                    {/* <Typography style={{margin: 10}} id="modal-modal-title" variant="subtitle2" align="left"> Payment 1</Typography> */}

                                </Grid>
                            </Grid>
                            <Grid item xs={8}> 
                                <Grid item xs={12} style={{padding: 0,paddingLeft: 10,display:'flex' }}> 
                                    <Grid item xs={4}>
                                        <Button onClick={()=>this.checkPaymentType('cash')} color="secondary" fullWidth variant={this.state.isCard_type_show ? "outlined" : "contained"}>Pay By Cash</Button>
                                    </Grid>
                                    <Grid item xs={2}></Grid>
                                    <Grid item xs={4}>
                                    <Button onClick={()=>this.checkPaymentType('card')} color="secondary" fullWidth variant={this.state.isCard_type_show ? "contained" : "outlined"}>Pay By Card</Button>
                                    </Grid>
                                    <Grid item xs={2}></Grid>
                                    
                                </Grid>
                                { this.state.isCard_type_show &&
                                <Grid item xs={12} style={{padding: 10, visibility: this.state.isCard_type_show ? 'visible' : 'hidden'}}>
                                        <FormControl component="fieldset"> 
                                            <RadioGroup row aria-label="card" name="row-radio-buttons-group">
                                                <FormControlLabel value={this.state.card_type} control={<Radio value="credit" checked={this.state.card_type === 'credit'} onChange={(e)=>{ this.handleradio(e); }}/>} label="Credit Card" />
                                                <FormControlLabel value={this.state.card_type} control={<Radio value="debit" checked={this.state.card_type === 'debit'} onChange={(e)=>{ this.handleradio(e); }}/>} label="Debit Card" />
                                             </RadioGroup>
                                        </FormControl>
                                </Grid>}
                                <Grid item xs={12} className='notefield' style={{padding: 10,display:'flex' }}>
                                        <TextareaAutosizeContent 
                                            fullWidth
                                            label="Notes"
                                            name="Notes"
                                            id="Notes"
                                            rows={3} 
                                            multiline
                                            value={this.state.description}
                                            onChange={this.handlechangeDesc}

                                        />                                                
                                </Grid>
                                <Grid item xs={12} style={{padding: 10,display:'flex',  justifyContent:"flex-end"}}>
                                    <Button  onClick={()=>this.savePayment(this.state.ticketDetail,this.state.payment_type)} color="secondary" variant="contained">Pay</Button>
                                    <Button  onClick={()=>this.savePayment(this.state.ticketDetail,this.state.payment_type, 'print')} color="secondary" style={{marginLeft:'1rem'}} variant="contained">Pay & Print</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

        {this.state.printalert &&  <AlertModal title="Alert" msg="No printers added yet." handleCloseAlert={()=>this.setState({printalert:false})}/>}
                </Box>
           
        )
    }
}
export default TicketPayment;