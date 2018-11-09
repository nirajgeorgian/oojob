/*
 * @flow
 */
export const validateEmail = (str: string): boolean => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(str);
};

/*
 * @flow
 */
export const validatePassword = (str: string): boolean => {
    const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return re.test(str);
}

/*
 * @flow
 */
export const validateName = (str: string): boolean => {
    const re = /^([a-zA-z]){2,}$/;
    return re.test(str);
}

/*
 * @flow
 */
export const validateUsername = (str: string): boolean => {
    const re = /^[a-zA-z0-9]{5,20}$/;
    return re.test(str);
}