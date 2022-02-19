import { useEffect, useState } from 'react';
import { TreeNode } from '../utils/tree/TreeNode';

export const useRouteTree = (activeVelorouteSection, crossingVeloroutes) => {

    const [tree, setTree] = useState(null);


    useEffect(()=>{
        if(!crossingVeloroutes.length) return   

        const alternativeRoutes = new TreeNode(activeVelorouteSection[0]);
        let leaf = alternativeRoutes;


        activeVelorouteSection.forEach((stop, idx) => {
            if(idx===0) return

            leaf = leaf.addChild(stop)

            if(idx===activeVelorouteSection.length-1) return
            const alternativeList = crossingVeloroutes.filter(veloroute => veloroute.route.find(section => section.map(stop => stop.stop_id).includes(leaf.data.stop_id)))
            if(alternativeList.length) {
                
                alternativeList.forEach(route => {
                    
                    let segments = route.route.find(r => r.map(s => s.stop_id).includes(leaf.data.stop_id));
                    const index = segments.map(s => s.stop_id).indexOf(leaf.data.stop_id);

                    if(index !== 0 || index !== segments.length-1){
                        segments = [segments.slice(index), segments.slice(0, index + 1).reverse()]
                        segments[0].shift()
                        segments[1].shift()
                    }
                    else {
                        if(index===0){
                            segments.shift()
                            segments = [segments]
                        }
                        else{
                            segments.reverse().pop()
                            segments = [segments]
                        }
                    }

                    segments.forEach(segment => {
                        let currentleaf = leaf;
                        segment.forEach(s => {
                            const stopData = {
                                stop_id: s.stop_id,
                                stop_name: s.stop_name,
                                pos: s.pos,
                                train_list: s.train_list,
                                path: [leaf.data.pos, s.pos],
                                name: route.name
                            }
                            currentleaf = currentleaf.addChild(stopData)
                        })
                    })     
                })
            }
        })
        setTree(alternativeRoutes)

    },[activeVelorouteSection, crossingVeloroutes])

    return tree
}
