function removeDuplicate(input: string): string {
  let seen = new Set<string>();
  let result = "";

  for (const char of input) {
    if (!seen.has(char)) {
      seen.add(char);
      result += char;
    }
  }

  return result;
}

console.log(removeDuplicate("stringg")); 




// Tsk ZD

// function changeNumberInArray(index: number, arr: number[], newValue: number): number[] {
//   if (index < 0 || index >= arr.length) {
//     throw new Error("Index out of bounds");
//   }

//   const newArr = [...arr]; // original arrayni ozgartirmaslik uchun
//   newArr[index] = newValue; // indexdagi qiymatni almashtiramiz
//   return newArr;
// }

// const result = changeNumberInArray(1, [1, 3, 7, 2], 2);
// console.log(result);




// ZB TASK

// function randomBetween(min: number, max: number): number {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

 
// const result = randomBetween(30, 50);
// console.log(result); 


/* ZA-TASK:  Shunday function yozing, u array ichidagi objectlarni “age” qiymati boyicha sortlab bersin. 
MASALAN: sortByAge([{age:23}, {age:21}, {age:13}]) return [{age:13}, {age:21}, {age:23}] */


// function sortByAge(arr: { age: number }[]): { age: number }[] {
//   return arr.sort((a, b) => a.age - b.age);
// }

// const people = [{ age: 23 }, { age: 21 }, { age: 13 }];
// const sorted = sortByAge(people);
// console.log(sorted);

// function sumEvens(arr: number[]): number {
//   return arr.filter(num => num % 2 === 0).reduce((sum, num) => sum + num, 0);
// }

// console.log(sumEvens([1, 2, 3]));


// function findIntersection(arr1: number[], arr2: number[]): number[] {
//   const set2 = new Set(arr2);
//   const intersection = arr1.filter(item => set2.has(item));
//   return intersection;
// }

// // Test
// console.log(findIntersection([1, 2, 3], [3, 2, 0]));





// function countOccurrences(obj: any, keyToCount: string): number {
//   let count = 0;
//   for (const key in obj) {
//     if (key === keyToCount) count++;
//     if (typeof obj[key] === 'object' && obj[key] !== null)
//       count += countOccurrences(obj[key], keyToCount);
//   }
//   return count;
// }

// console.log(countOccurrences({model: 'Bugatti', steer: {model: 'HANKOOK', size: 30}}, 'model')); // 2




// TASK W

// function chunkArray(array: any[], size: number) {
//   const result = [];

//   for (let i = 0; i < array.length; i += size) {
//     result.push(array.slice(i, i + size));
//   }

//   return result;
// }

// console.log(chunkArray([1,2,3,4,5,6,7,8,9,10], 3));




// function countChars(input: string): Record<string, number> {
//   const result: Record<string, number> = {};

//   for (const char of input) {
//     result[char] = (result[char] || 0) + 1;
//   }

//   return result;
// }

// console.log(countChars("hello"));



// function sumOdds(number : number) {
//   let count = 0;
//   for (let i = 1; i < number; i += 2) {
//     count++;
//   }
//   return count;
// } t 

// // Test
// console.log(sumOdds(9));
// console.log(sumOdds(11)); 






// function mergeSortedArrays(arr1: number[], arr2: number[]): number[] {
//   const merged: number[] = [...arr1, ...arr2];
//   return merged.sort((a, b) => a - b);
// }


// const result = mergeSortedArrays([0, 3, 4, 31], [4, 6, 30]);
// console.log(result);




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
