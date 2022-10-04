function appendData(formData: FormData, values: Object) {
  for (const [key, value] of Object.entries(values)) {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === 'object' && value !== null) {
      for (const [key1, value1] of Object.entries(value)) {
        appendData(formData, {[`${key}[${key1}]`]: value1});
      }
    } else if (typeof value !== 'undefined') {
      formData.append(key, value !== null ? value : '');
    }
  }
}

export const getFormData = (obj: Object) => {
  const formData = new FormData();

  appendData(formData, obj);
  return formData;
};
