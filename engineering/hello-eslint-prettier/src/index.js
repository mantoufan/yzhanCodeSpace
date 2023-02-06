const a = 1; // parseOptions: ecmaVersion: 2015
const b = <div></div>; // parseOptions: ecmaFeatures: jsx: true
export const c = 3; // parseOptions: sourceType: "module"
console.log(1); // rules: no-console warning
console.log(2); // eslint-disable-line

/* prettier */
const data = {
  a: 1,
  b: 2,
};
