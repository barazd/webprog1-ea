// Worker fájl, ami egy egyszerű számológép
onmessage = (e) => {
    const wait = Math.random() * (3000 - 300) + 300;

    postMessage(`Megkaptam a munkát, de most nagyon elfoglalt vagyok még kb. ${Number(wait / 1000).toPrecision(3)} másodpercig...\n`);

    setTimeout(function(){
        const result = e.data[2] === '+' ? Number(e.data[0]) + Number(e.data[1]) : 
        (e.data[2] === '-' ? Number(e.data[0]) - Number(e.data[1]) : 
            (e.data[2] === '*' ? Number(e.data[0]) * Number(e.data[1]) : 
                (e.data[2] === '/' ? Number(e.data[0]) / Number(e.data[1]) : 
                    (e.data[2] === '%' ? Number(e.data[0]) % Number(e.data[1]) : 
                        (null)))));

        postMessage(`Megvan az eredmény: ${e.data[0]} ${e.data[2]} ${e.data[1]} = ${result}\n\n`);
    }, wait);    
};
  