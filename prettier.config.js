module.exports = {
   printWidth: 100,
   tabWidth: 3,
   singleQuote: true,
   bracketSameLine: true,
   trailingComma: 'es5',
   plugins: [require.resolve('prettier-plugin-tailwindcss')],
   tailwindAttributes: ['className'],
};
