import { SortingStep, CodePuzzle, CodeBlock } from './types'

// Bubble Sort Algorithm Steps Generator
export function generateBubbleSortSteps(initialArray: number[]): SortingStep[] {
  const steps: SortingStep[] = []
  const arr = [...initialArray]
  const n = arr.length
  const sorted: number[] = []

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    explanation: `Memulai Bubble Sort dengan array: [${arr.join(', ')}]. Kita akan membandingkan elemen berdekatan dan menukarnya jika urutannya salah.`
  })

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        explanation: `Iterasi ${i + 1}, Perbandingan ${j + 1}: Membandingkan ${arr[j]} dengan ${arr[j + 1]}.`
      })

      if (arr[j] > arr[j + 1]) {
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sorted],
          explanation: `${arr[j]} > ${arr[j + 1]}, maka tukar posisi!`
        })

        const temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp

        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [],
          sorted: [...sorted],
          explanation: `Setelah penukaran: [${arr.join(', ')}]`
        })
      } else {
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [],
          sorted: [...sorted],
          explanation: `${arr[j]} ≤ ${arr[j + 1]}, tidak perlu ditukar.`
        })
      }
    }
    sorted.push(n - i - 1)
  }

  sorted.push(0)
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    explanation: `Sorting selesai! Array terurut: [${arr.join(', ')}]`
  })

  return steps
}

// Selection Sort Algorithm Steps Generator
export function generateSelectionSortSteps(initialArray: number[]): SortingStep[] {
  const steps: SortingStep[] = []
  const arr = [...initialArray]
  const n = arr.length
  const sorted: number[] = []

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    explanation: `Memulai Selection Sort dengan array: [${arr.join(', ')}]. Kita akan mencari elemen terkecil dan menempatkannya di posisi yang benar.`
  })

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    
    steps.push({
      array: [...arr],
      comparing: [i],
      swapping: [],
      sorted: [...sorted],
      explanation: `Iterasi ${i + 1}: Mencari elemen terkecil dari indeks ${i} hingga ${n - 1}. Sementara minimum: ${arr[minIdx]} di indeks ${minIdx}.`
    })

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        comparing: [minIdx, j],
        swapping: [],
        sorted: [...sorted],
        explanation: `Membandingkan minimum sementara (${arr[minIdx]}) dengan elemen di indeks ${j} (${arr[j]}).`
      })

      if (arr[j] < arr[minIdx]) {
        minIdx = j
        steps.push({
          array: [...arr],
          comparing: [minIdx],
          swapping: [],
          sorted: [...sorted],
          explanation: `Ditemukan minimum baru: ${arr[minIdx]} di indeks ${minIdx}.`
        })
      }
    }

    if (minIdx !== i) {
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [i, minIdx],
        sorted: [...sorted],
        explanation: `Menukar ${arr[i]} dengan ${arr[minIdx]}.`
      })

      const temp = arr[i]
      arr[i] = arr[minIdx]
      arr[minIdx] = temp
    }

    sorted.push(i)
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      explanation: `Elemen di posisi ${i} sekarang terurut: [${arr.join(', ')}]`
    })
  }

  sorted.push(n - 1)
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    explanation: `Sorting selesai! Array terurut: [${arr.join(', ')}]`
  })

  return steps
}

// Bubble Sort Puzzles
export const bubbleSortPuzzles: CodePuzzle[] = [
  {
    id: 'bubble-1',
    question: 'Lengkapi kondisi untuk membandingkan dua elemen berdekatan:',
    codeTemplate: `for (let i = 0; i < n - 1; i++) {
  for (let j = 0; j < n - i - 1; j++) {
    if (arr[j] _BLANK_ arr[j + 1]) {
      // swap
    }
  }
}`,
    blanks: [
      {
        id: 'blank-1',
        position: 0,
        options: ['<', '>', '==', '>='],
        correctAnswer: '>'
      }
    ]
  },
  {
    id: 'bubble-2',
    question: 'Lengkapi kode untuk menukar dua elemen:',
    codeTemplate: `let temp = arr[j];
arr[j] = _BLANK_;
arr[j + 1] = temp;`,
    blanks: [
      {
        id: 'blank-1',
        position: 0,
        options: ['arr[j]', 'arr[j + 1]', 'temp', 'arr[i]'],
        correctAnswer: 'arr[j + 1]'
      }
    ]
  }
]

// Selection Sort Puzzles
export const selectionSortPuzzles: CodePuzzle[] = [
  {
    id: 'selection-1',
    question: 'Lengkapi kondisi untuk menemukan minimum baru:',
    codeTemplate: `for (let j = i + 1; j < n; j++) {
  if (arr[j] _BLANK_ arr[minIdx]) {
    minIdx = j;
  }
}`,
    blanks: [
      {
        id: 'blank-1',
        position: 0,
        options: ['<', '>', '==', '<='],
        correctAnswer: '<'
      }
    ]
  },
  {
    id: 'selection-2',
    question: 'Lengkapi kondisi untuk menukar elemen:',
    codeTemplate: `if (_BLANK_) {
  let temp = arr[i];
  arr[i] = arr[minIdx];
  arr[minIdx] = temp;
}`,
    blanks: [
      {
        id: 'blank-1',
        position: 0,
        options: ['minIdx == i', 'minIdx !== i', 'minIdx > i', 'minIdx < i'],
        correctAnswer: 'minIdx !== i'
      }
    ]
  }
]

// Code Arrangement Blocks
export const bubbleSortCodeBlocks: CodeBlock[] = [
  { id: '1', code: 'for (let i = 0; i < n - 1; i++) {', order: 1 },
  { id: '2', code: '  for (let j = 0; j < n - i - 1; j++) {', order: 2 },
  { id: '3', code: '    if (arr[j] > arr[j + 1]) {', order: 3 },
  { id: '4', code: '      let temp = arr[j];', order: 4 },
  { id: '5', code: '      arr[j] = arr[j + 1];', order: 5 },
  { id: '6', code: '      arr[j + 1] = temp;', order: 6 },
  { id: '7', code: '    }', order: 7 },
  { id: '8', code: '  }', order: 8 },
  { id: '9', code: '}', order: 9 },
]

export const selectionSortCodeBlocks: CodeBlock[] = [
  { id: '1', code: 'for (let i = 0; i < n - 1; i++) {', order: 1 },
  { id: '2', code: '  let minIdx = i;', order: 2 },
  { id: '3', code: '  for (let j = i + 1; j < n; j++) {', order: 3 },
  { id: '4', code: '    if (arr[j] < arr[minIdx]) {', order: 4 },
  { id: '5', code: '      minIdx = j;', order: 5 },
  { id: '6', code: '    }', order: 6 },
  { id: '7', code: '  }', order: 7 },
  { id: '8', code: '  [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];', order: 8 },
  { id: '9', code: '}', order: 9 },
]

// Shuffle array utility
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Generate random array for sorting visualization
export function generateRandomArray(size: number = 6, max: number = 50): number[] {
  const arr: number[] = []
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * max) + 1)
  }
  return arr
}
