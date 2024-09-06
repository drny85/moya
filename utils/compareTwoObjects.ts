export function objectsAreDifferent<T extends object>(obj1: T, obj2: T): boolean {
   // Get the keys of both objects
   const keys1 = Object.keys(obj1);
   const keys2 = Object.keys(obj2);

   // Check if the number of keys is different
   if (keys1.length !== keys2.length) {
      return true;
   }

   // Check each key-value pair
   for (const key of keys1) {
      // @ts-ignore
      if (obj1[key] !== obj2[key]) {
         return true;
      }
   }

   // If all key-value pairs are the same, return false
   return false;
}
