
export const logout = () => {
    localStorage.clear();
}

export const isLogin = () => {
    if (localStorage.getItem('merchantDetail')) {
        return true;
    }

    return false;
}
