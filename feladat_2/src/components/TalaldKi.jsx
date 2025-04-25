import React, { useState, useEffect } from 'react'

function Kartya(props) {
    const [felforditva, setAllapot] = useState(props.felforditva)

    return (
        <>
            <div className={'card ' + (felforditva ? 'face' : 'back')} onClick={() => setAllapot(true)}>
                <p>{felforditva ? props.kartya : '??'}</p>
            </div>
        </>
    )
}

export default function TalaldKi() {
    const [kartyakSzama, setKartyakSzama] = useState(4)
    const [kartyak, setKartyak] = useState([])
    const [valasztott, setValasztott] = useState(0)

    const szinek = ['♣️', '♠️', '♥️', '♦️'] // remélem működik az emoji
    const szamok = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K']

    function ujJatek() {
        console.log("Új játék kezdése...")
        // Kiürítjük a húzott kártyákat
        setKartyak([])

        // Kártyákat húzunk
        let i = 0
        while (i < kartyakSzama) {
            let kartya = `${szinek[Math.floor(Math.random() * szinek.length)]}${szamok[Math.floor(Math.random() * szamok.length)]}`
            if (!kartyak.includes(kartya)) {
                setKartyak(prevState => [...prevState, kartya])
                i++
            }
        }

        // Kiválasztjuk a kártyát
        setValasztott(Math.floor(Math.random() * kartyak.length))
    }

    // Ez elvileg olyan, mint az onMounted
    useEffect(() => {
        console.log('auto húzás')
        ujJatek()
    }, [])

    return (
        <>
            <div className="box">
                <h2>Találd ki!</h2>
                <p>Húztam {kartyakSzama} kártyát, találd ki melyiket választottam!</p>
                <p><button onClick={ujJatek}>Új játék!</button></p>
                <div className="draw">
                    {kartyak.map((kartya, i) => {
                        return (<Kartya key={i} kartya={kartya} felforditva={false} />)
                    })}
                </div>
            </div>

            <div className="box">
                <h2>Debug</h2>
                <h3>Pakli:</h3>
                    {kartyak.map((kartya, i) => {
                        return (<Kartya key={i} kartya={kartya} felforditva={true} />)
                    })}
                <h3>Kiválasztott kártya</h3>
                <Kartya kartya={kartyak[valasztott]} felforditva={true} />
            </div>
        </>
    )
}