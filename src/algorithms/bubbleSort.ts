import {
  BubbleTraceRow,
  CodeLine,
  SnapshotState,
} from '../types';

export const BUBBLE_SORT_CODE: CodeLine[] = [
  { lineNum: 1, code: 'def BubbleSort(A):', indent: 0 },
  { lineNum: 2, code: '    n = len(A)', indent: 1 },
  { lineNum: 3, code: '    for i in range(n-1):', indent: 1 },
  { lineNum: 4, code: '        for j in range(n-1-i):', indent: 2 },
  { lineNum: 5, code: '            if A[j] > A[j+1]:', indent: 3 },
  { lineNum: 6, code: '                A[j], A[j+1] = A[j+1], A[j]', indent: 4 },
];

export function generateBubbleSortSnapshots(initialArray: number[]): {
  snapshots: SnapshotState[];
  traceRows: BubbleTraceRow[];
} {
  const snapshots: SnapshotState[] = [];
  const traceRows: BubbleTraceRow[] = [];
  const A = [...initialArray];
  const elementIds = initialArray.map((_, idx) => idx);
  const n = A.length;
  let stepId = 0;

  // Initial step - Line 2
  snapshots.push({
    id: stepId++,
    algorithm: 'bubble',
    array: [...A],
    elementIds: [...elementIds],
    codeLine: 2,
    actionType: 'init',
    sortedIndices: [],
    comparedIndices: [],
    swappingIndices: [],
    swapDetail: null,
    shiftingIndex: null,
    targetSlotIndex: null,
    selectedIndices: [],
    liftedValue: null,
    variables: { n, i: null, j: null, a_j: null, a_j_plus_1: null },
    explanation: {
      title: 'Khởi tạo thuật toán',
      stepDetail: `Xác định độ dài dãy n = ${n}. Ban đầu chưa có phần tử nào được cố định ở cuối dãy.`,
      outerLoopInfo: 'Chưa vào vòng lặp',
      actionResult: 'Sẵn sàng duyệt i từ 0 đến n - 2.',
      pedagogicalTip: 'Ý tưởng cốt lõi: So sánh liên tiếp hai phần tử kề nhau, nếu sai thứ tự thì đổi chỗ. Phần tử lớn nhất sẽ "nổi bọt" dần về cuối.',
    },
    isOuterLoopEnd: false,
  });

  const fixedIndices: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    const swappedPairsThisLoop: string[] = [];
    let comparisonsThisLoop = 0;

    // Step: for i in range(n-1) - Line 3
    snapshots.push({
      id: stepId++,
      algorithm: 'bubble',
      array: [...A],
      elementIds: [...elementIds],
      codeLine: 3,
      actionType: 'start_outer',
      sortedIndices: [...fixedIndices],
      comparedIndices: [],
      swappingIndices: [],
      swapDetail: null,
      shiftingIndex: null,
      targetSlotIndex: null,
      selectedIndices: [],
      liftedValue: null,
      variables: { n, i, j: null, a_j: null, a_j_plus_1: null },
      explanation: {
        title: `Bắt đầu vòng ngoài i = ${i}`,
        stepDetail: `Vòng lặp i = ${i}. Mục tiêu: Đưa phần tử lớn nhất trong đoạn A[0..${n - 1 - i}] về vị trí cuối đoạn A[${n - 1 - i}].`,
        outerLoopInfo: `Vòng ngoài: i = ${i}`,
        actionResult: `Vòng trong sẽ quét j từ 0 đến ${n - 2 - i}.`,
      },
      isOuterLoopEnd: false,
    });

    // Inner loop: for j in range(n-1-i) - Lines 4, 5, 6
    for (let j = 0; j < n - 1 - i; j++) {
      comparisonsThisLoop++;
      const isGreater = A[j] > A[j + 1];

      // Step: compare if A[j] > A[j+1] - Line 5
      snapshots.push({
        id: stepId++,
        algorithm: 'bubble',
        array: [...A],
        elementIds: [...elementIds],
        codeLine: 5,
        actionType: 'compare',
        sortedIndices: [...fixedIndices],
        comparedIndices: [j, j + 1],
        swappingIndices: [],
        swapDetail: null,
        shiftingIndex: null,
        targetSlotIndex: null,
        selectedIndices: [j, j + 1],
        liftedValue: null,
        variables: { n, i, j, a_j: A[j], a_j_plus_1: A[j + 1] },
        explanation: {
          title: `So sánh 2 phần tử kề nhau: A[${j}] và A[${j + 1}]`,
          stepDetail: `Xét cặp kề nhau: A[${j}] = ${A[j]} và A[${j + 1}] = ${A[j + 1]}.`,
          outerLoopInfo: `Vòng ngoài: i = ${i}`,
          innerLoopInfo: `Vòng trong: j = ${j}`,
          comparison: {
            leftText: `A[${j}]`,
            leftVal: A[j],
            op: '>',
            rightText: `A[${j + 1}]`,
            rightVal: A[j + 1],
            result: isGreater,
            actionText: isGreater
              ? `A[${j}] = ${A[j]} > A[${j + 1}] = ${A[j + 1]} (ĐÚNG) → Sai thứ tự, PHẢI ĐỔI CHỖ`
              : `A[${j}] = ${A[j]} <= A[${j + 1}] = ${A[j + 1]} (SAI) → Đúng thứ tự, GIỮ NGUYÊN`,
          },
          actionResult: isGreater
            ? `Cặp (${A[j]}, ${A[j + 1]}) sai thứ tự → Chuẩn bị đổi chỗ hai cột A[${j}] và A[${j + 1}].`
            : `Cặp (${A[j]}, ${A[j + 1]}) đã đúng thứ tự → Giữ nguyên, chuyển sang cặp tiếp theo.`,
          pedagogicalTip: 'Bubble sort luôn so sánh các cặp sát nhau (A[j] và A[j+1]).',
        },
        isOuterLoopEnd: false,
      });

      // Step: if A[j] > A[j+1], swap - Line 6
      if (isGreater) {
        swappedPairsThisLoop.push(`(${A[j]}, ${A[j + 1]})`);
        const valLeft = A[j];
        const valRight = A[j + 1];

        // Hoán đổi giá trị
        A[j] = valRight;
        A[j + 1] = valLeft;

        // Hoán đổi ID phần tử để Framer Motion di chuyển 2 cột
        const tempId = elementIds[j];
        elementIds[j] = elementIds[j + 1];
        elementIds[j + 1] = tempId;

        snapshots.push({
          id: stepId++,
          algorithm: 'bubble',
          array: [...A],
          elementIds: [...elementIds],
          codeLine: 6,
          actionType: 'swap',
          sortedIndices: [...fixedIndices],
          comparedIndices: [],
          swappingIndices: [j, j + 1],
          swapDetail: {
            idx1: j,
            idx2: j + 1,
            val1: valRight,
            val2: valLeft,
          },
          shiftingIndex: null,
          targetSlotIndex: null,
          selectedIndices: [j, j + 1],
          liftedValue: null,
          variables: { n, i, j, a_j: A[j], a_j_plus_1: A[j + 1] },
          explanation: {
            title: `Đang đổi chỗ A[${j}] ⮂ A[${j + 1}] (${valLeft} ⮂ ${valRight})`,
            stepDetail: `Hoán vị: Cột số ${valLeft} trượt sang phải vào vị trí A[${j + 1}], cột số ${valRight} trượt sang trái vào vị trí A[${j}].`,
            outerLoopInfo: `Vòng ngoài: i = ${i}`,
            innerLoopInfo: `Vòng trong: j = ${j}`,
            actionResult: `Đổi chỗ thành công: A[${j}] = ${A[j]}, A[${j + 1}] = ${A[j + 1]}.`,
            pedagogicalTip: 'Hiệu ứng nổi bọt: Số lớn hơn được đẩy dồn sang phải qua từng phép đổi chỗ liền kề.',
          },
          isOuterLoopEnd: false,
        });
      }
    }

    // End of outer loop i: element at (n - 1 - i) is now fixed in place
    const fixedIndex = n - 1 - i;
    fixedIndices.push(fixedIndex);
    fixedIndices.sort((a, b) => a - b);

    const fixedDesc =
      fixedIndices.length === 1
        ? `A[${fixedIndex}] = ${A[fixedIndex]}`
        : `A[${fixedIndices[0]}..${fixedIndices[fixedIndices.length - 1]}]`;

    snapshots.push({
      id: stepId++,
      algorithm: 'bubble',
      array: [...A],
      elementIds: [...elementIds],
      codeLine: 4,
      actionType: 'end_outer',
      sortedIndices: [...fixedIndices],
      comparedIndices: [],
      swappingIndices: [],
      swapDetail: null,
      shiftingIndex: null,
      targetSlotIndex: null,
      selectedIndices: [fixedIndex],
      liftedValue: null,
      variables: { n, i, j: null, a_j: null, a_j_plus_1: null },
      explanation: {
        title: `Kết thúc vòng ngoài i = ${i}`,
        stepDetail: `Hoàn tất vòng lặp ngoài i = ${i}. Phần tử lớn nhất của đoạn đang xét là ${A[fixedIndex]} đã nổi về đúng vị trí A[${fixedIndex}].`,
        outerLoopInfo: `Vòng ngoài: i = ${i}`,
        actionResult: `Cố định vị trí A[${fixedIndex}] = ${A[fixedIndex]}. Vùng cố định bên phải: [${fixedIndices.map((idx) => A[idx]).join(', ')}].`,
        pedagogicalTip: 'Đặc trưng Bubble Sort: Sau mỗi vòng ngoài, vùng đã sắp xếp cố định ở BÊN PHẢI tăng thêm 1 phần tử.',
      },
      isOuterLoopEnd: true,
      loopEndQuestion: {
        loopIndex: i,
        takeaway: `Phần tử ${A[fixedIndex]} đã ở đúng vị trí cuối dãy (ô A[${fixedIndex}]). Vùng bên phải này không cần xét lại trong các vòng tiếp theo.`,
        arrayState: [...A],
      },
    });

    // Record trace row
    traceRows.push({
      loopIndex: i,
      swappedPairs: [...swappedPairsThisLoop],
      arrayAfter: [...A],
      fixedRange: fixedDesc,
      comparisonCount: comparisonsThisLoop,
      snapshotId: snapshots.length - 1,
    });
  }

  // All sorted: element A[0] is also automatically in its place
  if (!fixedIndices.includes(0)) {
    fixedIndices.push(0);
    fixedIndices.sort((a, b) => a - b);
  }

  snapshots.push({
    id: stepId++,
    algorithm: 'bubble',
    array: [...A],
    elementIds: [...elementIds],
    codeLine: 6,
    actionType: 'finished',
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
    comparedIndices: [],
    swappingIndices: [],
    swapDetail: null,
    shiftingIndex: null,
    targetSlotIndex: null,
    selectedIndices: [],
    liftedValue: null,
    variables: { n, i: n - 1, j: null, a_j: null, a_j_plus_1: null },
    explanation: {
      title: 'Thuật toán hoàn tất!',
      stepDetail: `Đã hoàn thành n - 1 = ${n - 1} vòng lặp. Toàn bộ ${n} phần tử đã ở đúng vị trí thứ tự tăng dần.`,
      outerLoopInfo: 'Hoàn tất',
      actionResult: `Dãy kết quả: [${A.join(', ')}].`,
      pedagogicalTip: 'Ghi nhớ: Sắp xếp nổi bọt so sánh các cặp kề nhau, dồn số lớn về cuối dãy qua từng lượt lặp.',
    },
    isOuterLoopEnd: false,
  });

  return { snapshots, traceRows };
}
