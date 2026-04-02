// import { MapButton, HomeBtn, CustomBtn } from "../components/Buttons"
// import { Download, SaveIcon, Search, File, Cable, House, Trash } from "lucide-react"
// import { useState } from "react";
// import CodeMirror from "@uiw/react-codemirror";
// import { MindMap } from "./MindMap"
// import { toast } from "react-toastify";
// import { api } from "../api/axios";


// export const CreateMap = () => {
//     const [metaData, setMetaData] = useState({
//         title: "Enter title here",
//         colorFreezeLevel: 2
//     })
//     const [content, setContent] = useState("")
//     const code = `---
// title: ${metaData.title}
// markmap:
// colorFreezeLevel: 2
// ---

// ${content}

// `
//     const [mode, setMode] = useState('file')
//     const [instanceData, setInstanceData] = useState(null)


//     const getData = (data) => {
//         setInstanceData(data)
//     }


//     const handleSave = async () => {
//         try {
//             const { data } = await api.post('/save-map', {
//                 title: metaData.title,
//                 markdown_content: code
//             })

//             if(!data) {
//                 toast.error("Something went wrong")
//             }
//             toast.success("Map saved successfully")
//         } catch (error) {
//             toast.error(error.message)
//             throw new Error(error.message)
//         }
//     }


//     return (
//         <div className="w-screen px-10 mt-5">
//             <div className="flex justify-between mb-2.5">
//                 <div className="flex items-center gap-5">
//                     <div className="flex gap-2.5 border p-1.5 rounded-xl">
//                         <CustomBtn name={"file"} handleClick={() => setMode('file')} >
//                             <File />
//                         </CustomBtn>
//                         <CustomBtn name={"manual"} handleClick={() => setMode('manual')}  >
//                             <Cable />
//                         </CustomBtn>
//                     </div>
//                     <div className="border rounded-xl p-2 text-xl">
//                         <input
//                             type="text"
//                             value={metaData.title}
//                             style={{ outline: 'none' }}
//                             onChange={(e) =>
//                                 setMetaData(prev => ({
//                                     ...prev,
//                                     title: e.target.value
//                                 }))

//                             }
//                         />
//                     </div>
//                 </div>
//                 <div className="flex gap-2.5 ">
//                     <HomeBtn >
//                         <House />
//                     </HomeBtn>
//                     <MapButton name={"Fit"} >
//                         <Search />
//                     </MapButton>
//                     <MapButton name={"Download"} >
//                         <Download />
//                     </MapButton>
//                     <MapButton name={"Save"} handleClick={handleSave}>
//                         <SaveIcon />
//                     </MapButton>
//                     <CustomBtn name={"clear"} handleClick={() => setContent("")}>
//                         <Trash />
//                     </CustomBtn>
//                 </div>
//             </div>
//             <div className="border h-190 rounded-2xl p-1.5 flex gap-0.5">
//                 {mode === 'file' ? (
//                     <>
//                         <div className="border w-1/2 h-full rounded-xl overflow-hidden">
//                             <CodeMirror
//                                 className="h-full w-full rounded-xl"
//                                 value={content}
//                                 onChange={(value) => setContent(value)}
//                             />
//                         </div>
//                         <div className="border w-2/3 h-full rounded-xl">
//                             <MindMap markdown={code} handleData={getData} />
//                         </div>

//                     </>
//                 ) : (
//                     <div className="border w-full h-full rounded-xl ">
//                         Still in work...
//                     </div>
//                 )}

//             </div>
//         </div>
//     )
// }


import { useState, useEffect, useRef, useCallback } from "react";
import { Transformer } from 'markmap-lib'
import * as markmap from 'markmap-view';
import { Markmap, loadCSS, loadJS } from 'markmap-view';
import { useMap } from "../hooks/useMap";
import { getMapById } from "../services/mapService";
import SpinnerModal from "../components/ui/SpinnerModal";
import { useParams } from "react-router-dom";
import { api } from "../api/axios";
import { toast } from "react-toastify";

const DEFAULT_MD = `# 🧠 Mind Map Creator

## Getting Started
### Double-click any node to edit
### Right-click for more options
### Drag to pan · Scroll to zoom
`;

// ── Markdown ↔ Tree ───────────────────────────────────────────────────────────
let _uid = 1;
function freshId() { return _uid++; }

function parseMd(md) {
    const root = { id: freshId(), text: "__root__", depth: 0, children: [] };
    const stack = [root];
    for (const line of md.split("\n")) {
        const m = line.match(/^(#{1,6})\s+(.*)/);
        if (!m) continue;
        const d = m[1].length;
        const node = { id: freshId(), text: m[2].trim(), depth: d, children: [] };
        while (stack.length > 1 && stack[stack.length - 1].depth >= d) stack.pop();
        stack[stack.length - 1].children.push(node);
        stack.push(node);
    }
    return root;
}

function treeToMd(node) {
    let out = "";
    if (node.depth > 0) out += "#".repeat(Math.min(node.depth, 6)) + " " + node.text + "\n";
    for (const child of node.children) out += treeToMd(child);
    return out;
}

function findById(node, id) {
    if (node.id === id) return node;
    for (const c of node.children) { const f = findById(c, id); if (f) return f; }
    return null;
}

function findByText(node, text) {
    if (node.depth > 0 && node.text === text) return node;
    for (const c of node.children) { const f = findByText(c, text); if (f) return f; }
    return null;
}

function findParent(node, id) {
    for (const c of node.children) {
        if (c.id === id) return node;
        const f = findParent(c, id);
        if (f) return f;
    }
    return null;
}


// ── ContextMenu ───────────────────────────────────────────────────────────────
function ContextMenu({ pos, label, onRename, onChild, onSibling, onDelete, onClose }) {
    const ref = useRef();
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [onClose]);

    const rowCls = "flex items-center gap-2 px-3 py-[7px] rounded-lg cursor-pointer text-[12.5px] font-medium text-white hover:bg-[#6a6767] hover:text-white transition-colors select-none";
    const iconCls = "w-[14px] h-[14px] shrink-0 stroke-current fill-none stroke-[1.6]";

    return (
        <div
            ref={ref}
            style={{
                left: Math.min(pos.x, window.innerWidth - 185) + "px",
                top: Math.min(pos.y, window.innerHeight - 210) + "px",
                animation: "ctxIn 0.1s ease",
            }}
            className="fixed z-500  border text-white bg-[#3a3838]   border-[#dddddd] rounded-xl p-1.25 min-w-43 shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
        >
            <div className="px-2.5 pt-1.25 pb-0.75 text-[10px] font-mono text-white max-w-50 overflow-hidden text-ellipsis whitespace-nowrap">
                📍 {label}
            </div>
            <div className="h-px bg-white/[0.07] my-1" />
            <div className={rowCls} onClick={onRename}>
                <svg className={iconCls} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 16 16">
                    <path d="M11.5 2.5l2 2-8.5 8.5H3v-2.5l8.5-8.5z" />
                </svg>
                Rename node
            </div>
            <div className={rowCls} onClick={onChild}>
                <svg className={iconCls} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="5.5" /><line x1="8" y1="5.5" x2="8" y2="10.5" /><line x1="5.5" y1="8" x2="10.5" y2="8" />
                </svg>
                Add child node
            </div>
            <div className={rowCls} onClick={onSibling}>
                <svg className={iconCls} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 16 16">
                    <rect x="1.5" y="3" width="5" height="4" rx="1" /><rect x="9.5" y="3" width="5" height="4" rx="1" />
                    <line x1="4" y1="7" x2="4" y2="13" /><line x1="12" y1="7" x2="12" y2="13" /><line x1="4" y1="13" x2="12" y2="13" />
                </svg>
                Add sibling
            </div>
            <div className="h-px bg-white/[0.07] my-1" />
            <div
                className="flex items-center gap-2 px-3 py-1.75 rounded-lg cursor-pointer text-[12.5px] font-medium text-[#e05252] hover:bg-[#e05252]/10 transition-colors select-none"
                onClick={onDelete}
            >
                <svg className={iconCls} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 16 16">
                    <polyline points="2.5,4 13.5,4" /><path d="M5.5 4V2.5h5V4" /><path d="M4.5 4l.8 9.5h5.4L11.5 4" />
                </svg>
                Delete node
            </div>
        </div>
    );
}

// ── EditBox ───────────────────────────────────────────────────────────────────
function EditBox({ pos, initialValue, onCommit, onCancel }) {
    const [val, setVal] = useState(initialValue);
    const ref = useRef();
    useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);

    const commit = () => { if (val.trim()) onCommit(val.trim()); else onCancel(); };

    return (
        <input
            ref={ref}
            style={{
                left: Math.min(Math.max(pos.x, 70), window.innerWidth - 70) + "px",
                top: Math.min(Math.max(pos.y, 25), window.innerHeight - 35) + "px",
                transform: "translate(-50%, -50%)",
            }}
            className="fixed z-600 text-sm font-medium text-[#eeeeff] bg-[#1e1e27] border-[1.5px] border-[#7c74d8] rounded-lg px-3 py-1.25 outline-none min-w-30 max-w-75 shadow-[0_0_0_3px_rgba(124,116,216,0.15)]"
            value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => {
                if (e.key === "Enter") { e.preventDefault(); commit(); }
                if (e.key === "Escape") { onCancel(); }
                e.stopPropagation();
            }}
            onBlur={commit}
        />
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export const CreateMap = () => {
    const [tree, setTree] = useState(() => parseMd(DEFAULT_MD));
    const [mdText, setMdText] = useState(DEFAULT_MD);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [ctx, setCtx] = useState(null);
    const [editState, setEditState] = useState(null);
    const [toastt, setToast] = useState("");
    const [toastOn, setToastOn] = useState(false);
    const [title,setTitle] = useState("Demo Title")


    const svgRef = useRef(null);
    const mmRef = useRef(null);
    const transRef = useRef(null);
    const renderTimer = useRef(null);
    const toastTimer = useRef(null);
    const boundNodes = useRef(new WeakSet());

    const showToast = useCallback((msg) => {
        setToast(msg); setToastOn(true);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToastOn(false), 2000);
    }, []);

    const doRender = useCallback((currentTree) => {
        if ( !svgRef.current) return;

        if (!transRef.current) transRef.current = new Transformer();
        let md = treeToMd(currentTree);
       
        if (!md.trim()) md = "# (empty)";

        const {root,features } = transRef.current.transform(md) 

        boundNodes.current = new WeakSet();

        const { styles, scripts } = transRef.current.getUsedAssets(features);  

        if (styles) loadCSS(styles);
            if (scripts) {
                loadJS(scripts, {
                    getMarkmap: () => markmap
            });
        }

        if (!mmRef.current) {
            mmRef.current = Markmap.create(svgRef.current, {
                autoFit: true, duration: 250,
                maxWidth: 220, nodeMinHeight: 20,
                spacingVertical: 8, spacingHorizontal: 64, paddingX: 10,
            }, root);
        } else {
            mmRef.current.setData(root);
            mmRef.current.fit();
        }

        setTimeout(attachListeners, 600);
    }, []); 

    useEffect(() => { doRender(tree); }, [tree]);

    const treeRef = useRef(tree)
    useEffect(() => {
        treeRef.current = tree
    },[tree])

    const handleSave = async () => {
        try {
            const { data } = await api.post('/save-map', {
                title: title,
                markdown_content: mdText
            })

            if(!data) {
                toast.error("Something went wrong")
            }
            toast.success("Map saved successfully")
        } catch (error) {
            toast.error(error.message)
            throw new Error(error.message)
        }
    }

    function attachListeners() {
        svgRef.current?.querySelectorAll("g.markmap-node").forEach(g => {
            if (boundNodes.current.has(g)) return;
            boundNodes.current.add(g);

            g.addEventListener("dblclick", e => {
                e.preventDefault(); e.stopPropagation();
                const label = getLabel(g);
                console.log(g)
                const node = findByText(treeRef.current, label);
                if (node) setEditState({ id: node.id, label, pos: { x: e.clientX, y: e.clientY } });
            });

            g.addEventListener("contextmenu", e => {
                e.preventDefault(); e.stopPropagation();
                const label = getLabel(g);
                const node = findByText(treeRef.current, label);
                if (node) setCtx({ id: node.id, label, pos: { x: e.clientX, y: e.clientY } });
            });
        });
    }

    function getLabel(g) {
        const fo = g.querySelector("foreignObject");
        if (fo) return (fo.textContent || "").trim();
        const t = g.querySelector("text");
        return t ? (t.textContent || "").trim() : "";
    }

    function handleTextChange(e) {
        const val = e.target.value;
        setMdText(val);
        clearTimeout(renderTimer.current);
        renderTimer.current = setTimeout(() => setTree(parseMd(val)), 400);
    }

    function applyTree(fn, msg) {
        setTree(prev => {
            const clone = JSON.parse(JSON.stringify(prev));
            fn(clone);
            setMdText(treeToMd(clone));
            return clone;
        });
        showToast(msg);
    }

    const handleRename = (id, text) => applyTree(r => { const n = findById(r, id); if (n) n.text = text; }, "Node renamed ✓");
    const handleAddChild = (id) => applyTree(r => {
        const n = findById(r, id);
        if (n) n.children.push({ id: freshId(), text: "New Node", depth: n.depth + 1, children: [] });
    }, "Child node added");
    const handleAddSibling = (id) => applyTree(r => {
        const parent = findParent(r, id);
        if (!parent) return;
        const node = findById(r, id);
        const idx = parent.children.findIndex(c => c.id === id);
        parent.children.splice(idx + 1, 0, { id: freshId(), text: "New Node", depth: node.depth, children: [] });
    }, "Sibling node added");
    const handleDelete = (id) => applyTree(r => {
        const parent = findParent(r, id);
        if (!parent) return;
        parent.children = parent.children.filter(c => c.id !== id);
    }, "Node deleted");

    const fit = () => mmRef.current?.fit();
    const zoomIn = () => mmRef.current?.rescale(1.3);
    const zoomOut = () => mmRef.current?.rescale(0.75);

    useEffect(() => {
        const h = e => { if (e.key === "Escape") { setCtx(null); setEditState(null); } };
        document.addEventListener("keydown", h);
        return () => document.removeEventListener("keydown", h);
    }, []);

    const zBtnCls = "w-[34px] h-[34px] bg-[#1e1e27] border border-white/[0.13] rounded-lg flex items-center justify-center cursor-pointer text-[#9896b8] text-lg select-none hover:bg-[#26262f] hover:text-[#eeeeff] transition-colors leading-none";
    const kbdCls = "font-mono text-[9px] px-[5px] py-[2px] border border-white/[0.13] rounded text-[#9896b8] bg-[#1e1e27]";

    return (
        <div className="flex flex-col h-screen  text-[#eeeeff] overflow-hidden">
            {/* Topbar */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 border-b border-black shrink-0 text-black">
                <div className="flex items-center gap-2 font-semibold text-sm">
                    <div className="w-6 h-6 bg-[#7c74d8] rounded-[7px] flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" width="14" height="14">
                            <circle cx="8" cy="3" r="1.8" fill="white" stroke="none" />
                            <circle cx="3" cy="12" r="1.8" fill="white" stroke="none" />
                            <circle cx="13" cy="12" r="1.8" fill="white" stroke="none" />
                            <line x1="8" y1="4.8" x2="3.9" y2="10.3" />
                            <line x1="8" y1="4.8" x2="12.1" y2="10.3" />
                        </svg>
                    </div>
                    Mind Map Creator
                </div>
                <div className="border rounded-2xl p-1.5">
                    <input type="text" placeholder="Enter title" className="outline-none" value={title}  onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <div className="flex-1" />
                <button
                    onClick={() => { setSidebarOpen(o => !o); setTimeout(fit, 260); }}
                    className="text-xs font-medium px-3 py-1.25 rounded-lg border border-black bg-transparent text-black cursor-pointer hover:bg-[#26262f] hover:text-white transition-colors"
                >
                    {sidebarOpen ? "← Hide Editor" : "→ Show Editor"}
                </button>
                <button
                    onClick={fit}
                    className="text-xs font-medium px-3 py-1.25 rounded-lg border border-black text-black cursor-pointer hover:bg-[#26262f] hover:text-white transition-colors"
                >
                    Fit View
                </button>
                <button
                    onClick={handleSave}
                    className="text-xs font-medium px-3 py-1.25 rounded-lg border border-black text-black cursor-pointer hover:bg-[#26262f] hover:text-white transition-colors"
                >
                    Save
                </button>
                <button
                    onClick={() => setMdText("")}
                    className="text-xs font-medium px-3 py-1.25 rounded-lg border border-black text-black cursor-pointer hover:bg-[#26262f] hover:text-white transition-colors"
                >
                    Clear
                </button>
            </div>
            <div className="flex flex-1 min-h-0">
                <div
                    style={{ width: sidebarOpen ? 300 : 0, transition: "width 0.22s ease" }}
                    className="shrink-0  border-r border-white/[0.07] flex flex-col overflow-hidden"
                >
                    <div className="px-3.5 pt-2.5 pb-2 border-b border-white/[0.07] shrink-0 whitespace-nowrap">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#55536e] mb-0.75">
                            Markdown Source
                        </div>
                    </div>
                    <textarea
                        className="flex-1  text-[#09090e] border-none outline-none resize-none font-mono text-[12px] leading-[1.85] px-3.5 py-3 w-full min-h-0"
                        style={{ tabSize: 2, whiteSpace: "pre" }}
                        value={mdText}
                        onChange={handleTextChange}
                        spellCheck={false}
                    />
                </div>
                <div className="flex-1 relative overflow-hidden">
                    <svg ref={svgRef} className="w-full h-full block" />

                    
                    <div className="absolute bottom-4 right-4 flex flex-col gap-1.25 z-20">
                        <div className={zBtnCls} onClick={zoomIn}>+</div>
                        <div className={zBtnCls} onClick={zoomOut}>−</div>
                        <div className={zBtnCls} style={{ fontSize: 13 }} onClick={fit}>⊡</div>
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3.5 text-[11px] text-[#55536e] pointer-events-none whitespace-nowrap">
                        {[["dblclick", "Edit"], ["rightclick", "Menu"], ["scroll", "Zoom"], ["drag", "Pan"]].map(([k, v]) => (
                            <div key={k} className="flex items-center gap-1">
                                <span className={kbdCls}>{k}</span>{v}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {ctx && (
                <ContextMenu
                    pos={ctx.pos} label={ctx.label}
                    onRename={() => { setEditState({ id: ctx.id, label: ctx.label, pos: ctx.pos }); setCtx(null); }}
                    onChild={() => { handleAddChild(ctx.id); setCtx(null); }}
                    onSibling={() => { handleAddSibling(ctx.id); setCtx(null); }}
                    onDelete={() => { handleDelete(ctx.id); setCtx(null); }}
                    onClose={() => setCtx(null)}
                />
            )}

            {editState && (
                <EditBox
                    pos={editState.pos}
                    initialValue={editState.label}
                    onCommit={val => { handleRename(editState.id, val); setEditState(null); }}
                    onCancel={() => setEditState(null)}
                />
            )}

            <div
                className="fixed bottom-12 left-1/2 z-700 bg-[#1e1e27] border border-white/13 rounded-lg px-3.5 py-1.5 text-xs text-[#eeeeff] pointer-events-none transition-all duration-200"
                style={{
                    transform: toastOn ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(6px)",
                    opacity: toastOn ? 1 : 0,
                }}
            >
                {toastt}
            </div>
        </div>
    );
}