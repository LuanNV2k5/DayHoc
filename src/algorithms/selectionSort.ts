import {
  CodeLine,
  SelectionTraceRow,
  SnapshotState,
} from '../types';

export const SELECTION_SORT_CODE: CodeLine[] = [
  { lineNum: 1, code: 'def SelectionSort(A):', indent: 0 },
  { lineNum: 2, code: '    n = len(A)', indent: 1 },
  { lineNum: 3, code: '    for i in range(n-1):', indent: 1 },
  { lineNum: 4, code: '        iMin = i', indent: 2 },
  { lineNum: 5, code: '        for j in range(i+1, n):', indent: 2 },
  { lineNum: 6, code: '            if A[j] < A[iMin]:', indent: 3 },
  { lineNum: 7, code: '                iMin = j', indent: 4 },
  { lineNum: 8, code: '        A[i], A[iMin] = A[iMin], A[i]', indent: 2 },
];

export function generateSelectionSortSnapshots(initialArray: number[]): {
  snapshots: SnapshotState[];
  traceRows: SelectionTraceRow[];
} {
  const snapshots: SnapshotState[] = [];
  const traceRows: SelectionTraceRow[] = [];
  const A = [...initialArray];
  const elementIds = initialArray.map((_, idx) => idx);
  const n = A.length;
  let stepId = 0;

  // Initial step - Line 2
  snapshots.push({
    id: stepId++,
    algorithm: 'selection',
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
    variables: { n, i: null, j: null, iMin: null, a_iMin: null },
    explanation: {
      title: 'Khởi tạo thuật toán',
      stepDetail: `Xác định độ dài dãy n = ${n}. Ban đầu toàn bộ dãy A[0..${n - 1}] chưa được sắp xếp.`,
      outerLoopInfo: 'Chưa vào vòng lặp',
      actionResult: 'Sẵn sàng duyệt i từ 0 đến n - 2 để đặt phần tử nhỏ nhất vào từng vị trí đầu đoạn.',
      pedagogicalTip: 'Ý tưởng cốt lõi: Mỗi vòng lặp tìm phần tử nhỏ nhất của đoạn chưa sắp xếp, sau đó chỉ đổi chỗ 1 lần duy nhất với A[i].',
    },
    isOuterLoopEnd: false,
  });

  for (let i = 0; i < n - 1; i++) {
    // Step: for i in range(n-1) - Line 3
    snapshots.push({
      id: stepId++,
      algorithm: 'selection',
      array: [...A],
      elementIds: [...elementIds],
      codeLine: 3,
      actionType: 'start_outer',
      sortedIndices: Array.from({ length: i }, (_, idx) => idx),
      comparedIndices: [],
      swappingIndices: [],
      swapDetail: null,
      shiftingIndex: null,
      targetSlotIndex: null,
      selectedIndices: [i],
      liftedValue: null,
      variables: { n, i, j: null, iMin: null, a_iMin: null },
      explanation: {
        title: `Bắt đầu vòng ngoài i = ${i}`,
        stepDetail: `Cần tìm phần tử nhỏ nhất trong đoạn chưa sắp xếp A[${i}..${n - 1}] để đưa về vị trí A[${i}].`,
        outerLoopInfo: `Vòng ngoài: i = ${i}`,
        actionResult: `Chuẩn bị gán giả định phần tử nhỏ nhất ban đầu là A[${i}].`,
      },
      isOuterLoopEnd: false,
    });

    // Step: iMin = i - Line 4
    let iMin = i;
    snapshots.push({
      id: stepId++,
      algorithm: 'selection',
      array: [...A],
      elementIds: [...elementIds],
      codeLine: 4,
      actionType: 'init_inner',
      sortedIndices: Array.from({ length: i }, (_, idx) => idx),
      comparedIndices: [],
      swappingIndices: [],
      swapDetail: null,
      shiftingIndex: null,
      targetSlotIndex: null,
      selectedIndices: [iMin],
      liftedValue: null,
      variables: { n, i, j: null, iMin, a_iMin: A[iMin] },
      explanation: {
        title: `Giả định ban đầu: iMin = ${i}`,
        stepDetail: `Gán iMin = i = ${i}. Tạm thời coi phần tử tại vị trí ${i} (giá trị ${A[iMin]}) là nhỏ nhất đoạn.`,
        outerLoopInfo: `Vòng ngoài: i = ${i}`,
        actionResult: `iMin = ${i}, A[iMin] = ${A[iMin]}.`,
      },
      isOuterLoopEnd: false,
    });

    const unsortedDesc = `A[${i}..${n - 1}] = [${A.slice(i).join(', ')}]`;

    // Inner loop: for j in range(i+1, n) - Lines 5, 6, 7
    for (let j = i + 1; j < n; j++) {
      // Step: compare if A[j] < A[iMin] - Line 6
      const isSmaller = A[j] < A[iMin];

      snapshots.push({
        id: stepId++,
        algorithm: 'selection',
        array: [...A],
        elementIds: [...elementIds],
        codeLine: 6,
        actionType: 'compare',
        sortedIndices: Array.from({ length: i }, (_, idx) => idx),
        comparedIndices: [j, iMin],
        swappingIndices: [],
        swapDetail: null,
        shiftingIndex: null,
        targetSlotIndex: null,
        selectedIndices: [iMin, j],
        liftedValue: null,
        variables: { n, i, j, iMin, a_iMin: A[iMin] },
        explanation: {
          title: `So sánh A[${j}] và A[iMin=${iMin}]`,
          stepDetail: `So sánh giá trị đang duyệt A[${j}] = ${A[j]} với giá trị nhỏ nhất hiện tại A[${iMin}] = ${A[iMin]}.`,
          outerLoopInfo: `Vòng ngoài: i = ${i}`,
          innerLoopInfo: `Vòng trong: j = ${j} (quét tìm min)`,
          comparison: {
            leftText: `A[${j}]`,
            leftVal: A[j],
            op: '<',
            rightText: `A[iMin=${iMin}]`,
            rightVal: A[iMin],
            result: isSmaller,
            actionText: isSmaller
              ? `A[${j}] = ${A[j]} < A[${iMin}] = ${A[iMin]} (ĐÚNG) → Cập nhật iMin mới = ${j}`
              : `A[${j}] = ${A[j]} >= A[${iMin}] = ${A[iMin]} (SAI) → Giữ nguyên iMin = ${iMin}`,
          },
          actionResult: isSmaller
            ? `Phát hiện phần tử nhỏ hơn: ${A[j]} < ${A[iMin]}. Sẽ cập nhật iMin = ${j}.`
            : `Không nhỏ hơn: ${A[j]} >= ${A[iMin]}. Giữ nguyên iMin = ${iMin}.`,
          pedagogicalTip: 'Quy tắc: Khi gặp số nhỏ hơn chỉ ghi nhận chỉ số iMin mới, TUYỆT ĐỐI KHÔNG đổi chỗ ngay!',
        },
        isOuterLoopEnd: false,
      });

      // Step: if isSmaller, update iMin = j - Line 7
      if (isSmaller) {
        iMin = j;
        snapshots.push({
          id: stepId++,
          algorithm: 'selection',
          array: [...A],
          elementIds: [...elementIds],
          codeLine: 7,
          actionType: 'update_pointer',
          sortedIndices: Array.from({ length: i }, (_, idx) => idx),
          comparedIndices: [],
          swappingIndices: [],
          swapDetail: null,
          shiftingIndex: null,
          targetSlotIndex: null,
          selectedIndices: [iMin],
          liftedValue: null,
          variables: { n, i, j, iMin, a_iMin: A[iMin] },
          explanation: {
            title: `Cập nhật: iMin = ${j}`,
            stepDetail: `Gán iMin = ${j}. Giá trị nhỏ nhất hiện thời của đoạn chưa sắp xếp chuyển sang ${A[iMin]} tại vị trí ${iMin}.`,
            outerLoopInfo: `Vòng ngoài: i = ${i}`,
            innerLoopInfo: `Vòng trong: j = ${j}`,
            actionResult: `iMin mới = ${iMin} (giá trị A[iMin] = ${A[iMin]}).`,
          },
          isOuterLoopEnd: false,
        });
      }
    }

    // Step: A[i], A[iMin] = A[iMin], A[i] - Line 8
    const needSwap = i !== iMin;
    const oldAi = A[i];
    const oldAim = A[iMin];
    const swapText = needSwap ? `Đổi chỗ A[${i}]=${oldAi} và A[${iMin}]=${oldAim}` : `Không đổi (iMin=${iMin} trùng i=${i})`;

    // Pre-swap / Swap snapshot
    if (needSwap) {
      const temp = A[i];
      A[i] = A[iMin];
      A[iMin] = temp;

      const tempId = elementIds[i];
      elementIds[i] = elementIds[iMin];
      elementIds[iMin] = tempId;
    }

    snapshots.push({
      id: stepId++,
      algorithm: 'selection',
      array: [...A],
      elementIds: [...elementIds],
      codeLine: 8,
      actionType: needSwap ? 'swap' : 'no_swap',
      sortedIndices: Array.from({ length: i + 1 }, (_, idx) => idx),
      comparedIndices: [],
      swappingIndices: needSwap ? [i, iMin] : [],
      swapDetail: needSwap ? { idx1: i, idx2: iMin, val1: oldAi, val2: oldAim } : null,
      shiftingIndex: null,
      targetSlotIndex: null,
      selectedIndices: [i],
      liftedValue: null,
      variables: { n, i, j: n, iMin, a_iMin: A[iMin] },
      explanation: {
        title: needSwap ? `Đang đổi chỗ A[${i}] ⮂ A[${iMin}] (${oldAi} ⮂ ${oldAim})` : `Không cần đổi chỗ A[${i}]`,
        stepDetail: needSwap
          ? `Đã quét xong đoạn chưa sắp xếp. Phần tử nhỏ nhất là ${oldAim} tại ô ${iMin}. Hoán đổi vị trí hai cột: ${oldAim} trượt về A[${i}], ${oldAi} chuyển sang A[${iMin}].`
          : `Đã quét hết đoạn chưa sắp xếp. Phần tử nhỏ nhất đã ở sẵn vị trí A[${i}] = ${oldAi}. Không cần đổi chỗ.`,
        outerLoopInfo: `Vòng ngoài: i = ${i}`,
        actionResult: needSwap
          ? `Đổi chỗ thành công: Đưa số nhỏ nhất ${oldAim} về vị trí A[${i}].`
          : `Giữ nguyên vị trí A[${i}] = ${oldAi}.`,
        pedagogicalTip: 'Quy tắc vàng của Selection Sort: "TÌM HẾT → CHỌN NHỎ NHẤT → ĐỔI CHỖ 1 LẦN".',
      },
      isOuterLoopEnd: true,
      loopEndQuestion: {
        loopIndex: i,
        takeaway: `Phần tử nhỏ nhất của đoạn chưa sắp (${A[i]}) đã được đặt đúng vào vị trí A[${i}].`,
        arrayState: [...A],
      },
    });

    // Trace row for selection sort
    traceRows.push({
      loopIndex: i,
      unsortedRange: unsortedDesc,
      iMin,
      minValue: needSwap ? oldAim : A[i],
      swappedWith: swapText,
      arrayAfter: [...A],
      snapshotId: snapshots.length - 1,
    });
  }

  // Final completion step: last element A[n-1] is automatically in place
  snapshots.push({
    id: stepId++,
    algorithm: 'selection',
    array: [...A],
    elementIds: [...elementIds],
    codeLine: 8,
    actionType: 'finished',
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
    comparedIndices: [],
    swappingIndices: [],
    swapDetail: null,
    shiftingIndex: null,
    targetSlotIndex: null,
    selectedIndices: [],
    liftedValue: null,
    variables: { n, i: n - 1, j: null, iMin: null, a_iMin: null },
    explanation: {
      title: 'Thuật toán hoàn tất!',
      stepDetail: `Đã duyệt xong n - 1 = ${n - 1} vòng. Phần tử cuối cùng A[${n - 1}] = ${A[n - 1]} đương nhiên lớn nhất và đứng đúng vị trí.`,
      outerLoopInfo: 'Hoàn tất',
      actionResult: `Dãy kết quả đã sắp xếp: [${A.join(', ')}].`,
      pedagogicalTip: 'Lưu ý sư phạm: Selection Sort luôn thực hiện đúng n - 1 vòng lặp ngoài và chỉ tối đa 1 phép đổi chỗ mỗi vòng.',
    },
    isOuterLoopEnd: false,
  });

  return { snapshots, traceRows };
}
