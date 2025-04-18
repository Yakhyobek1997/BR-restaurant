function mergeSortedArrays(arr1: number[], arr2: number[]): number[] {
  const merged: number[] = [...arr1, ...arr2];
  return merged.sort((a, b) => a - b);
}


const result = mergeSortedArrays([0, 3, 4, 31], [4, 6, 30]);
console.log(result);




// // TASK S

// function missingNumber(arr: number[]): number {
//   const n = arr.length + 1; // chunki bitta son yo‘q
//   const expectedSum = (n * (n - 1)) / 2;
//   const actualSum = arr.reduce((sum, num) => sum + num, 0);
//   return expectedSum - actualSum;
// }

// // Test
// console.log(missingNumber([3, 0, 1]));
// console.log(missingNumber([0, 1]));    






// R-task , yarn run train - orqali run qiling

// export {}

// function calculate(input: string): number {

//     const parts = input.split('+');
//     const sum = parts.reduce((acc, val) => acc + Number(val), 0);
//     return sum;
//   }
  
//   console.log(calculate("1+3"));



//Q-TASK:

// function hasProperty(obj: object, key: string): boolean {
//   return key in obj;
// }

// console.log(hasProperty({ name: "BMW", model: "M3" }, "model")); // true
// console.log(hasProperty({ name: "BMW", model: "M3" }, "year"));  // false



// function objectToArray(obj: Record<string, any>): [string, any][] {
//   const result: [string, any][] = [];
//   for (let key in obj) {
//     if (Object.prototype.hasOwnProperty.call(obj, key)) {
//       result.push([key, obj[key]]);
//     }
//   }
//   return result;
// }

// const example = { a: 10, b: 20 };
// console.log(objectToArray(example));



// O-TASK:

// function calculateSumOfNumbers(arr: any[]): number {
//   return arr
//     .filter(item => typeof item === 'number')
//     .reduce((sum, num) => sum + num, 0);
// }

// // test
// const result = calculateSumOfNumbers([10, "10", { son: 10 }, true, 35]);
// console.log(result);



// function palindromCheck(words : string): boolean {
//   // So'zni teskari qilish
//   const reversed = words.split('').reverse().join('');
//   // taqqoslas
//   return words === reversed;
// }

// console.log(palindromCheck("dad")); 
// console.log(palindromCheck("son")); 






// TASK M

// function getSquareNumbers(numbers: number[]): { number: number, square: number }[] {
//   return numbers.map((num) => ({
//     number: num,
//     square: num * num,
//   }));
// }

// console.log(getSquareNumbers([1, 2, 3]));




// L-TASK: 

// function reverseSentence(sentence: string): string {
//   return sentence
//     .split(' ') 
//     .map(word => word.split('').reverse().join('')) // Har bir so‘zni chappasiga aylantirish
//     .join(' '); 
// }


// console.log(reverseSentence("what are you doing man ? ")); 


// function countVowels(str: string): number {
//   const vowels = ['a', 'e', 'i', 'o', 'u'];
//   let count = 0;

//   for (const char of str.toLowerCase()) {
//     if (vowels.includes(char)) {
//       count++;
//     }
//   }

//   return count;
// }

// // Test
// console.log(countVowels("string")); 
// console.log(countVowels("education")); 



// Task H2

// function getDigits(input: string): string {
//   return input.replace(/\D/g, "");
// }

// console.log(getDigits("m14i1t")); // 141




// J task

// const findLongestWord = (sentence: string): string => 
//   sentence.split(" ").reduce((a, b) => (b.length > a.length ? b : a), "");

// console.log(findLongestWord("I come from Uzbekistan")); // "Uzbekistan"







/* Project Standarts:
  - Logging standarts
  - Naming standarts
     function, method, variable => Camel case, gohome
     class => PASCAL     MemberService
     folder => KEBAB     
     css => SNAKE

 - Error handling


*/


// Validation: 

// 1)Frond end
// 2)Backend
// 3)DataBase







// Qaysi qiymat eng ko'p qatnashganini topib beradi

// function majorityElement(arr: number[]): number {
//   const countMap: Record<number, number> = {};

//   // calculate the element
//   arr.forEach((num) => {
//       countMap[num] = (countMap[num] || 0) + 1;
//   });

//   // We have to find the most repeated element
//   let majority: number | null = null;
//   let maxCount = 0;

//   for (const num in countMap) {
//       if (countMap[num] > maxCount) {
//           maxCount = countMap[num];
//           majority = parseInt(num);
//       }
//   }

//   return majority!;
// }

// // masalan
// console.log(majorityElement([1,2,5,5,3,4,5,6,6,5,5,4,3,4])); // 5 eng kop qatnasgan





// function getPositive(arr: number[]): string {
//     return arr.filter((num: number) => num > 0).join('');
//   }
  
//   // test
//   console.log(getPositive([1, -4, 2])); // "12"





//G-task

// function getHighestIndex(arr: number[]) {
//     if(arr.length == 0) return -1

//     let maxValue = Math.max(...arr)
//     return arr.indexOf(maxValue)
// }


// // test
// console.log(getHighestIndex([10, 20, 30, 40, 50]))
