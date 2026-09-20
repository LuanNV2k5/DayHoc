import {
  AlgorithmMeta,
  AlgorithmType,
  SnapshotState,
  TraceRow,
} from '../types';
import {
  BUBBLE_SORT_CODE,
  generateBubbleSortSnapshots,
} from './bubbleSort';
import {
  generateInsertionSortSnapshots,
  INSERTION_SORT_CODE,
} from './insertionSort';
import {
  generateSelectionSortSnapshots,
  SELECTION_SORT_CODE,
} from './selectionSort';

export const ALGORITHM_METAS: Record<AlgorithmType, AlgorithmMeta> = {
  insertion: {
    type: 'insertion',
    title: 'Sắp xếp chèn',
    englishName: 'Insertion Sort',
    lessonSection: 'Sắp xếp chèn',
    shortIdea:
      'Mở rộng dần đoạn bên trái đã có thứ tự. Lấy A[i] làm value, dịch các phần tử lớn hơn value sang phải và chèn value vào vị trí thích hợp.',
    textbookCode: INSERTION_SORT_CODE,
  },
  selection: {
    type: 'selection',
    title: 'Sắp xếp chọn',
    englishName: 'Selection Sort',
    lessonSection: 'Sắp xếp chọn',
    shortIdea:
      'Mỗi vòng tìm phần tử nhỏ nhất của đoạn chưa sắp xếp A[i..n-1]. Sau khi duyệt tìm xong mới đổi chỗ một lần duy nhất với A[i].',
    textbookCode: SELECTION_SORT_CODE,
  },
  bubble: {
    type: 'bubble',
    title: 'Sắp xếp nổi bọt',
    englishName: 'Bubble Sort',
    lessonSection: 'Sắp xếp nổi bọt',
    shortIdea:
      'So sánh hai phần tử kề nhau. Nếu sai thứ tự thì đổi chỗ. Sau mỗi vòng ngoài, phần tử lớn nhất của đoạn đang xét được đưa về cuối dãy.',
    textbookCode: BUBBLE_SORT_CODE,
  },
};

export const PRESET_ARRAYS: { label: string; array: number[]; note: string }[] = [
  { label: 'Mặc định [5, 3, 9, 7, 2]', array: [5, 3, 9, 7, 2], note: 'Dãy mẫu cơ bản 5 phần tử' },
  { label: 'Dãy [4, 1, 3, 2]', array: [4, 1, 3, 2], note: 'Dãy ngắn 4 phần tử' },
  { label: 'Đã sắp xếp sẵn [1, 2, 3, 4, 5]', array: [1, 2, 3, 4, 5], note: 'Dãy đã tăng dần' },
  { label: 'Giảm dần [5, 4, 3, 2, 1]', array: [5, 4, 3, 2, 1], note: 'Trường hợp ngược hoàn toàn (tối đa phép đổi/dịch)' },
  { label: 'Có số trùng [3, 1, 4, 1, 5]', array: [3, 1, 4, 1, 5], note: 'Kiểm tra với các giá trị trùng lặp' },
  { label: 'Dãy 7 số [8, 3, 5, 1, 9, 2, 6]', array: [8, 3, 5, 1, 9, 2, 6], note: 'Dãy dài hơn 7 phần tử' },
  { label: 'Dãy 9 số [5, 3, 9, 7, 2, 6, 9, 10, 1]', array: [5, 3, 9, 7, 2, 6, 9, 10, 1], note: 'Dãy 9 phần tử thử nghiệm co giãn kích thước' },
  { label: 'Dãy 11 số [12, 5, 8, 3, 15, 7, 2, 10, 6, 14, 4]', array: [12, 5, 8, 3, 15, 7, 2, 10, 6, 14, 4], note: 'Dãy 11 phần tử nhiều số' },
];

export function generateSnapshotsForAlgorithm(
  algorithm: AlgorithmType,
  array: number[]
): { snapshots: SnapshotState[]; traceRows: TraceRow[] } {
  switch (algorithm) {
    case 'insertion':
      return generateInsertionSortSnapshots(array);
    case 'selection':
      return generateSelectionSortSnapshots(array);
    case 'bubble':
      return generateBubbleSortSnapshots(array);
    default:
      return generateInsertionSortSnapshots(array);
  }
}
