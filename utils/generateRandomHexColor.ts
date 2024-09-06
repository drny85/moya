export const generateRandomHexColor = (): string => {
   // Generate a random number between 0 and 16777215 (which is 0xFFFFFF)
   const randomNumber = Math.floor(Math.random() * 16777215);

   // Convert the random number to a hex string and pad it with leading zeros if necessary
   const hexColor = `#${randomNumber.toString(16).padStart(6, '0')}`;

   return hexColor;
};

// Example usage:
