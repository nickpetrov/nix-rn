import * as yup from 'yup';

const signupValidationSchema = yup.object().shape({
  first_name: yup
    .string()
    .required('First Name is required')
    .min(2, ({min}) => `First Name must be at least ${min} characters`),
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email Address is Required'),
  confirmEmail: yup
    .string()
    .required('Please confirm Email address')
    .oneOf([yup.ref('email'), null], 'Emails must match'),
  password: yup
    .string()
    .min(6, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is required'),
  isAgreedTerms: yup
    .bool()
    .oneOf([true], 'You must accept terms in order to use this app')
    .required('You must accept terms in order to use this app'),
  isConfirmedThirteen: yup
    .bool()
    .oneOf([true], 'You must be at least 13 years old in order to use this app')
    .required('You must be at least 13 years old in order to use this app'),
});

export default signupValidationSchema;
