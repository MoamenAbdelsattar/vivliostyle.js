import * as Plugin from "./plugin";
let deferred = [];
let defer_types = {
  "untill-fit":0,
}
let deferred = [];
let defer_types = [
  "untill-fit",
]
Plugin.registerHook(
    Plugin.HOOKS.POST_LAYOUT_BLOCK,
    (nodeContext, checkpoints, column) => {
        let remaining_space = (column.afterEdge - column.beforeEdge) - column.element.firstChild.scrollHeight;  
        for(let i = 0; i < deferred.length; i++){
            if(!nodeContext.viewNode.parentElement.matches(`[data-adapt-eloff="${deferred[i].parentEloff}"]`)) continue; // If it's not the same parent: don't try to insert
            if((deferred[i].defer_type = "untill-fit" &&
                remaining_space > deferred[i].savedHeight) ||
                !nodeContext.sourceNode.nextSibling // If it doesn't fit but this element is the last in its parent: don't defer anymore
              ){
                    // insert the deferred element
                    nodeContext.viewNode.before(deferred[i]);
                    remaining_space -= deferred[i].savedHeight;
                    deferred.splice(i, 1);
                    i--;
            }
        }
        
        let defer_type;
        if(!nodeContext.viewNode.hasAttribute("data-defer")) return;
        else{
            defer_type = nodeContext.viewNode.getAttribute("data-defer");
        }
        if(defer_type == "untill-fit"){
            if((column.element.firstChild.scrollHeight < (column.afterEdge - column.beforeEdge)) || !nodeContext.sourceNode.nextSibling) return; // Don't defer if the element fits or if it doesn't have any other siblings
            // else
            let clone = nodeContext.viewNode.cloneNode(true);
            clone.savedHeight = nodeContext.viewNode.scrollHeight;
            clone.deferType = defer_type;
            clone.parentEloff = nodeContext.viewNode.parentElement.getAttribute("data-adapt-eloff");
            clone.removeAttribute("data-defer");
            deferred.push(clone);
            nodeContext.viewNode.style.display = "none";
        }
      },
);

// TODO: 
//    * support vertical writing systems
//    * Other deferring types: defer untill right page, right column ..etc
