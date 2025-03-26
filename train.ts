function countVowels(str: string): number {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  let count = 0;

  for (const char of str.toLowerCase()) {
    if (vowels.includes(char)) {
      count++;
    }
  }

  return count;
}

// Test
console.log(countVowels("string")); 
console.log(countVowels("education")); 



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
