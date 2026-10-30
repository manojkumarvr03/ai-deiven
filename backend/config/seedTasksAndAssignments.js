import Task from '../models/Task.js';
import Assignment from '../models/Assignment.js';
import { inMemoryStore } from './db.js';

export const INITIAL_TASKS = [
  // =========================================================================
  // 1. PROGRAMMING PATH TASKS (Python, JavaScript, DSA)
  // =========================================================================
  {
    title: 'Sum of Even Numbers in a List',
    code: 'task_py_even_sum',
    studyRole: 'programming',
    courseId: 'prog_python',
    category: 'Lists & Loops',
    difficulty: 'Easy',
    xpReward: 50,
    estimatedMinutes: 10,
    description: `### Problem Statement\nWrite a Python function \`sum_of_evens(numbers)\` that takes a list of integers and returns the sum of all **even numbers** in the list.\n\nIf the list contains no even numbers or is empty, return \`0\`.`,
    examples: [
      { input: '[1, 2, 3, 4, 5, 6]', output: '12', explanation: '2 + 4 + 6 = 12' },
      { input: '[1, 3, 5, 7]', output: '0', explanation: 'No even numbers in list' }
    ],
    constraints: ['List length between 0 and 10^4', 'Each number is between -10^6 and 10^6'],
    starterCode: `def sum_of_evens(numbers):\n    # Write your solution here\n    pass\n`,
    language: 'python',
    testCases: [
      { input: '[1, 2, 3, 4, 5, 6]', expectedOutput: '12', explanation: 'Basic even numbers sum', isHidden: false },
      { input: '[10, 20, 30]', expectedOutput: '60', explanation: 'All even numbers', isHidden: false },
      { input: '[1, 3, 5, 7, 9]', expectedOutput: '0', explanation: 'All odd numbers', isHidden: false },
      { input: '[]', expectedOutput: '0', explanation: 'Empty list edge case', isHidden: true },
      { input: '[-2, -4, 5, 6]', expectedOutput: '0', explanation: '-2 + -4 + 6 = 0', isHidden: true }
    ],
    hints: [
      'Iterate through the list using a for loop.',
      'Check if the element is divisible by 2 using the modulo operator `num % 2 == 0`.',
      'You can also use a list comprehension: `sum(x for x in numbers if x % 2 == 0)`.'
    ],
    aiGuidance: 'The modulo operator `%` calculates the remainder of division. If `x % 2 == 0`, `x` is even.',
    order: 1
  },
  {
    title: 'Palindrome String Checker',
    code: 'task_py_palindrome',
    studyRole: 'programming',
    courseId: 'prog_python',
    category: 'Strings & Slicing',
    difficulty: 'Easy',
    xpReward: 60,
    estimatedMinutes: 12,
    description: `### Problem Statement\nWrite a Python function \`is_palindrome(s)\` that checks whether a given string is a **palindrome** (reads the same backward as forward).\n\nThe check should be **case-insensitive** and ignore spaces. Return \`True\` or \`False\`.`,
    examples: [
      { input: '"Racecar"', output: 'True', explanation: 'Ignoring case, "racecar" reversed is "racecar"' },
      { input: '"hello"', output: 'False', explanation: '"hello" reversed is "olleh"' }
    ],
    constraints: ['1 <= len(s) <= 10^5', 'String consists of alphanumeric characters and spaces'],
    starterCode: `def is_palindrome(s):\n    # Write your solution here\n    pass\n`,
    language: 'python',
    testCases: [
      { input: '"Racecar"', expectedOutput: 'True', explanation: 'Case insensitive match', isHidden: false },
      { input: '"hello"', expectedOutput: 'False', explanation: 'Not a palindrome', isHidden: false },
      { input: '"never odd or even"', expectedOutput: 'True', explanation: 'Phrase with spaces', isHidden: false },
      { input: '"A"', expectedOutput: 'True', explanation: 'Single character edge case', isHidden: true }
    ],
    hints: [
      'Convert the string to lowercase using `.lower()`.',
      'Remove spaces using `.replace(" ", "")`.',
      'Reverse the string using slicing `cleaned[::-1]` and compare.'
    ],
    aiGuidance: 'In Python, slice notation `s[::-1]` creates a reversed copy of the string in O(N) time.',
    order: 2
  },
  {
    title: 'Find the Second Largest Number',
    code: 'task_py_second_largest',
    studyRole: 'programming',
    courseId: 'prog_python',
    category: 'Data Structures & Algorithms',
    difficulty: 'Medium',
    xpReward: 100,
    estimatedMinutes: 15,
    description: `### Problem Statement\nWrite a Python function \`second_largest(numbers)\` that finds and returns the **second largest unique number** in a list.\n\nIf no second largest number exists (e.g. all elements are identical or list has fewer than 2 elements), return \`None\`.`,
    examples: [
      { input: '[10, 20, 4, 45, 99]', output: '45', explanation: '99 is largest, 45 is second largest' },
      { input: '[5, 5, 5]', output: 'None', explanation: 'No unique second largest element' }
    ],
    constraints: ['List size up to 10^5', 'Numbers can be negative, zero, or positive'],
    starterCode: `def second_largest(numbers):\n    # Write your solution here\n    pass\n`,
    language: 'python',
    testCases: [
      { input: '[10, 20, 4, 45, 99]', expectedOutput: '45', explanation: 'Standard list', isHidden: false },
      { input: '[5, 5, 5]', expectedOutput: 'None', explanation: 'All duplicates', isHidden: false },
      { input: '[-10, -20, -5, -1]', expectedOutput: '-5', explanation: 'Negative numbers', isHidden: false },
      { input: '[100]', expectedOutput: 'None', explanation: 'Single element list', isHidden: true }
    ],
    hints: [
      'Convert the list to a `set` to remove duplicates: `unique_nums = set(numbers)`.',
      'Check if `len(unique_nums) < 2`. If so, return `None`.',
      'Sort the unique numbers or find the max after removing the highest element.'
    ],
    aiGuidance: 'Using `set(numbers)` eliminates duplicate values in O(N) time before finding the top 2 elements.',
    order: 3
  },
  {
    title: 'Two Sum Target Indices',
    code: 'task_prog_two_sum',
    studyRole: 'programming',
    courseId: 'prog_python',
    category: 'Hash Maps & Algorithms',
    difficulty: 'Medium',
    xpReward: 120,
    estimatedMinutes: 20,
    description: `### Problem Statement\nGiven an array of integers \`nums\` and an integer \`target\`, return the **indices** of the two numbers such that they add up to \`target\`.\n\nReturn the indices in ascending order \`[i, j]\`. Assume exactly one valid solution exists.`,
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'nums[0] + nums[1] == 9' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]', explanation: 'nums[1] + nums[2] == 6' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    starterCode: `def two_sum(nums, target):\n    # Write your solution here\n    pass\n`,
    language: 'python',
    testCases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', explanation: 'Basic target sum', isHidden: false },
      { input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]', explanation: 'Mid indices', isHidden: false },
      { input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]', explanation: 'Duplicate numbers', isHidden: true }
    ],
    hints: [
      'Use a dictionary (hash map) to store values and their indices as you iterate.',
      'For each number `x`, calculate `complement = target - x`.',
      'If `complement` is already in the map, return `[map[complement], current_index]`.'
    ],
    aiGuidance: 'A Hash Map lookup is O(1) average time, giving an optimal O(N) overall runtime.',
    order: 4
  },

  // =========================================================================
  // 2. COLLEGE (B.Tech CSE & Engineering) TASKS
  // =========================================================================
  {
    title: 'Valid Parentheses & Bracket Matching',
    code: 'task_coll_valid_parentheses',
    studyRole: 'college',
    courseId: 'coll_btech_cse',
    category: 'Stack Data Structure',
    difficulty: 'Easy',
    xpReward: 70,
    estimatedMinutes: 15,
    description: `### Problem Statement\nGiven a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is **valid**.\n\nAn input string is valid if open brackets are closed by the same type of brackets in the correct order.`,
    examples: [
      { input: '"()[]{}"', output: 'True', explanation: 'All brackets match in order' },
      { input: '"(]"', output: 'False', explanation: 'Mismatched closing bracket' }
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only'],
    starterCode: `def is_valid_brackets(s):\n    # Implement stack-based matching\n    pass\n`,
    language: 'python',
    testCases: [
      { input: '"()[]{}"', expectedOutput: 'True', explanation: 'Standard matching', isHidden: false },
      { input: '"([{}])"', expectedOutput: 'True', explanation: 'Nested brackets', isHidden: false },
      { input: '"(]"', expectedOutput: 'False', explanation: 'Mismatched type', isHidden: false },
      { input: '"((("', expectedOutput: 'False', explanation: 'Unclosed open brackets', isHidden: true }
    ],
    hints: [
      'Initialize an empty stack list `stack = []`.',
      'Define a mapping of closing to opening brackets: `{")": "(", "}": "{", "]": "["}`.',
      'Push open brackets onto the stack. For closing brackets, pop and verify matching pair.'
    ],
    aiGuidance: 'Stacks follow LIFO (Last In First Out), making them ideal for nested delimiter matching.',
    order: 1
  },
  {
    title: 'Binary Search Implementation',
    code: 'task_coll_binary_search',
    studyRole: 'college',
    courseId: 'coll_btech_cse',
    category: 'Algorithms & Complexity',
    difficulty: 'Medium',
    xpReward: 90,
    estimatedMinutes: 15,
    description: `### Problem Statement\nImplement binary search in Python: \`binary_search(arr, target)\`.\nGiven a sorted array of integers \`arr\` in ascending order and an integer \`target\`, return the index of \`target\` if present, or \`-1\` if not found.\n\nYour algorithm must run in **O(log N)** runtime complexity.`,
    examples: [
      { input: 'arr = [-1, 0, 3, 5, 9, 12], target = 9', output: '4', explanation: '9 exists at index 4' },
      { input: 'arr = [-1, 0, 3, 5, 9, 12], target = 2', output: '-1', explanation: '2 does not exist' }
    ],
    constraints: ['1 <= arr.length <= 10^5', 'Array is strictly sorted in ascending order'],
    starterCode: `def binary_search(arr, target):\n    # Write O(log N) binary search\n    pass\n`,
    language: 'python',
    testCases: [
      { input: 'arr = [-1, 0, 3, 5, 9, 12], target = 9', expectedOutput: '4', explanation: 'Target in right half', isHidden: false },
      { input: 'arr = [-1, 0, 3, 5, 9, 12], target = 2', expectedOutput: '-1', explanation: 'Target missing', isHidden: false },
      { input: 'arr = [5], target = 5', expectedOutput: '0', explanation: 'Single element match', isHidden: true }
    ],
    hints: [
      'Maintain two pointers: `low = 0` and `high = len(arr) - 1`.',
      'Compute `mid = (low + high) // 2`.',
      'If `arr[mid] == target`, return `mid`. If `arr[mid] < target`, update `low = mid + 1`, else `high = mid - 1`.'
    ],
    aiGuidance: 'Binary search halves the search space each step, achieving O(log N) operations.',
    order: 2
  },

  // =========================================================================
  // 3. DIPLOMA ENGINEERING TASKS
  // =========================================================================
  {
    title: 'Binary to Decimal Number Converter',
    code: 'task_dip_bin_dec',
    studyRole: 'diploma',
    courseId: 'dip_computer_eng',
    category: 'Digital Electronics & Number Systems',
    difficulty: 'Easy',
    xpReward: 60,
    estimatedMinutes: 12,
    description: `### Problem Statement\nWrite a function \`bin_to_dec(binary_str)\` that converts a binary numeral string (e.g. \`"1101"\`) into its decimal integer equivalent (13).`,
    examples: [
      { input: '"1101"', output: '13', explanation: '1*(2^3) + 1*(2^2) + 0*(2^1) + 1*(2^0) = 8 + 4 + 0 + 1 = 13' },
      { input: '"1010"', output: '10', explanation: '8 + 2 = 10' }
    ],
    constraints: ['binary_str contains only characters "0" and "1"', 'Length up to 32 bits'],
    starterCode: `def bin_to_dec(binary_str):\n    # Convert binary string to decimal\n    pass\n`,
    language: 'python',
    testCases: [
      { input: '"1101"', expectedOutput: '13', explanation: '13 in binary', isHidden: false },
      { input: '"1010"', expectedOutput: '10', explanation: '10 in binary', isHidden: false },
      { input: '"11111111"', expectedOutput: '255', explanation: '8-bit max value (255)', isHidden: false },
      { input: '"0"', expectedOutput: '0', explanation: 'Zero representation', isHidden: true }
    ],
    hints: [
      'You can iterate from right to left using powers of 2 (2**i).',
      'Python also has a built-in `int(binary_str, 2)`.'
    ],
    aiGuidance: 'Positional value of bit n is 2^n in base-2 radix arithmetic.',
    order: 1
  },

  // =========================================================================
  // 4. SCHOOL PATH TASKS (Class 1 Foundation & Class 10/12 Science & Math)
  // =========================================================================
  {
    title: 'Class 1 — Count the Apples (Addition)',
    code: 'task_school_c1_apples',
    studyRole: 'school',
    courseId: 'school_class_1',
    category: 'Class 1 Math & Counting',
    difficulty: 'Easy',
    xpReward: 40,
    estimatedMinutes: 8,
    description: `### Problem Statement 🍎\nYou have two baskets of fresh red apples: \`basket1\` and \`basket2\`.\n\nWrite a function \`count_apples(basket1, basket2)\` that adds the number of apples in both baskets and returns the **total count**!`,
    examples: [
      { input: 'basket1 = 3, basket2 = 2', output: '5', explanation: '3 apples + 2 apples = 5 apples!' },
      { input: 'basket1 = 4, basket2 = 0', output: '4', explanation: '4 apples + 0 = 4 apples' }
    ],
    constraints: ['basket1 >= 0', 'basket2 >= 0'],
    starterCode: `def count_apples(basket1, basket2):\n    # Put both baskets together\n    pass\n`,
    language: 'python',
    testCases: [
      { input: '3, 2', expectedOutput: '5', explanation: '3 + 2 = 5', isHidden: false },
      { input: '4, 4', expectedOutput: '8', explanation: '4 + 4 = 8', isHidden: false },
      { input: '10, 5', expectedOutput: '15', explanation: '10 + 5 = 15', isHidden: false },
      { input: '0, 7', expectedOutput: '7', explanation: 'Zero plus 7', isHidden: true }
    ],
    hints: [
      'Use the addition operator `+`.',
      'Return `basket1 + basket2`.'
    ],
    aiGuidance: 'In Python, `+` adds two integers together.',
    order: 1
  },
  {
    title: 'Class 1 — Count the Vowels (A, E, I, O, U)',
    code: 'task_school_c1_vowels',
    studyRole: 'school',
    courseId: 'school_class_1',
    category: 'Class 1 English & Phonics',
    difficulty: 'Easy',
    xpReward: 45,
    estimatedMinutes: 10,
    description: `### Problem Statement 🔤\nIn English, the 5 special letters are vowels: **a, e, i, o, u**.\n\nWrite a function \`count_vowels(word)\` that counts how many vowels are in a given \`word\` (case-insensitive) and returns the count!`,
    examples: [
      { input: '"apple"', output: '2', explanation: '"a" and "e" are 2 vowels' },
      { input: '"sun"', output: '1', explanation: '"u" is 1 vowel' }
    ],
    constraints: ['word is a string of letters'],
    starterCode: `def count_vowels(word):\n    # Count vowels a, e, i, o, u\n    pass\n`,
    language: 'python',
    testCases: [
      { input: '"apple"', expectedOutput: '2', explanation: 'a, e', isHidden: false },
      { input: '"sun"', expectedOutput: '1', explanation: 'u', isHidden: false },
      { input: '"BANANA"', expectedOutput: '3', explanation: '3 "A"s', isHidden: false },
      { input: '"sky"', expectedOutput: '0', explanation: 'No vowels', isHidden: true }
    ],
    hints: [
      'Convert the word to lowercase using `word.lower()`.',
      'Count characters that are in `"aeiou"`.'
    ],
    aiGuidance: 'You can loop over characters or use `sum(1 for char in word.lower() if char in "aeiou")`.',
    order: 2
  },
  {
    title: 'Class 1 — Find the Bigger Number',
    code: 'task_school_c1_bigger',
    studyRole: 'school',
    courseId: 'school_class_1',
    category: 'Class 1 Math & Comparisons',
    difficulty: 'Easy',
    xpReward: 40,
    estimatedMinutes: 8,
    description: `### Problem Statement 🔢\nWrite a function \`bigger_number(num1, num2)\` that compares two numbers and returns whichever number is **larger**.\n\nIf both numbers are equal, return either one!`,
    examples: [
      { input: 'num1 = 8, num2 = 3', output: '8', explanation: '8 is bigger than 3' },
      { input: 'num1 = 5, num2 = 9', output: '9', explanation: '9 is bigger than 5' }
    ],
    constraints: ['num1, num2 >= 0'],
    starterCode: `def bigger_number(num1, num2):\n    # Return the bigger number\n    pass\n`,
    language: 'python',
    testCases: [
      { input: '8, 3', expectedOutput: '8', explanation: '8 > 3', isHidden: false },
      { input: '5, 9', expectedOutput: '9', explanation: '9 > 5', isHidden: false },
      { input: '6, 6', expectedOutput: '6', explanation: 'Equal numbers', isHidden: false },
      { input: '20, 15', expectedOutput: '20', explanation: '20 is bigger', isHidden: true }
    ],
    hints: [
      'Use an if statement: `if num1 > num2: return num1 else: return num2`.',
      'Or simply use the built-in `max(num1, num2)`.'
    ],
    aiGuidance: 'The `max()` function returns the largest item.',
    order: 3
  },
  {
    title: 'Quadratic Equation Roots Solver',
    code: 'task_school_quadratic',
    studyRole: 'school',
    courseId: 'school_class_10',
    category: 'Algebra & Mathematics',
    difficulty: 'Medium',
    xpReward: 80,
    estimatedMinutes: 15,
    description: `### Problem Statement\nWrite a Python function \`quadratic_roots(a, b, c)\` that computes the roots of the quadratic equation **ax² + bx + c = 0** using the quadratic formula:\n\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\nReturn a tuple/list of the two roots sorted in ascending order \`[root1, root2]\` rounded to 2 decimal places. If roots are complex ($b^2 - 4ac < 0$), return \`"Complex"\`.`,
    examples: [
      { input: 'a=1, b=-5, c=6', output: '[2.0, 3.0]', explanation: 'Roots of x^2 - 5x + 6 = 0 are 2 and 3' },
      { input: 'a=1, b=2, c=5', output: '"Complex"', explanation: 'Discriminant 4 - 20 = -16 < 0' }
    ],
    constraints: ['a != 0', 'a, b, c are real numbers'],
    starterCode: `import math\n\ndef quadratic_roots(a, b, c):\n    # Calculate discriminant and find roots\n    pass\n`,
    language: 'python',
    testCases: [
      { input: 'a=1, b=-5, c=6', expectedOutput: '[2.0, 3.0]', explanation: 'Real distinct roots', isHidden: false },
      { input: 'a=1, b=-2, c=1', expectedOutput: '[1.0, 1.0]', explanation: 'Repeated root (x-1)^2 = 0', isHidden: false },
      { input: 'a=1, b=2, c=5', expectedOutput: '"Complex"', explanation: 'Negative discriminant', isHidden: false }
    ],
    hints: [
      'Calculate discriminant: `D = b**2 - 4*a*c`.',
      'If `D < 0`, return `"Complex"`.',
      'Otherwise calculate `r1 = (-b - math.sqrt(D)) / (2*a)` and `r2 = (-b + math.sqrt(D)) / (2*a)`, sort them, and round to 2 decimals.'
    ],
    aiGuidance: 'The discriminant determines whether the parabola intersects the x-axis in 2 points, 1 point, or no real points.',
    order: 4
  }
];

export const INITIAL_ASSIGNMENTS = [
  // =========================================================================
  // 1. PROGRAMMING PATH ASSIGNMENTS
  // =========================================================================
  {
    title: 'Assignment 1 — Interactive Student Grade Analytics Engine',
    code: 'asgn_py_grade_engine',
    studyRole: 'programming',
    courseId: 'prog_python',
    moduleLevel: 1,
    category: 'Control Flow & Data Structures',
    totalPoints: 100,
    difficulty: 'Beginner',
    estimatedDays: 3,
    dueDateDays: 7,
    description: 'Design and implement a robust Python module to process student examination records, compute statistics (mean, median, top performer), and generate formatted performance grade cards.',
    problemStatement: `### Problem Overview\nAn academic institution needs an automated grade analytics processor.\n\n### Requirements:\n1. **Function \`process_grades(student_data)\`**:\n   - Accepts a dictionary where keys are student names and values are lists of subject scores (e.g. \`{"Aarav": [85, 90, 78], "Priya": [92, 88, 95]}\`).\n   - Calculates average score for each student.\n   - Assigns letter grades: A (>= 90), B (>= 80), C (>= 70), D (>= 60), F (< 60).\n   - Identifies the highest-scoring student ("valedictorian").\n   - Returns a structured dictionary containing summary metrics and per-student grade cards.\n\n2. **Documentation & Error Handling**:\n   - Handle empty inputs gracefully.\n   - Provide clean docstrings and comments explaining your algorithmic steps.`,
    learningObjectives: [
      'Master dictionary and list manipulations in Python',
      'Implement conditional grading thresholds and statistical aggregations',
      'Write clean, modular code with exception resilience'
    ],
    deliverables: [
      'Complete Python script containing `process_grades()` and helper functions',
      'Written design explanation covering complexity and edge case handling'
    ],
    submissionType: 'hybrid',
    starterTemplate: {
      code: `def process_grades(student_data):\n    """\n    Processes student exam scores and returns summary analytics & letter grades.\n    :param student_data: dict of {student_name: [scores]}\n    :return: dict with class_average, top_student, and student_reports\n    """\n    if not student_data:\n        return {"class_average": 0, "top_student": None, "reports": {}}\n        \n    reports = {}\n    total_class_score = 0\n    total_scores_count = 0\n    top_student = None\n    top_avg = -1\n    \n    # Implement your calculation logic here\n    \n    return {\n        "class_average": 0,\n        "top_student": top_student,\n        "reports": reports\n    }\n`,
      writtenTemplate: `### Solution Architecture & Design Decisions\n\n1. **Data Structures Chosen:**\n   - Explain why dictionaries/lists were used...\n\n2. **Complexity Analysis:**\n   - Time Complexity: O(...)\n   - Space Complexity: O(...)\n\n3. **Edge Case Handling:**\n   - How are students with no scores or empty dictionaries handled?`
    },
    rubric: [
      { criteria: 'Correctness & Grade Calculation', maxPoints: 40, description: 'Accurate averages, grade thresholds, and top student identification.' },
      { criteria: 'Code Quality & Modularity', maxPoints: 25, description: 'Clean naming conventions, PEP 8 styling, and helper decomposition.' },
      { criteria: 'Edge Case & Exception Handling', maxPoints: 20, description: 'Resilience against empty dictionaries, zero scores, and missing keys.' },
      { criteria: 'Documentation & Written Analysis', maxPoints: 15, description: 'Clarity of the algorithmic explanation and complexity breakdown.' }
    ],
    evaluationRules: [
      { testName: 'Function Definition', weight: 20, checkType: 'keyword', pattern: 'def process_grades', feedback: 'Correct function header structure.' },
      { testName: 'Loop / Iteration Logic', weight: 20, checkType: 'keyword', pattern: 'for ', feedback: 'Iterates through student records.' },
      { testName: 'Grade Threshold Checks', weight: 20, checkType: 'keyword', pattern: '90', feedback: 'Includes threshold validations.' },
      { testName: 'Written Explanation Length', weight: 20, checkType: 'length', pattern: '100', feedback: 'Sufficient design document depth.' },
      { testName: 'Dictionary / Return Structure', weight: 20, checkType: 'keyword', pattern: 'return', feedback: 'Proper dictionary return statement.' }
    ],
    order: 1
  },
  {
    title: 'Assignment 2 — Custom LRU Cache Data Structure',
    code: 'asgn_py_lru_cache',
    studyRole: 'programming',
    courseId: 'prog_python',
    moduleLevel: 2,
    category: 'Object-Oriented Programming & Systems',
    totalPoints: 100,
    difficulty: 'Intermediate',
    estimatedDays: 4,
    dueDateDays: 10,
    description: 'Implement a Least Recently Used (LRU) Cache class supporting get(key) and put(key, value) in O(1) time complexity using Doubly Linked Lists and Hash Maps.',
    problemStatement: `### Problem Overview\nBuild a high-performance **LRU Cache** memory system.\n\n### Class API:\n- \`LRUCache(capacity: int)\`: Initialize cache with positive capacity.\n- \`get(key: int) -> int\`: Return the value if key exists; otherwise return \`-1\`. Moves accessed key to most recently used position.\n- \`put(key: int, value: int) -> None\`: Update or insert key-value pair. If capacity exceeded, evict the least recently used key.`,
    learningObjectives: [
      'Understand caching policies and eviction algorithms',
      'Implement Doubly Linked Lists combined with Hash Maps for O(1) operations'
    ],
    deliverables: ['LRUCache class implementation with unit test cases'],
    submissionType: 'hybrid',
    starterTemplate: {
      code: `class Node:\n    def __init__(self, key=0, val=0):\n        self.key = key\n        self.val = val\n        self.prev = None\n        self.next = None\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = {}\n        # Sentinel head and tail nodes\n        self.head = Node()\n        self.tail = Node()\n        self.head.next = self.tail\n        self.tail.prev = self.head\n\n    def get(self, key: int) -> int:\n        # Implement O(1) get\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        # Implement O(1) put and eviction\n        pass\n`,
      writtenTemplate: `### LRU Cache Architecture\n\n1. **Why Doubly Linked List + Hash Map?**\n   - \n2. **Time Complexity Proof:**\n   - get(): O(1) because...\n   - put(): O(1) because...`
    },
    rubric: [
      { criteria: 'O(1) Get & Put Implementation', maxPoints: 50, description: 'Correct constant-time cache hits and insertions.' },
      { criteria: 'Eviction Correctness', maxPoints: 30, description: 'Accurately drops the least recently used node when capacity is full.' },
      { criteria: 'Design Analysis & Complexity Proof', maxPoints: 20, description: 'Clear mathematical explanation of pointer operations.' }
    ],
    evaluationRules: [
      { testName: 'Class Structure', weight: 25, checkType: 'keyword', pattern: 'class LRUCache', feedback: 'LRUCache class defined.' },
      { testName: 'Get Method', weight: 25, checkType: 'keyword', pattern: 'def get', feedback: 'get method defined.' },
      { testName: 'Put Method', weight: 25, checkType: 'keyword', pattern: 'def put', feedback: 'put method defined.' },
      { testName: 'Linked List Pointers', weight: 25, checkType: 'keyword', pattern: 'self.head', feedback: 'Linked list sentinel nodes utilized.' }
    ],
    order: 2
  },

  // =========================================================================
  // 2. COLLEGE PATH ASSIGNMENTS (B.Tech Computer Science)
  // =========================================================================
  {
    title: 'Assignment 1 — CPU Process Scheduling Simulator (FCFS & Round Robin)',
    code: 'asgn_coll_os_scheduler',
    studyRole: 'college',
    courseId: 'coll_btech_cse',
    moduleLevel: 1,
    category: 'Operating Systems & Concurrency',
    totalPoints: 100,
    difficulty: 'Intermediate',
    estimatedDays: 5,
    dueDateDays: 8,
    description: 'Simulate CPU process scheduling algorithms (First Come First Serve and Round Robin with Time Quantum) and compute Average Waiting Time (AWT) and Average Turnaround Time (TAT).',
    problemStatement: `### Problem Overview\nOperating system process schedulers optimize CPU utilization and fairness.\n\n### Task Requirements:\n1. Implement \`schedule_fcfs(processes)\` where each process has \`[pid, arrival_time, burst_time]\`.\n2. Implement \`schedule_round_robin(processes, time_quantum)\`.\n3. Return a comprehensive breakdown of Completion Time, Turnaround Time ($TAT = CT - AT$), and Waiting Time ($WT = TAT - BT$).`,
    learningObjectives: [
      'Analyze preemptive vs non-preemptive scheduling algorithms',
      'Compute OS performance metrics (throughput, average waiting time)'
    ],
    deliverables: ['Scheduler python module with test benchmarks', 'Comparative analysis writeup'],
    submissionType: 'hybrid',
    starterTemplate: {
      code: `def schedule_fcfs(processes):\n    # processes format: [{"pid": "P1", "arrival": 0, "burst": 5}, ...]\n    # Calculate CT, TAT, WT and return summary dictionary\n    pass\n\ndef schedule_round_robin(processes, time_quantum):\n    # Implement Round Robin queue simulator\n    pass\n`,
      writtenTemplate: `### Operating System Process Scheduling Comparison\n\n1. **FCFS Characteristics & Convoy Effect:**\n   - Discuss the impact of long CPU burst processes...\n\n2. **Round Robin Optimization:**\n   - How does Time Quantum selection affect context switching overhead vs responsiveness?`
    },
    rubric: [
      { criteria: 'FCFS Simulation Correctness', maxPoints: 35, description: 'Accurate timeline and metric calculations.' },
      { criteria: 'Round Robin Queue Handling', maxPoints: 40, description: 'Proper queue rotation and time slicing.' },
      { criteria: 'Comparative Written Report', maxPoints: 25, description: 'Thorough discussion of scheduling trade-offs.' }
    ],
    evaluationRules: [
      { testName: 'FCFS Definition', weight: 30, checkType: 'keyword', pattern: 'def schedule_fcfs', feedback: 'FCFS scheduler function defined.' },
      { testName: 'Round Robin Definition', weight: 35, checkType: 'keyword', pattern: 'def schedule_round_robin', feedback: 'Round Robin scheduler function defined.' },
      { testName: 'Written Comparison', weight: 35, checkType: 'length', pattern: '80', feedback: 'Comprehensive OS comparison text.' }
    ],
    order: 1
  },

  // =========================================================================
  // 3. DIPLOMA PATH ASSIGNMENTS
  // =========================================================================
  {
    title: 'Assignment 1 — Digital Logic Gate Simulator & Truth Table Generator',
    code: 'asgn_dip_logic_gates',
    studyRole: 'diploma',
    courseId: 'dip_computer_eng',
    moduleLevel: 1,
    category: 'Digital Electronics & Logic Design',
    totalPoints: 100,
    difficulty: 'Beginner',
    estimatedDays: 3,
    dueDateDays: 7,
    description: 'Build a software simulator for basic logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR) and generate truth tables for compound boolean expressions.',
    problemStatement: `### Problem Overview\nDigital computers perform computations through interconnected logic gates.\n\n### Requirements:\n1. Implement gate functions: \`gate_and(a, b)\`, \`gate_or(a, b)\`, \`gate_not(a)\`, \`gate_nand(a, b)\`, \`gate_xor(a, b)\`.\n2. Write \`generate_truth_table(expression_func)\` to evaluate and print all combinations of 2 or 3 inputs.`,
    learningObjectives: [
      'Master boolean algebra fundamentals',
      'Understand functional simulation of digital electronic circuits'
    ],
    deliverables: ['Logic gates simulation script', 'Truth table output verification'],
    submissionType: 'hybrid',
    starterTemplate: {
      code: `def gate_and(a, b):\n    return int(bool(a and b))\n\ndef gate_or(a, b):\n    return int(bool(a or b))\n\ndef gate_not(a):\n    return int(not bool(a))\n\ndef gate_nand(a, b):\n    # Implement NAND\n    pass\n\ndef gate_xor(a, b):\n    # Implement XOR\n    pass\n\ndef generate_truth_table():\n    # Generate full truth table for 2-input XOR & NAND\n    pass\n`,
      writtenTemplate: `### Digital Electronics Circuit Analysis\n\n1. **Universal Gates:**\n   - Explain why NAND and NOR are known as universal gates...\n\n2. **De Morgan's Laws:**\n   - State both laws and demonstrate how they simplify circuits.`
    },
    rubric: [
      { criteria: 'Logic Gate Implementations', maxPoints: 50, description: 'All gate functions produce accurate binary outputs.' },
      { criteria: 'Truth Table Generation', maxPoints: 30, description: 'Systematically evaluates all $2^N$ input vectors.' },
      { criteria: 'Boolean Theory Analysis', maxPoints: 20, description: 'Accurate writeup on universal gates and De Morgan laws.' }
    ],
    evaluationRules: [
      { testName: 'Gate Functions', weight: 40, checkType: 'keyword', pattern: 'def gate_nand', feedback: 'NAND gate function present.' },
      { testName: 'XOR Function', weight: 30, checkType: 'keyword', pattern: 'def gate_xor', feedback: 'XOR gate function present.' },
      { testName: 'Written Theory', weight: 30, checkType: 'length', pattern: '60', feedback: 'Theory explanation provided.' }
    ],
    order: 1
  },

  // =========================================================================
  // 4. SCHOOL PATH ASSIGNMENTS
  // =========================================================================
  {
    title: 'Assignment 1 — Class 1: My Number Journey & Drawing Shapes',
    code: 'asgn_school_c1_shapes',
    studyRole: 'school',
    courseId: 'school_class_1',
    moduleLevel: 1,
    category: 'Class 1 Foundation Math',
    totalPoints: 100,
    difficulty: 'Beginner',
    estimatedDays: 2,
    dueDateDays: 5,
    description: 'A fun foundational project: Count objects in your room (toys, books, pencils), identify shapes around you (Circle, Square, Triangle), and solve simple additions!',
    problemStatement: `### Problem Overview 🎒\nWelcome to your First Standard Discovery Project!\n\n### Requirements:\n1. Count 5 items in your house (e.g. 4 spoons, 2 balls, 3 books).\n2. Write down 3 shapes you can see around you (like a round clock or a square window).\n3. Solve basic addition: $2 + 3 = ?$, $4 + 1 = ?$, $5 + 5 = ?$.\n4. Write a simple Python function \`add_numbers(a, b)\` that returns \`a + b\`.`,
    learningObjectives: [
      'Recognize and count everyday objects from 1 to 20',
      'Identify geometric shapes in nature and household items',
      'Perform single-digit addition with confidence'
    ],
    deliverables: ['Simple addition function', 'Written answer describing counted objects and shapes'],
    submissionType: 'hybrid',
    starterTemplate: {
      code: `def add_numbers(a, b):\n    # Return the sum of a and b\n    return a + b\n`,
      writtenTemplate: `### Class 1: My Shapes & Numbers Report\n\n1. **Objects I Counted at Home:**\n   - Apples: 3\n   - Pencils: 5\n   - Toy cars: 2\n\n2. **Shapes I Found:**\n   - Circle: Wall clock ⏰\n   - Square: Table top 🔲\n   - Rectangle: Storybook 📖\n\n3. **Addition Answers:**\n   - 2 + 3 = 5\n   - 4 + 1 = 5\n   - 5 + 5 = 10`
    },
    rubric: [
      { criteria: 'Counting & Shape Recognition', maxPoints: 50, description: 'Accurate count of objects and proper shape identification.' },
      { criteria: 'Addition Function Accuracy', maxPoints: 30, description: 'add_numbers function correctly adds two inputs.' },
      { criteria: 'Neatness & Thoughtfulness', maxPoints: 20, description: 'Clean, well-structured response.' }
    ],
    evaluationRules: [
      { testName: 'Addition Function', weight: 40, checkType: 'keyword', pattern: 'def add_numbers', feedback: 'Addition function implemented.' },
      { testName: 'Return Statement', weight: 30, checkType: 'keyword', pattern: 'return', feedback: 'Return statement present.' },
      { testName: 'Written Answers', weight: 30, checkType: 'length', pattern: '40', feedback: 'Written shape and counting report included.' }
    ],
    order: 1
  },
  {
    title: 'Assignment 2 — Physics Projectile Motion & Trajectory Calculator',
    code: 'asgn_school_projectile',
    studyRole: 'school',
    courseId: 'school_class_10',
    moduleLevel: 1,
    category: 'Kinematics & Mechanics',
    totalPoints: 100,
    difficulty: 'Intermediate',
    estimatedDays: 3,
    dueDateDays: 7,
    description: 'Calculate maximum height, total flight time, horizontal range, and impact velocity for a projectile launched at initial velocity $v_0$ and angle $\\theta$.',
    problemStatement: `### Problem Overview\nIn 2D projectile motion under constant gravitational acceleration ($g = 9.8 m/s^2$):\n\n### Formulas:\n- Maximum Height: $H = \\frac{(v_0 \\sin\\theta)^2}{2g}$\n- Time of Flight: $T = \\frac{2 v_0 \\sin\\theta}{g}$\n- Range: $R = \\frac{v_0^2 \\sin(2\\theta)}{g}$\n\n### Deliverables:\nWrite \`calculate_trajectory(v0, angle_degrees)\` returning rounded metrics in a dictionary.`,
    learningObjectives: [
      'Apply trigonometric vector decomposition in physics',
      'Convert mathematical formulas into robust computer programs'
    ],
    deliverables: ['Projectile calculator function', 'Brief explanation of maximum range angle'],
    submissionType: 'hybrid',
    starterTemplate: {
      code: `import math\n\ndef calculate_trajectory(v0, angle_degrees):\n    g = 9.8\n    rad = math.radians(angle_degrees)\n    # Compute max_height, flight_time, and range\n    return {\n        "max_height": 0.0,\n        "flight_time": 0.0,\n        "range": 0.0\n    }\n`,
      writtenTemplate: `### Physics Theoretical Analysis\n\n1. **Optimal Angle for Maximum Range:**\n   - Prove why $\\theta = 45^\\circ$ yields the maximum horizontal range...\n\n2. **Energy Conservation:**\n   - Explain how Kinetic Energy and Potential Energy transform along the parabolic flight path.`
    },
    rubric: [
      { criteria: 'Formula Accuracy', maxPoints: 50, description: 'Accurate conversion of degrees and kinematic equations.' },
      { criteria: 'Result Formatting', maxPoints: 25, description: 'Proper dictionary packaging with rounded numeric values.' },
      { criteria: 'Physics Proof & Explanation', maxPoints: 25, description: 'Clear mathematical proof for the 45-degree angle.' }
    ],
    evaluationRules: [
      { testName: 'Trajectory Function', weight: 40, checkType: 'keyword', pattern: 'def calculate_trajectory', feedback: 'Trajectory function present.' },
      { testName: 'Trig Math Calls', weight: 30, checkType: 'keyword', pattern: 'math.sin', feedback: 'Trigonometric functions used correctly.' },
      { testName: 'Physics Writeup', weight: 30, checkType: 'length', pattern: '60', feedback: 'Theoretical writeup included.' }
    ],
    order: 2
  }
];

export const seedTasksAndAssignmentsDatabase = async () => {
  try {
    if (inMemoryStore.isInMemory) {
      inMemoryStore.tasks = [...INITIAL_TASKS];
      inMemoryStore.taskSubmissions = [];
      inMemoryStore.assignments = [...INITIAL_ASSIGNMENTS];
      inMemoryStore.assignmentSubmissions = [];
      console.log(`[In-Memory Seeded]: ${INITIAL_TASKS.length} Interactive Tasks & ${INITIAL_ASSIGNMENTS.length} Course Assignments loaded.`);
      return;
    }

    // MongoDB Mode: Upsert tasks
    for (const taskData of INITIAL_TASKS) {
      await Task.findOneAndUpdate(
        { code: taskData.code },
        taskData,
        { upsert: true, new: true }
      );
    }

    // Upsert assignments
    for (const asgnData of INITIAL_ASSIGNMENTS) {
      await Assignment.findOneAndUpdate(
        { code: asgnData.code },
        asgnData,
        { upsert: true, new: true }
      );
    }

    console.log(`[MongoDB Seeded]: ${INITIAL_TASKS.length} Tasks & ${INITIAL_ASSIGNMENTS.length} Assignments successfully synced.`);
  } catch (error) {
    console.error('Error seeding tasks and assignments:', error.message);
  }
};
