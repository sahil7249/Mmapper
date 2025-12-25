import { Transformer } from 'markmap-lib'
import * as markmap from 'markmap-view';
import { Markmap, loadCSS, loadJS } from 'markmap-view';
import { useRef, useEffect } from 'react';


export const MindMap = ({ markdown,handleData }) => {
    const svgRef = useRef(null)
    const mmRef = useRef(null)

    useEffect(() => {
        if(!markdown || !svgRef.current) return

        svgRef.current.innerHTML = ''

        const transformer = new Transformer();
        const { root, features } = transformer.transform(markdown);
        const { styles, scripts } = transformer.getUsedAssets(features);

        if (styles) loadCSS(styles);
        if (scripts) {
            loadJS(scripts, {
                // For plugins to access the `markmap` module
                getMarkmap: () => markmap
            });
        }

        mmRef.current = Markmap.create(svgRef.current, undefined, root);
        handleData({root,features,assets:{styles,scripts},markapInstance:mmRef.current})
        return () => {
            if(svgRef.current) {
                svgRef.current.innerHTML = ''
            }
            mmRef.current = null        
        }
    }, [markdown])



    return (
        <svg
            ref={svgRef}
            title="Mind Map"
            style={{
                width: '100%',
                height: '100%',
                color: 'black'
            }}
        />
    )

}