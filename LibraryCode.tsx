/// GENERATOR ///
function* getNextPortionOfData(data: any[], slice: number) {
    //^Hello, I am a generator! I am spitting every next slice from the array!
    // Do not forget an asterisk *!
    
    let i = 0;
    while (i < data.length) {
        yield data.slice(i, i + slice);
        i+=slice;
    }
}
