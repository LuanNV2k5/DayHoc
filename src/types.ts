export type AlgorithmType = 'insertion' | 'selection' | 'bubble';

export interface CodeLine {
  lineNum: number;
  code: string;
  indent: number;
}

export type ActionType =
  | 'init'
  | 'start_outer'
  | 'pick_value'       // insertion sort: value = A[i]
  | 'init_inner'       // j = i - 1 or j = i + 1 or j = 0
  | 'check_condition'  // while or if condition check
  | 'shift'            // insertion: A[j+1] = A[j]
  | 'update_pointer'   // j = j - 1 or iMin = j
  | 'insert'           // insertion: A[j+1] = value
  | 'compare'          // bubble: A[j] > A[j+1], selection: A[j] < A[iMin]
  | 'swap'             // bubble / selection
  | 'no_swap'
  | 'end_inner'
  | 'end_outer'
  | 'finished';

export interface VariableState {
  i?: number | null;
  j?: number | null;
  iMin?: number | null;
  value?: number | null;
  a_iMin?: number | null;
  a_j?: number | null;
  a_j_plus_1?: number | null;
  n: number;
}

export interface ComparisonInfo {
  leftText: string;
  leftVal: number;
  op: '>' | '<' | '>=';
  rightText: string;
  rightVal: number;
  result: boolean;
  actionText: string;
}

export interface SnapshotState {
  id: number;
  algorithm: AlgorithmType;
  array: number[];              // Current array state in this step
  elementIds: number[];         // Stable identifiers for animated column layout swapping
  codeLine: number;             // 1-indexed line number in SGK code
  actionType: ActionType;
  
  // Highlighting & Visual indicators
  sortedIndices: number[];      // Indices known to be in sorted prefix/suffix
  comparedIndices: number[];    // Indices being compared e.g. [j, j+1] or [j, iMin]
  swappingIndices: number[];    // Indices undergoing swap
  swapDetail?: {
    idx1: number;
    idx2: number;
    val1: number;
    val2: number;
  } | null;
  shiftingIndex: number | null; // Index being shifted
  targetSlotIndex: number | null; // Empty slot or destination where shifted/inserted
  selectedIndices: number[];    // Selected element (e.g., value, i, iMin)
  
  // Specialized for Insertion sort
  liftedValue: {
    value: number;
    originalIndex: number;
    currentSlot: number;
  } | null;

  // Variables
  variables: VariableState;
  
  // Pedagogy explanation
  explanation: {
    title: string;
    stepDetail: string;
    outerLoopInfo: string;
    innerLoopInfo?: string;
    comparison?: ComparisonInfo;
    actionResult: string;
    pedagogicalTip?: string;
  };

  // Loop boundary marker
  isOuterLoopEnd: boolean;
  loopEndQuestion?: {
    loopIndex: number;
    takeaway: string;
    arrayState: number[];
  };
}

export interface InsertionTraceRow {
  loopIndex: number;          // i
  value: number;              // value
  shiftedElements: number[];  // các phần tử bị dịch
  insertPosition: number;     // vị trí chèn
  arrayAfter: number[];       // dãy sau vòng i
  snapshotId: number;         // step snapshot to jump to
}

export interface SelectionTraceRow {
  loopIndex: number;          // i
  unsortedRange: string;      // A[i..n-1]
  iMin: number;               // iMin
  minValue: number;           // A[iMin]
  swappedWith: string;        // Đổi chỗ A[i] và A[iMin]
  arrayAfter: number[];       // dãy sau vòng i
  snapshotId: number;         // step snapshot to jump to
}

export interface BubbleTraceRow {
  loopIndex: number;          // Vòng i
  swappedPairs: string[];     // Các cặp đã đổi chỗ ví dụ ["(5, 3)", "(9, 7)"]
  arrayAfter: number[];       // Dãy cuối vòng
  fixedRange: string;         // Vùng đã cố định ví dụ "A[4]" hoặc "A[3..4]"
  comparisonCount: number;    // Số lần so sánh
  snapshotId: number;         // step snapshot to jump to
}

export type TraceRow = InsertionTraceRow | SelectionTraceRow | BubbleTraceRow;

export interface AlgorithmMeta {
  type: AlgorithmType;
  title: string;
  englishName: string;
  lessonSection: string;
  shortIdea: string;
  textbookCode: CodeLine[];
}
