


/**
 * Manejar consultas que retornan arreglos
 *
 * @param snapshot
 * @returns
 */
export async function handlerArrayResult(snapshot: any, opts: any = {}){
    const {idField = "_id"} = opts;
    let result: any[] = [];
    
    if(snapshot.empty){ return result; }

    snapshot.forEach((doc) => {
        result.push(
            Object.assign({}, doc.data(), {[idField]: doc.id})
        );
    });
    
    return result;
}

/**
 * Manejar consutlas que retornan un objeto
 *
 * @param snapshot
 * @returns
 */
export async function handlerObjectResult(snapshot: any, opts: any = {}){
    const {idField = "_id"} = opts;

    if(!snapshot.exists){ return null; }

    return Object.assign({}, snapshot.data(), {[idField]: snapshot.id});
}





