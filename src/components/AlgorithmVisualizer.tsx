import React, { useState, useEffect } from "react";
import { Play, RotateCcw, ChevronRight, Zap, GitCommit } from "lucide-react";

type AlgType = "sorting" | "bst" | "fibonacci";

export default function AlgorithmVisualizer() {
  const [activeAlg, setActiveAlg] = useState<AlgType>("sorting");

  // Sorting Visualizer State
  const [array, setArray] = useState<number[]>([45, 12, 85, 32, 60, 22, 74, 9, 53]);
  const [sortingIdxs, setSortingIdxs] = useState<number[]>([]);
  const [isSorted, setIsSorted] = useState(false);
  const [stepsLog, setStepsLog] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // BST Visualizer State
  const [bstNodes, setBstNodes] = useState<{ id: number; val: number; left?: number; right?: number; x: number; y: number }[]>([
    { id: 1, val: 50, x: 150, y: 30 },
    { id: 2, val: 30, x: 80, y: 80 },
    { id: 3, val: 70, x: 220, y: 80 },
    { id: 4, val: 20, x: 45, y: 130 },
    { id: 5, val: 40, x: 115, y: 130 },
    { id: 6, val: 60, x: 185, y: 130 },
    { id: 7, val: 80, x: 255, y: 130 },
  ]);
  const [bstInsertVal, setBstInsertVal] = useState<string>("");
  const [bstActiveNode, setBstActiveNode] = useState<number | null>(null);

  // Fibonacci State
  const [fibInput, setFibInput] = useState<number>(6);
  const [fibOutputCalls, setFibOutputCalls] = useState({ recursive: 25, dp: 11 });

  // 1. Sort Visualizer Logic
  const resetArray = () => {
    const fresh = Array.from({ length: 9 }, () => Math.floor(Math.random() * 85) + 10);
    setArray(fresh);
    setSortingIdxs([]);
    setIsSorted(false);
    setStepsLog(["Array baru diacak. Siap disortir!"]);
  };

  const runSortingStep = async () => {
    if (isSimulating || isSorted) return;
    setIsSimulating(true);

    let arr = [...array];
    const logList: string[] = [];
    
    // Simplistic visual animation steps for bubble sort
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setSortingIdxs([j, j + 1]);
        if (arr[j] > arr[j + 1]) {
          logList.push(`Tukar ${arr[j]} & ${arr[j+1]} (${arr[j]} > ${arr[j+1]})`);
          setStepsLog([...logList]);
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          await new Promise((resolve) => setTimeout(resolve, 350));
        } else {
          logList.push(`Keep ${arr[j]} & ${arr[j+1]} (urutan OK)`);
          setStepsLog([...logList]);
          await new Promise((resolve) => setTimeout(resolve, 180));
        }
      }
    }
    
    setSortingIdxs([]);
    setIsSorted(true);
    setIsSimulating(false);
    logList.push("Array berhasil terurut sempurna!");
    setStepsLog([...logList]);
  };

  // 2. BST Logic
  const handleInsertBST = () => {
    const val = parseInt(bstInsertVal);
    if (isNaN(val) || val <= 0 || val > 99) return;
    setBstInsertVal("");

    // Look for duplicate
    if (bstNodes.some(n => n.val === val)) return;

    // Simulate standard BST insertion positions
    const newNodes = [...bstNodes];

    const findAndInsert = (node: typeof bstNodes[0], currentDepth: number) => {
      setBstActiveNode(node.id);
      if (val < node.val) {
        if (!node.left) {
          const nextId = newNodes.length + 1;
          node.left = nextId;
          const xOffset = 70 / (currentDepth + 1);
          newNodes.push({
            id: nextId,
            val: val,
            x: node.x - xOffset,
            y: node.y + 40,
          });
          setBstNodes(newNodes);
        } else {
          const leftNode = newNodes.find(n => n.id === node.left);
          if (leftNode) findAndInsert(leftNode, currentDepth + 1);
        }
      } else {
        if (!node.right) {
          const nextId = newNodes.length + 1;
          node.right = nextId;
          const xOffset = 70 / (currentDepth + 1);
          newNodes.push({
            id: nextId,
            val: val,
            x: node.x + xOffset,
            y: node.y + 40,
          });
          setBstNodes(newNodes);
        } else {
          const rightNode = newNodes.find(n => n.id === node.right);
          if (rightNode) findAndInsert(rightNode, currentDepth + 1);
        }
      }
    };

    if (newNodes.length === 0) {
      newNodes.push({ id: 1, val: val, x: 150, y: 30 });
      setBstNodes(newNodes);
    } else {
      findAndInsert(newNodes[0], 1);
    }

    setTimeout(() => setBstActiveNode(null), 1000);
  };

  const resetBST = () => {
    setBstNodes([
      { id: 1, val: 50, x: 150, y: 30 },
      { id: 2, val: 30, x: 80, y: 80 },
      { id: 3, val: 70, x: 220, y: 80 },
      { id: 4, val: 20, x: 45, y: 130 },
      { id: 5, val: 40, x: 115, y: 130 },
      { id: 6, val: 60, x: 185, y: 130 },
      { id: 7, val: 80, x: 255, y: 130 },
    ]);
  };

  // 3. Fibonacci Logic
  useEffect(() => {
    const calculateCalls = (n: number) => {
      const recursiveCount = Math.round(Math.pow(1.618, n) * 1.5);
      const dpCount = n * 2 - 1;
      setFibOutputCalls({
        recursive: recursiveCount,
        dp: Math.max(1, dpCount),
      });
    };
    calculateCalls(fibInput);
  }, [fibInput]);

  return (
    <div className="bg-black border border-white/10 rounded-none p-6 text-white flex flex-col h-[400px] select-none justify-between hover:border-blue-500/40 transition-colors duration-300">
      
      {/* Top Controls tabs */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-mono tracking-widest text-blue-500 font-bold uppercase">
              [03 // ALGORITMA LEKTUR]
            </span>
          </div>

          <div className="flex items-center gap-1 bg-white/[0.04] p-1 border border-white/10">
            {(["sorting", "bst", "fibonacci"] as AlgType[]).map((alg) => (
              <button
                key={alg}
                onClick={() => setActiveAlg(alg)}
                className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 transition-all ${
                  activeAlg === alg ? "bg-blue-600 text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {alg === "sorting" ? "Sorting" : alg === "bst" ? "BST" : "Asymptotics"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Core sandbox panel */}
      <div className="flex-1 my-4 flex items-center justify-center min-h-0">
        {activeAlg === "sorting" && (
          <div className="w-full h-full flex flex-col justify-between">
            {/* Visual sorting bars representation */}
            <div className="flex-1 flex gap-3 items-end justify-center px-2 max-h-[140px] mt-2">
              {array.map((val, idx) => {
                const isChecking = sortingIdxs.includes(idx);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 pt-1">
                    <span className="text-[9px] font-mono text-white/50">{val}</span>
                    <div
                      className={`w-full rounded-none transition-all duration-300 ${
                        isChecking
                          ? "bg-rose-500"
                          : isSorted
                          ? "bg-blue-400"
                          : "bg-blue-600"
                      }`}
                      style={{ height: `${val * 1.3}px`, minHeight: "10px" }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Steps log tracker */}
            <div className="bg-white/[0.02] p-2.5 border border-white/10 max-h-[80px] overflow-y-auto mb-1 mt-4">
              <span className="text-[9px] uppercase font-mono tracking-widest text-blue-500 font-bold block mb-1">
                TRACE LOG EXECUTOR
              </span>
              {stepsLog.length === 0 ? (
                <p className="text-[10px] font-mono text-white/40 italic">Klik tombol sortir untuk menjalankan visualisasi Bubble Sort...</p>
              ) : (
                <div className="space-y-0.5 font-mono text-[9px] text-white/80">
                  {stepsLog.slice(-3).map((log, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <ChevronRight className="w-3 h-3 text-blue-500 shrink-0" />
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeAlg === "bst" && (
          <div className="w-full h-full flex flex-col justify-between">
            {/* Tree canvas preview */}
            <div className="flex-1 relative bg-black border border-white/10 overflow-hidden min-h-[150px]">
              <svg className="absolute inset-0 w-full h-full">
                {/* Draw connecting lines */}
                {bstNodes.map((node) => (
                  <g key={`lines-${node.id}`}>
                    {node.left && (() => {
                      const child = bstNodes.find(n => n.id === node.left);
                      if (child) {
                        return (
                          <line
                            x1={node.x}
                            y1={node.y}
                            x2={child.x}
                            y2={child.y}
                            stroke="rgba(255,255,255,0.15)"
                            strokeWidth="1"
                          />
                        );
                      }
                      return null;
                    })()}
                    {node.right && (() => {
                      const child = bstNodes.find(n => n.id === node.right);
                      if (child) {
                        return (
                          <line
                            x1={node.x}
                            y1={node.y}
                            x2={child.x}
                            y2={child.y}
                            stroke="rgba(255,255,255,0.15)"
                            strokeWidth="1"
                          />
                        );
                      }
                      return null;
                    })()}
                  </g>
                ))}

                {/* Draw nodes */}
                {bstNodes.map((node) => {
                  const isActive = bstActiveNode === node.id;
                  return (
                    <g key={`node-${node.id}`} transform={`translate(${node.x}, ${node.y})`}>
                      <circle
                        r="12"
                        className={`transition-colors duration-300 ${
                          isActive
                            ? "fill-blue-500 stroke-white"
                            : "fill-black stroke-white/45"
                        }`}
                        strokeWidth="1"
                      />
                      <text
                        textAnchor="middle"
                        dy=".33em"
                        className="fill-white text-[9px] font-mono font-bold"
                      >
                        {node.val}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Tree operations */}
            <div className="flex gap-2 items-center mt-3">
              <input
                type="number"
                value={bstInsertVal}
                onChange={(e) => setBstInsertVal(e.target.value)}
                placeholder="Val (1-99)"
                className="bg-black border border-white/10 rounded-none px-3 py-1.5 text-xs font-mono w-24 text-center focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleInsertBST}
                className="bg-blue-600 hover:bg-blue-500 text-white font-black px-4 py-1.5 text-[10px] uppercase tracking-wider font-mono transition-colors"
              >
                INSERT
              </button>
            </div>
          </div>
        )}

        {activeAlg === "fibonacci" && (
          <div className="w-full h-full flex flex-col justify-between p-1">
            <div className="space-y-4">
              <p className="text-[11px] text-white/70 leading-relaxed font-sans">
                Operasi rekapitulasi rekursif murni <code className="text-rose-400 font-mono bg-white/5 px-1 py-0.5">O(2^N)</code> memicu redudansi berlebih. Sementara formulasi Dynamic Programming mereduksinya secara efisien menjadi kompleksitas linier <code className="text-blue-400 font-mono bg-white/5 px-1 py-0.5">O(N)</code>.
              </p>

              {/* Graphical representation bar comparison */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/60 flex items-center gap-1.5 uppercase font-bold">
                      <GitCommit className="w-3.5 h-3.5 text-rose-500" /> Stack Rekursif
                    </span>
                    <span className="font-bold text-rose-400">{fibOutputCalls.recursive} Ops</span>
                  </div>
                  <div className="h-2 bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-rose-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, (fibOutputCalls.recursive / (fibOutputCalls.recursive + fibOutputCalls.dp)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/60 flex items-center gap-1.5 uppercase font-bold">
                      <Zap className="w-3.5 h-3.5 text-blue-500" /> Memo DP Linier
                    </span>
                    <span className="font-bold text-blue-400">{fibOutputCalls.dp} Ops</span>
                  </div>
                  <div className="h-2 bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, (fibOutputCalls.dp / (fibOutputCalls.recursive + fibOutputCalls.dp)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Slider control */}
            <div className="flex items-center gap-3 mt-4 border-t border-white/5 pt-3">
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest font-bold">N-Depth:</span>
              <input
                type="range"
                min="3"
                max="10"
                value={fibInput}
                onChange={(e) => setFibInput(parseInt(e.target.value))}
                className="flex-1 accent-blue-500 h-1 bg-white/10 cursor-pointer"
              />
              <span className="text-[10px] font-mono font-bold text-white bg-blue-600 px-2.5 py-0.5">
                N = {fibInput}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Simulation Controls toolbar */}
      <div className="flex items-center justify-between border-t border-white/10 pt-3">
        {activeAlg === "sorting" ? (
          <>
            <div className="flex items-center gap-2">
              <button
                onClick={runSortingStep}
                disabled={isSimulating || isSorted}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-4 py-2 text-[10px] font-bold tracking-wider font-mono flex items-center gap-1.5 transition-colors"
                id="sorting-simulate-btn"
              >
                <Play className="w-3 h-3" />
                SIMULASIKAN
              </button>
              <button
                onClick={resetArray}
                className="border border-white/10 hover:bg-white/5 text-white/80 hover:text-white p-2 text-xs font-mono transition-colors"
                title="Acak array"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
              BUBBLE COMPLEXITY
            </span>
          </>
        ) : activeAlg === "bst" ? (
          <>
            <button
              onClick={resetBST}
              className="border border-white/10 hover:bg-white/5 text-white px-4 py-2 text-[10px] font-bold tracking-wider font-mono flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              RESET CANVAS TREE
            </button>
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
              BST STRUCT
            </span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[10px] font-mono text-white/80">
                Memoization Terhitung {Math.round((fibOutputCalls.recursive / fibOutputCalls.dp) || 1)}x Lebih Optimal!
              </span>
            </div>
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
              ASYMPTOTIC MEMO
            </span>
          </>
        )}
      </div>
    </div>
  );
}
