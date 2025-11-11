class ArrayExtensions{
    static deleteObjectFromArray(array, obj){
        let index = array.indexOf( obj )
        array.splice( index, 1 )
        return true
    }
    static deleteObjectsFromArray(array, objects) {
        for(let object of objects){
            ArrayExtensions.deleteObjectFromArray( array, object )
        }
        return true
    }
}