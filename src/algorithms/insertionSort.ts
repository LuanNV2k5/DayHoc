import {
  CodeLine,
  InsertionTraceRow,
  SnapshotState,
} from '../types';

export const INSERTION_SORT_CODE: CodeLine[] = [
  { lineNum: 1, code: 'def InsertionSort(A):', indent: 0 },
  { lineNum: 2, code: '    n = len(A)', indent: 1 },
  { lineNum: 3, code: '    for i in range(1, n):', indent: 1 },
  { lineNum: 4, code: '        value = A[i]', indent: 2 },
  { lineNum: 5, code: '        j = i - 1', indent: 2 },
  { lineNum: 6, code: '        while j >= 0 and A[j] > value:', indent: 2 },
  { lineNum: 7, code: '            A[j+1] = A[j]', indent: 3 },
  { lineNum: 8, code: '            j = j - 1', indent: 3 },
  { lineNum: 9, code: '        A[j+1] = value', indent: 2 },
];

export function generateInsertionSortSnapshots(initialArray: number[]): {
  snapshots: SnapshotState[];
  traceRows: InsertionTraceRow[];
} {
  const snapshots: SnapshotState[] = [];
  const traceRows: InsertionTraceRow[] = [];
  const A = [...initialArray];
  const elementIds = initialArray.map((_, idx) => idx);
  const n = A.length;
  let stepId = 0;

  // Initial step - Line 1 & 2
  snapshots.push({
    id: stepId++,
    algorithm: 'insertion',
    array: [...A],
    elementIds: [...elementIds],
    codeLine: 2,
    actionType: 'init',
    sortedIndices: [0], // Initial single element is trivially sorted
    comparedIndices: [],
    swappingIndices: [],
    swapDetail: null,
    shiftingIndex: null,
    targetSlotIndex: null,
    selectedIndices: [],
    liftedValue: null,
    variables: { n, i: null, j: null, value: null },
    explanation: {
      title: 'Khởi tạo thuật toán',
      stepDetail: `Xác định độ dài dãy n = ${n}. Ban đầu coi phần tử đầu tiên A[0] = ${A[0]} là một dãy con đã có thứ tự.`,
      outerLoopInfo: 'Chưa vào vòng lặp',
      actionResult: 'Sẵn sàng duyệt các phần tử từ vị trí i = 1 đến n - 1.',
      pedagogicalTip: 'Ý tưởng cốt lõi: Mở rộng dần đoạn bên trái đã có thứ tự bằng cách chèn từng phần tử mới vào đúng vị trí.',
    },
    isOuterLoopEnd: false,
  });

  for (let i = 1; i < n; i++) {
    // Step: for i in range(1, n) - Line 3
    snapshots.push({
      id: stepId++,
      algorithm: 'insertion',
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
      variables: { n, i, j: null, value: null },
      explanation: {
        title: `Bắt đầu vòng lặp ngoài i = ${i}`,
        stepDetail: `Xét phần tử tại vị trí i = ${i} (giá trị hiện tại là ${A[i]}). Đoạn A[0..${i - 1}] bên trái đã có thứ tự.`,
        outerLoopInfo: `Vòng ngoài: i = ${i}`,
        actionResult: `Chuẩn bị lưu giá trị A[${i}] vào biến value để tìm vị trí chèn.`,
      },
      isOuterLoopEnd: false,
    });

    // Step: value = A[i] - Line 4
    const value = A[i];
    const valueId = elementIds[i];
    const shiftedElementsThisLoop: number[] = [];

    snapshots.push({
      id: stepId++,
      algorithm: 'insertion',
      array: [...A],
      elementIds: [...elementIds],
      codeLine: 4,
      actionType: 'pick_value',
      sortedIndices: Array.from({ length: i }, (_, idx) => idx),
      comparedIndices: [],
      swappingIndices: [],
      swapDetail: null,
      shiftingIndex: null,
      targetSlotIndex: i,
      selectedIndices: [i],
      liftedValue: {
        value,
        originalIndex: i,
        currentSlot: i,
      },
      variables: { n, i, j: null, value },
      explanation: {
        title: 'Nhấc phần tử cần chèn (value)',
        stepDetail: `Gán value = A[${i}] = ${value}. Nhấc phần tử này lên khỏi dãy để trống vị trí cho việc dịch chuyển.`,
        outerLoopInfo: `Vòng ngoài: i = ${i}`,
        actionResult: `Biến value = ${value}. Chuẩn bị so sánh value với các phần tử bên trái.`,
      },
      isOuterLoopEnd: false,
    });

    // Step: j = i - 1 - Line 5
    let j = i - 1;
    snapshots.push({
      id: stepId++,
      algorithm: 'insertion',
      array: [...A],
      elementIds: [...elementIds],
      codeLine: 5,
      actionType: 'init_inner',
      sortedIndices: Array.from({ length: i }, (_, idx) => idx),
      comparedIndices: [],
      swappingIndices: [],
      swapDetail: null,
      shiftingIndex: null,
      targetSlotIndex: i,
      selectedIndices: [j],
      liftedValue: {
        value,
        originalIndex: i,
        currentSlot: i,
      },
      variables: { n, i, j, value },
      explanation: {
        title: 'Khởi tạo con trỏ quét j',
        stepDetail: `Gán j = i - 1 = ${j}. Bắt đầu duyệt ngược từ vị trí ngay bên trái phần tử đang xét.`,
        outerLoopInfo: `Vòng ngoài: i = ${i}`,
        innerLoopInfo: `Con trỏ j = ${j}`,
        actionResult: `Chuẩn bị kiểm tra điều kiện vòng lặp while.`,
      },
      isOuterLoopEnd: false,
    });

    // Loop: while j >= 0 and A[j] > value - Line 6
    while (j >= 0) {
      const isGreater = A[j] > value;

      // Comparison snapshot
      snapshots.push({
        id: stepId++,
        algorithm: 'insertion',
        array: [...A],
        elementIds: [...elementIds],
        codeLine: 6,
        actionType: 'check_condition',
        sortedIndices: Array.from({ length: i }, (_, idx) => idx),
        comparedIndices: [j],
        swappingIndices: [],
        swapDetail: null,
        shiftingIndex: null,
        targetSlotIndex: j + 1,
        selectedIndices: [j],
        liftedValue: {
          value,
          originalIndex: i,
          currentSlot: j + 1,
        },
        variables: { n, i, j, value },
        explanation: {
          title: `Kiểm tra điều kiện: j >= 0 và A[j] > value`,
          stepDetail: `So sánh A[${j}] = ${A[j]} với value = ${value} (điều kiện j = ${j} >= 0: ĐÚNG).`,
          outerLoopInfo: `Vòng ngoài: i = ${i}`,
          innerLoopInfo: `Vòng trong: j = ${j}`,
          comparison: {
            leftText: `A[${j}]`,
            leftVal: A[j],
            op: '>',
            rightText: 'value',
            rightVal: value,
            result: isGreater,
            actionText: isGreater
              ? `A[${j}] = ${A[j]} > value = ${value} (ĐÚNG) → Phải dịch ${A[j]} sang phải`
              : `A[${j}] = ${A[j]} <= value = ${value} (SAI) → Dừng dịch, đã tìm thấy vị trí chèn`,
          },
          actionResult: isGreater
            ? `Điều kiện ĐÚNG: Cần dịch phần tử A[${j}] = ${A[j]} sang phải ô A[${j + 1}].`
            : `Điều kiện SAI: Kết thúc vòng while. Vị trí thích hợp để chèn value là A[${j + 1}].`,
        },
        isOuterLoopEnd: false,
      });

      if (!isGreater) {
        break;
      }

      // Step: A[j+1] = A[j] - Line 7
      shiftedElementsThisLoop.push(A[j]);
      A[j + 1] = A[j];
      const movingId = elementIds[j];
      elementIds[j + 1] = movingId;
      elementIds[j] = valueId; // Assign the lifted valueId to the newly vacant slot j

      snapshots.push({
        id: stepId++,
        algorithm: 'insertion',
        array: [...A],
        elementIds: [...elementIds],
        codeLine: 7,
        actionType: 'shift',
        sortedIndices: Array.from({ length: i }, (_, idx) => idx),
        comparedIndices: [],
        swappingIndices: [],
        swapDetail: null,
        shiftingIndex: j,
        targetSlotIndex: j, // Slot at j becomes open
        selectedIndices: [j + 1],
        liftedValue: {
          value,
          originalIndex: i,
          currentSlot: j,
        },
        variables: { n, i, j, value },
        explanation: {
          title: `Dịch phần tử A[${j}] sang phải`,
          stepDetail: `Gán A[${j + 1}] = A[${j}] = ${A[j]}. Phần tử ${A[j]} được dịch sang phải 1 vị trí, chừa trống ô A[${j}].`,
          outerLoopInfo: `Vòng ngoài: i = ${i}`,
          innerLoopInfo: `Vòng trong: j = ${j}`,
          actionResult: `Đã dịch ${A[j]} từ ô ${j} sang ô ${j + 1}.`,
          pedagogicalTip: 'Cơ chế dịch: Sao chép phần tử sang phải để tạo chỗ trống cho value.',
        },
        isOuterLoopEnd: false,
      });

      // Step: j = j - 1 - Line 8
      j = j - 1;
      snapshots.push({
        id: stepId++,
        algorithm: 'insertion',
        array: [...A],
        elementIds: [...elementIds],
        codeLine: 8,
        actionType: 'update_pointer',
        sortedIndices: Array.from({ length: i }, (_, idx) => idx),
        comparedIndices: [],
        swappingIndices: [],
        swapDetail: null,
        shiftingIndex: null,
        targetSlotIndex: j + 1,
        selectedIndices: j >= 0 ? [j] : [],
        liftedValue: {
          value,
          originalIndex: i,
          currentSlot: j + 1,
        },
        variables: { n, i, j, value },
        explanation: {
          title: 'Giảm chỉ số j',
          stepDetail: `Gán j = j - 1 = ${j}. Tiếp tục lùi sang trái để kiểm tra phần tử tiếp theo.`,
          outerLoopInfo: `Vòng ngoài: i = ${i}`,
          innerLoopInfo: `Con trỏ j = ${j}`,
          actionResult: j < 0 ? 'Chỉ số j < 0 (đã chạm đầu dãy). Sẽ thoát vòng while.' : 'Chuẩn bị kiểm tra phần tử tiếp theo.',
        },
        isOuterLoopEnd: false,
      });
    }

    // Step if j < 0: condition check that exited while loop
    if (j < 0) {
      snapshots.push({
        id: stepId++,
        algorithm: 'insertion',
        array: [...A],
        elementIds: [...elementIds],
        codeLine: 6,
        actionType: 'check_condition',
        sortedIndices: Array.from({ length: i }, (_, idx) => idx),
        comparedIndices: [],
        swappingIndices: [],
        swapDetail: null,
        shiftingIndex: null,
        targetSlotIndex: j + 1,
        selectedIndices: [],
        liftedValue: {
          value,
          originalIndex: i,
          currentSlot: j + 1,
        },
        variables: { n, i, j, value },
        explanation: {
          title: 'Kiểm tra điều kiện vòng while: j >= 0',
          stepDetail: `Chỉ số j = ${j} < 0 (đã chạm đầu mảng). Điều kiện while SAI. Thoát vòng while.`,
          outerLoopInfo: `Vòng ngoài: i = ${i}`,
          innerLoopInfo: `Vòng trong: j = ${j}`,
          actionResult: `Đã dịch hết các phần tử lớn hơn value. Chèn value vào đầu đoạn đã sắp xếp (ô A[0]).`,
        },
        isOuterLoopEnd: false,
      });
    }

    // Step: A[j+1] = value - Line 9
    const insertPos = j + 1;
    A[insertPos] = value;
    elementIds[insertPos] = valueId;

    // Snapshot of insertion
    snapshots.push({
      id: stepId++,
      algorithm: 'insertion',
      array: [...A],
      elementIds: [...elementIds],
      codeLine: 9,
      actionType: 'insert',
      sortedIndices: Array.from({ length: i + 1 }, (_, idx) => idx),
      comparedIndices: [],
      swappingIndices: [],
      swapDetail: null,
      shiftingIndex: null,
      targetSlotIndex: insertPos,
      selectedIndices: [insertPos],
      liftedValue: null, // Inserted back into array
      variables: { n, i, j, value },
      explanation: {
        title: `Chèn value = ${value} vào vị trí A[${insertPos}]`,
        stepDetail: `Thực hiện chèn: A[${insertPos}] = value = ${value}. Vị trí trống A[${insertPos}] đã được lấp đầy.`,
        outerLoopInfo: `Vòng ngoài: i = ${i}`,
        innerLoopInfo: `Chèn vào ô ${insertPos}`,
        actionResult: `Hoàn tất việc chèn phần tử value = ${value}. Đoạn A[0..${i}] giờ đây đã được sắp xếp tăng dần!`,
      },
      isOuterLoopEnd: true,
      loopEndQuestion: {
        loopIndex: i,
        takeaway: `Đoạn A[0..${i}] = [${A.slice(0, i + 1).join(', ')}] đã có thứ tự tăng dần.`,
        arrayState: [...A],
      },
    });

    // Record loop trace
    traceRows.push({
      loopIndex: i,
      value,
      shiftedElements: [...shiftedElementsThisLoop],
      insertPosition: insertPos,
      arrayAfter: [...A],
      snapshotId: snapshots.length - 1,
    });
  }

  // Final completion step
  snapshots.push({
    id: stepId++,
    algorithm: 'insertion',
    array: [...A],
    elementIds: [...elementIds],
    codeLine: 9,
    actionType: 'finished',
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
    comparedIndices: [],
    swappingIndices: [],
    swapDetail: null,
    shiftingIndex: null,
    targetSlotIndex: null,
    selectedIndices: [],
    liftedValue: null,
    variables: { n, i: n, j: null, value: null },
    explanation: {
      title: 'Thuật toán hoàn tất!',
      stepDetail: `Đã duyệt hết tất cả các phần tử i từ 1 đến ${n - 1}. Toàn bộ dãy A đã có thứ tự tăng dần hoàn chỉnh.`,
      outerLoopInfo: 'Hoàn tất',
      actionResult: `Dãy kết quả: [${A.join(', ')}].`,
      pedagogicalTip: 'Ghi nhớ: Sắp xếp chèn giống như cách xếp các quân bài trên tay - mở rộng dần tập bài đã sắp xếp bên tay trái.',
    },
    isOuterLoopEnd: false,
  });

  return { snapshots, traceRows };
}
