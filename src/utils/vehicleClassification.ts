/**
 * Determines if a vehicle is "nearly new" based on mileage and age
 * @param mileage Vehicle mileage in kilometers
 * @param year Vehicle year
 * @returns true if vehicle is nearly new (< 30,000 km and < 2 years old)
 */
export const isNearlyNew = (mileage: number, year: number): boolean => {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;
  
  return mileage < 30000 && vehicleAge < 2;
};