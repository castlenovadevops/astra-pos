import { Container, Grid, FormControlLabel, Checkbox } from "@mui/material"; 
 
import React from "react";  
 

export default class PermissionsComponent extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            permissions:{},
            isChanged: false
        }
        this.getChecked = this.getChecked.bind(this)
        this.checkDisable = this.checkDisable.bind(this);
        this.onChange = this.onChange.bind(this)
    }

    getChecked(key, val){
        var permissions = Object.assign({}, this.state.permissions)
        console.log(key)
        if(permissions[key] === val  && key.indexOf('.') === -1){
            return true;
        }
        else if(permissions[key] === 'W' && val === 'R' && key.indexOf('.') === -1){
            return true;
        }
        else if(permissions[key] === 'All' && val === 'Assigned' && key.indexOf('.') === -1){
            return true;
        } 
        else if(key.indexOf('.') !== -1){
            var tmp = key.split('.')
            if(tmp.length === 2){ 
                var obj = permissions[tmp[0]] 
                if(obj[tmp[1]] === 'W' && val === 'R' ){
                    console.log("CHECK TRUE CALLING")
                    return true;
                }
                else if(obj[tmp[1]] === 'All' && val === 'Assigned'){
                    return true;
                } 
                else if(obj[tmp[1]] === val){
                    return true;
                }
                else{
                    return false
                }
            }
            else{ 
                let obj = permissions[tmp[0]]
                var obj1 = obj[tmp[1]]
                 
                if(obj1[tmp[2]] === 'W' && val === 'R'){
                    return true;
                }
                else if(obj1[tmp[2]] === 'All' && val === 'Assigned' ){
                    return true;
                } 
                else if(obj1[tmp[2]] === val){
                    return true;
                }
                else{
                    return false
                }
            }
        }
        else{
            return false;
        } 
        
    }

    checkDisable(key, val){
        var permissions = Object.assign({}, this.state.permissions)
        if(permissions[key] === 'W' && val === 'R' && key.indexOf('.') === -1){
            return true;
        }
        else if(permissions[key] === 'All' && val === 'Assigned' && key.indexOf('.') === -1){
            return true;
        } 
        else if(key.indexOf('.') !== -1){
            var tmp = key.split('.')
            if(tmp.length === 2){
                var obj = permissions[tmp[0]] 
                if(obj[tmp[1]] === 'W' && val === 'R' ){
                    return true;
                }
                else if(obj[tmp[1]] === 'All' && val === 'Assigned'){
                    return true;
                } 
            }
            else{ 
                let obj = permissions[tmp[0]]
                var obj1 = obj[tmp[1]]
                 
                if(obj1[tmp[2]] === 'W' && val === 'R' && key.indexOf('.') === -1){
                    return true;
                }
                else if(obj1[tmp[2]] === 'All' && val === 'Assigned' && key.indexOf('.') === -1){
                    return true;
                } 
                
            }
        }
        else{
            return false;
        } 
        
    }

    onChange(e, key){
        var permissions = Object.assign({}, this.state.permissions) 
        if(e.target.checked){
            if(key.indexOf('.') === -1){
                permissions[key] = e.target.value
            }
            else{
                var tmp = key.split('.')
                if(tmp.length === 2){
                    var obj = permissions[tmp[0]]
                    obj[tmp[1]] = e.target.value
                    permissions[tmp[0]] = obj;
                }
                else{ 
                    var eobj = permissions[tmp[0]]
                    var obj1 = eobj[tmp[1]]
                    obj1[tmp[2]] = e.target.value
                    eobj[tmp[1]] = obj1
                    permissions[tmp[0]] = eobj;
                }
            }
        }
        else{
            if(key.indexOf('.') === -1){
                permissions[key] = ''
            }
            else{
                let tmp = key.split('.')
                if(tmp.length === 2){
                    var iobj = permissions[tmp[0]]
                    iobj[tmp[1]] = ''
                    permissions[tmp[0]] = iobj;
                }
                else{ 
                    var elobj = permissions[tmp[0]]
                    var elobj1 = elobj[tmp[1]]
                    elobj1[tmp[2]] = ''
                    elobj[tmp[1]] = elobj1
                    permissions[tmp[0]] = elobj;
                }
            }
        } 
        this.setState({isChanged: true},()=>{
            this.setState({permissions: permissions},()=>{ 
                this.props.updatePermissions(this.state.permissions)
            })
        })
    }

    componentDidMount(){
        // if(this.props.showPermission==='Admin'){
        //     var permissions = {};
        //     WebAdminJSON.forEach(pem=>{
        //         permissions[pem.key] = ''
        //         if(pem.subLevel instanceof Array){
        //             var subobj = {}
        //             pem.subLevel.forEach(sub=>{
        //                 subobj[sub.key] = ''
        //                 if(sub.subLevel instanceof Array){
        //                     var subobj1 = {}
        //                     pem.subLevel.forEach(sub=>{
        //                         subobj1[sub.key] = ''
        //                     })
        //                     subobj[sub.key] = subobj1;
        //                 } 
        //             })
        //             permissions[pem.key] = subobj;
        //         } 
        //     })

        //     console.log(permissions);
        // }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        ////console.log(nextProps.formProps.properties)
        if (nextProps.showPermission !==  prevState.showPermission && !prevState.isChanged) { 
            var permissions = {}; 
            if(nextProps.value !== undefined && nextProps.value !== null){
                permissions = nextProps.value
                return {permissions: permissions}
            }
            else{
                nextProps.permissions.forEach(pem=>{
                    permissions[pem.key] = ''
                    if(pem.subLevel instanceof Array){
                        var subobj = {}
                        pem.subLevel.forEach(sub=>{
                            subobj[sub.key] = ''
                            if(sub.subLevel instanceof Array){
                                var subobj1 = {}
                                sub.subLevel.forEach(sub=>{
                                    subobj1[sub.key] = ''
                                })
                                subobj[sub.key] = subobj1;
                            } 
                        })
                        permissions[pem.key] = subobj;
                    } 
                })
                return {permissions: permissions}
            }
        }
    }

    render(){
        return  <Container className="permissionContainer" style={{maxWidth:'100%', padding:0}}> 

            {this.props.permissions.map(permission =>{
                return <Grid Container  alignItems={'center'}  style={{borderBottom:'1px solid #d0d0d0', padding:'1rem 0'}} display={'flex'} flexDirection={!(permission.subLevel instanceof Array) ? 'row' : 'column'}>
                    <Grid item style={{paddingBottom:'8px', fontSize:'16px'}} xs={!(permission.subLevel instanceof Array) ? 3 : 12}>
                        {permission.label}
                    </Grid>
                    {!(permission.subLevel instanceof Array) && <Grid item xs={9} display={'flex'} alignItems={'center'} >
                        <Grid Container display={'flex'} alignItems={'center'}  flexDirection={'row'}>
                            {permission.options.map(opt=>{
                                return <Grid item xs={6}> 
                                    <FormControlLabel 
                                        // id={this.props.id}
                                        name={permission.key}
                                        // value={this.props.value}
                                        label={opt.label} 
                                        disabled={this.checkDisable(permission.key, opt.Value)}
                                        checked={this.getChecked(permission.key, opt.Value)} 
                                        // fullWidth={this.props.fullWidth}
                                        // style={this.props.style} 
                                        control={<Checkbox value={opt.Value}  onClick={(e)=>{
                                             this.onChange(e, permission.key)
                                        }}/>} 
                                    />
                                    
                                </Grid>
                            })}
                        </Grid>
                    </Grid>}

                    {(permission.subLevel instanceof Array) && <Grid item xs={12} display={'flex'} alignItems={'center'} flexDirection={'column'}> 
                        {permission.subLevel.map(subpermission =>{
                            return <Grid Container display={'flex'} alignItems={!(subpermission.subLevel instanceof Array) ? 'center' : 'flex-start'} flexDirection={!(subpermission.subLevel instanceof Array) ? 'row' : 'column'}>
                                <Grid item xs={!(subpermission.subLevel instanceof Array) ? 3 : 12} style={{fontSize:'14px', display:'flex',alignItems:'flex-start', fontWeight:(!(subpermission.subLevel instanceof Array) ? '500' : '700')}}>
                                    {subpermission.label}
                                </Grid>
                                {!(subpermission.subLevel instanceof Array) && <Grid item xs={9}>
                                    <Grid Container display={'flex'} flexDirection={'row'}>
                                        {subpermission.options.map(opt=>{
                                            return <Grid item xs={6}>
                                                <FormControlLabel 
                                                    // id={this.props.id}
                                                    // name={this.props.name}
                                                    // value={this.props.value}
                                                    label={opt.label} 

                                                    disabled={this.checkDisable(permission.key+'.'+subpermission.key, opt.Value)}
                                                    checked={this.getChecked(permission.key+'.'+subpermission.key, opt.Value)}  
                                                    // fullWidth={this.props.fullWidth}
                                                    
                                                    control={<Checkbox value={opt.Value}   onClick={(e)=>{
                                                        this.onChange(e, permission.key+'.'+subpermission.key)
                                                   }}/>} 
                                                />
                                                
                                            </Grid>
                                        })}
                                    </Grid>
                                </Grid> }
            
                                {(subpermission.subLevel instanceof Array) && <Grid item xs={12} display={'flex'} alignItems={'center'} flexDirection={'column'}> 
                                    {subpermission.subLevel.map(subpermission1 =>{
                                        return <Grid Container display={'flex'} alignItems={'center'} flexDirection={'row'}>
                                            <Grid item xs={3} style={{fontSize:'14px', fontWeight:'500'}}>
                                                {subpermission1.label}
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Grid Container display={'flex'} flexDirection={'row'}>
                                                    {subpermission1.options.map(opt=>{
                                                        return <Grid item xs={6}>
                                                            <FormControlLabel 
                                                                // id={this.props.id}
                                                                // name={this.props.name}
                                                                // value={this.props.value}
                                                                label={opt.label} 
                                                                disabled={this.checkDisable(permission.key+'.'+subpermission.key+'.'+subpermission1.key, opt.Value)}
                                                                checked={this.getChecked(permission.key+'.'+subpermission.key+'.'+subpermission1.key, opt.Value)} 
                                                                
                                                                control={<Checkbox value={opt.Value} onClick={(e)=>{
                                                                    this.onChange(e,permission.key+'.'+subpermission.key+'.'+subpermission1.key)
                                                                }} />} 
                                                            />
                                                            
                                                        </Grid>
                                                    })}
                                                </Grid>
                                            </Grid> 
                        
                                        </Grid>
                                    })}           
                                </Grid>}
                            </Grid>
                        })}           
                    </Grid>}

                </Grid>
            })}
            </Container> 

    }
}