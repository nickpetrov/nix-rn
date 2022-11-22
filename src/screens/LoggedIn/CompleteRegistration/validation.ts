import * as yup from 'yup';

const step2ValidationSchema = yup.object().shape({
  isAgreedTerms: yup
    .bool()
    .oneOf([true], 'You must accept terms in order to use this app')
    .required('You must accept terms in order to use this app'),
  isConfirmedThirteen: yup
    .bool()
    .oneOf([true], 'You must be at least 13 years old in order to use this app')
    .required('You must be at least 13 years old in order to use this app'),
});

export default step2ValidationSchema;
