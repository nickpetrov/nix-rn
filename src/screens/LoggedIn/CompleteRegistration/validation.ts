import * as yup from 'yup';

const step2ValidationSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(2, ({min}) => `First Name must be at least ${min} characters`),
  country_code: yup.string().required('Country is Required'),
});

export default step2ValidationSchema;
