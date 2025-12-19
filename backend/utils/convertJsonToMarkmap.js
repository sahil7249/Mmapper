const convertJsonToMarkmap = (jsonContent) => {
    let markMapContent = ""

    if (jsonContent.title) {
        markMapContent += `
---
title: ${jsonContent.title}
markmap:
colorFreezeLevel: 2
---

# ${jsonContent.title}\n`
}
    // Recursive function for nodes
    const processNode = (node, level = 1) => {
        let result = ''

        const heading = '#'.repeat(level)
        const text = node.name || node.text || 'Untitled'
        result += `${heading} ${text}\n`

        if (node.children && Array.isArray(node.children) && node.children.length > 0) {
            node.children.forEach(element => {
                result += processNode(element, level + 1)
            });
        }

        return result
    }

    // For the top level nodes 
    if (jsonContent.nodes && Array.isArray(jsonContent.nodes)) {
        jsonContent.nodes.forEach(node => {
            markMapContent += processNode(node, jsonContent.title ? 2 : 1)
        })
        // If the root directly have the children
    } else if (jsonContent.children && Array.isArray(jsonContent.children)) {
        jsonContent.forEach(node => {
            markMapContent += processNode(node, 1)
        })
        // if there is only one node or json itself is a node 
    } else {
        markMapContent += processNode(jsonContent, 1)
    }

    markMapContent = markMapContent.trim()

    if (!markMapContent || markMapContent.length === 0) {
        throw new Error("Generated markdown in empty")
    }

    console.log(markMapContent)
}

export default convertJsonToMarkmap;