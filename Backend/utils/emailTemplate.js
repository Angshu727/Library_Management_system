export function generateVerificationEmailTemplate(otpcode){
    return`Your verification code is: ${otpcode}`;
}

export function generateForgotPasswordEmailTemplate(resetUrl){
    return`Click on the link to reset your password: ${resetUrl}. If you did not request this, please ignore this email.`;
}