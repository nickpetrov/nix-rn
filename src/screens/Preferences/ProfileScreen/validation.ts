import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  first_name: yup.string().required('First Name is required'),
  last_name: yup.string().required('Last Name is required'),
  timezone: yup.string().required('Timezone is required'),
  measure_system: yup.string().required('Measure System is required'),
  weight_kg: yup
    .number()
    .typeError('Invalid value')
    .when('measure_system', {
      is: 1,
      then: yup
        .number()
        .typeError('Invalid value')
        .required('Weight is required'),
    }),
  weight_lb: yup
    .number()
    .typeError('Invalid value')
    .when('measure_system', {
      is: 0,
      then: yup
        .number()
        .typeError('Invalid value')
        .required('Weight is required'),
    }),
  height_cm: yup
    .number()
    .typeError('Invalid value')
    .when('measure_system', {
      is: 1,
      then: yup
        .number()
        .typeError('Invalid value')
        .required('Height is required'),
    }),
  height_ft: yup
    .number()
    .typeError('Invalid value')
    .when('measure_system', {
      is: 0,
      then: yup
        .number()
        .typeError('Invalid value')
        .required('Height is required'),
    }),
  height_in: yup
    .number()
    .typeError('Invalid value')
    .when('measure_system', {
      is: 0,
      then: yup
        .number()
        .typeError('Invalid value')
        .required('Height is required'),
    }),
  age: yup.number().typeError('Invalid value').required('Age is required'),
});
