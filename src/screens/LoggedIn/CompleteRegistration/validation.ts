import * as yup from 'yup';

const step2ValidationSchema = yup.object().shape({
  nutrition_topics: yup.array().of(yup.number()),
  isAgreedTerms: yup
    .bool()
    .oneOf([true], 'You must accept terms in order to use this app')
    .required('You must accept terms in order to use this app'),
  isConfirmedThirteen: yup
    .bool()
    .oneOf([true], 'You must be at least 13 years old in order to use this app')
    .required('You must be at least 13 years old in order to use this app'),
  weekday_reminders_enabled: yup.bool(),
  weekend_reminders_enabled: yup.bool(),
  showEmail: yup.boolean(),
  email: yup
    .string()
    .email()
    .when('showEmail', {
      is: true,
      then: yup.string().required('Must enter email address'),
    }),
});

export default step2ValidationSchema;
