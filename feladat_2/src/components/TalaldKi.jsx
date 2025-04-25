import React, { useState, useEffect } from 'react'

function Kartya(props) {
    return (
        <>
            <div>
                <p>Kártya: {props.kartya}</p>
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
            const kartya = `${szinek[Math.floor(Math.random() * szinek.length)]}${szamok[Math.floor(Math.random() * szamok.length)]}`
            if (!kartyak.includes(kartya)) {
                setKartyak(prevState => [...prevState, kartya])
                i++
            }
        }

        // Kiválasztjuk a kártyát
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
                <p>Az alábbi négy kártyából húzd ki azt a kártyát, amit választottam!</p>
                <p><button onClick={ujJatek}>Új játék!</button></p>
            </div>

            <div className="box">
                <h2>Debug</h2>
                <ul>
                    {kartyak.map((kartya) => {
                        return (<Kartya key={kartya} kartya={kartya} />)
                    })}
                </ul>
            </div>
        </>
    )
}