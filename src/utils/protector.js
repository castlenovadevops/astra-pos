
export const logout = () => {
    localStorage.clear();
}

export const isDeviceRegistered = ()=>{ 
    if (localStorage.getItem('merchantdetail')) {
        return true;
    }

    return false;
}

export const isLogin = () => {
    if (localStorage.getItem('userdetail')) {
        // console.log("IFFFFFFFFF")
        return true;
    }

    return false;
}




export const checkPageAccess = (page)=>{
    var detail = localStorage.getItem('userdetail') || '{}'
    var userdetail = JSON.parse(detail) || {}
    if(userdetail.mEmployeeRoleName === 'Owner'){
        return true;
    }
    var permissions = userdetail.UserPermissions !== undefined ? JSON.parse(userdetail.UserPermissions)  : {}
    var tmp = page.split('.') 
    if(Object.keys(permissions).length !== 0){
        if(permissions[page] !== '' && tmp.length === 1 && permissions[page] !== undefined){
            return true; 
        } 
    }
    return false;
}

export const checkButtonAccess = (page)=>{
    var detail = localStorage.getItem('userdetail') || '{}'
    var userdetail = JSON.parse(detail) || {}
    if(userdetail.mEmployeeRoleName === 'Owner'){
        return 'W';
    }
    var permissions = userdetail.UserPermissions !== undefined ? JSON.parse(userdetail.UserPermissions)  : {}
    var tmp = page.split('.') 
    if(Object.keys(permissions).length !== 0){ 
        console.log(permissions[page], page)
        if(permissions[page] !== '' && tmp.length === 1)
            return permissions[page];
        else if(tmp.length === 2){
            var obj = permissions[tmp[0]] 
            if(obj[tmp[1]] !== ''){
                return obj[tmp[1]];
            }
        }
        else{ 
            var eobj = permissions[tmp[0]]
            var eobj1 = eobj[tmp[1]]; 
            if(eobj1[tmp[2]] !== ''){
                return eobj1[tmp[2]];
            }
        } 
    }
    return '';
}


export const getMenus = ()=>{
    var detail = localStorage.getItem('userdetail') || '{}'
    var userdetail = JSON.parse(detail) || {} 
    var permissions = userdetail.userPermissions !== undefined ? JSON.parse(userdetail.userPermissions)  : {}
    var menus = [];
    if(permissions !== undefined && permissions !== null){
        if(Object.keys(permissions).length !== 0){
            Object.keys(permissions).forEach(page=>{
                if(!(permissions[page] instanceof Object) && permissions[page] !== ''){
                    menus.push(page)
                }
                if(permissions[page] instanceof Object){
                    var sublevel1 = permissions[page]
                    Object.keys(sublevel1).forEach(subpage1=>{
                        if(!(sublevel1[subpage1] instanceof Object) && sublevel1[subpage1] !== ''){ 
                            menus.push(subpage1)
                        }
                        if(sublevel1[subpage1] instanceof Object){
                            var sublevel2 = sublevel1[subpage1] 
                            Object.keys(sublevel2).forEach(subpage2=>{
                                if(sublevel2[subpage2] !== ''){
                                    menus.push(subpage2)
                                } 
                            })
                        }
                    })
                }
            }) 
        }
    }
    return menus;
}