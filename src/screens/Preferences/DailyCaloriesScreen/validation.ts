import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  measure_system: yup.string().required('Measure System is required'),
  weight_kg: yup.number().typeError('Invalid value'),
  weight_lb: yup.number().typeError('Invalid value'),
  height_cm: yup.number().typeError('Invalid value'),
  height_ft: yup.number().typeError('Invalid value'),
  height_in: yup.number().typeError('Invalid value'),
  age: yup.number().typeError('Invalid value'),
  daily_kcal: yup
    .number()
    .typeError('Please set valid number')
    .test('Not 0?', "Calorie Limit can't be 0", value => value != 0)
    .required('Please, set Calorie Limit'),
});
