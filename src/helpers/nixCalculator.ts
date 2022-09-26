
//'nixTrackCalculator'
/**
 * @ngdoc property
 * @propertyOf nix.track-api-client.service:nixTrackCalculator
 * @name nix.track-api-client.service:nixTrackCalculator#exerciseLevels
 * @type {Object[]}
 *
 * @description
 * List of exercise levels to factor BMR
 *
 * [0] Little to no exercise <br/>
 * [1] Light exercise (1-3 days per week) <br/>
 * [2] Moderate exercise (3-5 days per week) <br/>
 * [3] Heavy exercise (6-7 days per week) <br/>
 * [4] Very heavy exercise (twice per day, extra heavy workouts) <br/>
 */
const exerciseLevels = [
  {
    title: 'Little to no exercise',
    factor: 1.2
  },
  {
    title: 'Light exercise (1-3 days per week)',
    factor: 1.375
  },
  {
    title: 'Moderate exercise (3-5 days per week)',
    factor: 1.55
  },
  {
    title: 'Heavy exercise (6-7 days per week)',
    factor: 1.725
  },
  {
    title: 'Very heavy exercise (twice per day, extra heavy workouts)',
    factor: 1.9
  }
];

/**
 * @ngdoc method
 * @methodOf nix.track-api-client.service:nixTrackCalculator
 *
 * @name nix.track-api-client.service:nixTrackCalculator#calculateBmr
 *
 * @description
 * Calculate basal metabolic rate <br/>
 * Men BMR = 88.362 + (13.397 x weight in kg) + (4.799 x height in cm) - (5.677 x age in years) <br/>
 * Women BMR = 447.593 + (9.247 x weight in kg) + (3.098 x height in cm) - (4.330 x age in years) <br/>
 *
 * @param {string} gender "f" for female, "m" for male
 * @param {int} weight Person weight in kilograms
 * @param {int} height Person height in centimeters
 * @param {int} age Person age in years
 * @returns {number} Basal metabolic rate
 */
//Men BMR = 88.362 + (13.397 x weight in kg) + (4.799 x height in cm) - (5.677 x age in years)
//Women BMR = 447.593 + (9.247 x weight in kg) + (3.098 x height in cm) - (4.330 x age in years)
export const calculateBmr = (gender, weight, height, age) => {
  if ((gender || "").toString().toLowerCase()[0] === 'f') {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
};

/**
 * @ngdoc method
 * @methodOf nix.track-api-client.service:nixTrackCalculator
 *
 * @name nix.track-api-client.service:nixTrackCalculator#calculateRecommendedCalories
 *
 * @description
 * Calculate recommended number of calories for particular person
 *
 * @param {string} gender "f" for female, "m" for male
 * @param {int} weight Person weight in kilograms
 * @param {int} height Person height in centimeters
 * @param {int} age Person age in years
 * @param {int} exerciseLevel Index from exerciseLevels
 *                            array. 0-4, defaults to 0 = Little to no exercise
 *
 * @returns {number} Recommended number of calories
 */
export const calculateRecommendedCalories = (gender, weight, height, age, exerciseLevel) => {
  exerciseLevel = parseInt(exerciseLevel);
  if (!exerciseLevel || exerciseLevel < 0 || exerciseLevel > 4) {
    exerciseLevel = 0;
  }

  return Math.round(exerciseLevels[exerciseLevel].factor * calculateBmr(gender, weight, height, age));
};