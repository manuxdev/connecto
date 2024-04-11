export function isEmailValid(email) {
    // eslint-disable-next-line no-useless-escape
    const emailValid = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    return emailValid.test(String(email).toLowerCase())
}

export function validatePass(password) {
    const passValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return passValid.test(password)
}

export function validatePhoneNumber(number) {
    // El patrón de expresión regular para validar el número de teléfono
    const validPhone = /^(52|53|54|56|59)\d{6}$/
    return validPhone.test(number)
}
