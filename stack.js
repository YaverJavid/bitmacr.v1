class Stack {
    constructor(limit = 128) {
        this.data = []
        this.limit = limit
        this.pointer = -1
    }

    addItem(item, preservePointer = false) {
        this.data.push(item)
        if (this.data.length > this.limit) {
            this.data.shift()
        }
        if (!preservePointer) {
            this.pointer = this.data.length - 1
        }
    }
    clearStack() {
        this.data = []
        this.pointer = -1
    }
    getItem(index = this.pointer) {
        if (index >= this.data.length || index < 0) {
            throw new Error("Stack Class Error : Cant Get, Stack Out Of Range")
        }
        return this.data[index]
    }
    getAllItems() {
        return this.data
    }
    setPointer(pointer, ignoreIfOutOfRange = true) {
        if (pointer >= this.data.length || pointer < 0) {
            if (ignoreIfOutOfRange) return false
            throw new Error("Stack Class Error : Cant Set Pointer, Stack Out Of Range")
        }
        this.pointer = pointer
        return true
    }
    static help(...queries) {
        console.log(`
        This is help for class "Stack".
        Written By Yaver Javid at synco.
        Version 1.0.0.
        Stack takes(limit:default=64)
        OP : Use 2^n for limits
        `);
        return queries
    }


}